const express = require('express');
const path = require('path');

// ==========================================
// CONFIGURATION
// ==========================================

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// ==========================================
// SECURITY HEADERS
// ==========================================

app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none';"
    );
    
    next();
});

// ==========================================
// COMPRESSION & CACHING
// ==========================================

// Set cache headers based on file type
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    
    // Cache static assets for 1 year
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache CSS and JS for 1 week
    else if (['.css', '.js'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=604800, must-revalidate');
    }
    // Don't cache HTML
    else if (ext === '.html' || req.url === '/') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    
    next();
});

// ==========================================
// LOGGING
// ==========================================

// Simple request logger
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const status = res.statusCode;
        const ip = req.ip || req.connection.remoteAddress;
        
        console.log(`[${timestamp}] ${method} ${url} ${status} ${duration}ms - ${ip}`);
    });
    
    next();
});

// ==========================================
// STATIC FILE SERVING
// ==========================================

// Serve static files with proper MIME types
app.use(express.static(__dirname, {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html', 'htm'],
    index: false,
    maxAge: 0,
    redirect: false,
    setHeaders: (res, filePath) => {
        // Set proper MIME types
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };
        
        if (mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext]);
        }
    }
}));

// ==========================================
// ROUTES
// ==========================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV
    });
});

// Main routes - serve index.html for all page routes
const pageRoutes = ['/', '/contact', '/faq', '/tos', '/privacy'];

pageRoutes.forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler - catch all undefined routes
app.use((req, res) => {
    console.warn(`404 - Route not found: ${req.method} ${req.url}`);
    
    // If it's an API route, send JSON
    if (req.url.startsWith('/api/')) {
        res.status(404).json({
            error: 'Not Found',
            message: 'The requested resource was not found',
            path: req.url
        });
    } else {
        // For page routes, redirect to home
        res.redirect('/');
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    
    const statusCode = err.statusCode || 500;
    const message = isDevelopment ? err.message : 'Internal Server Error';
    
    // If headers already sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(err);
    }
    
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : message,
        ...(isDevelopment && { stack: err.stack })
    });
});

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

let server;

function gracefulShutdown(signal) {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
        
        // Force close after 10 seconds
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    } else {
        process.exit(0);
    }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ==========================================
// SERVER START
// ==========================================

server = app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('Military Essentials Website Server');
    console.log('='.repeat(50));
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Port: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
    console.log(`Started: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

module.exports = app;
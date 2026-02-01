# Military Essentials Website

Professional Discord bot hosting and management website with modern design, enhanced accessibility, and optimized performance.

## 🚀 Features

### Design & UX
- **Modern Railway-inspired design** with animated gradient background
- **Fully responsive** layout optimized for all devices
- **Smooth animations** with accessibility considerations (respects `prefers-reduced-motion`)
- **Dark theme** optimized for readability
- **Professional typography** with proper hierarchy

### Accessibility
- **WCAG 2.1 AA compliant** with proper ARIA labels
- **Keyboard navigation** support with focus management
- **Screen reader optimized** with announcements
- **Skip to content** link for keyboard users
- **Focus trap** in sidebar for better navigation
- **Semantic HTML** structure

### Performance
- **Optimized loading** with page loader and smooth transitions
- **Lazy loading** ready structure
- **Efficient animations** using CSS transforms
- **Debounced scroll handlers** for better performance
- **Asset caching** strategies implemented
- **Compressed responses** ready

### Security
- **Security headers** (CSP, X-Frame-Options, etc.)
- **XSS protection** enabled
- **Content Security Policy** configured
- **Safe URL handling** with validation
- **Error boundaries** and graceful degradation

### Developer Experience
- **Clean, modular code** with JSDoc comments
- **ES6+ JavaScript** with proper error handling
- **CSS custom properties** for easy theming
- **Comprehensive error logging** for debugging
- **Graceful shutdown** handling
- **Health check endpoint** for monitoring

## 📋 Pages

1. **Home** - Hero section with feature cards showcasing services
2. **Contact Us** - Professional contact form with validation and Discord/email info
3. **FAQ** - Accordion-style frequently asked questions (10+ common questions)
4. **Terms of Service** - Comprehensive hosting agreement
5. **Privacy Policy** - Detailed privacy and data handling information

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), CSS3, HTML5
- **Backend**: Node.js with Express
- **Hosting**: Railway-ready (optimized for cloud deployment)

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Local Setup

1. **Clone or download** the project files

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Run in production mode**:
   ```bash
   npm run prod
   ```

5. **Open your browser** to `http://localhost:3000`

## 🚢 Deployment

### Railway Deployment

#### Option 1: Deploy from GitHub

1. Push this project to a GitHub repository
2. Go to [Railway](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will automatically detect and deploy the Node.js project
7. Your website will be live at the provided Railway URL

#### Option 2: Deploy with Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize project:
   ```bash
   railway init
   ```

4. Deploy:
   ```bash
   railway up
   ```

5. Open your deployed site:
   ```bash
   railway open
   ```

### Other Platforms

The application is compatible with any Node.js hosting platform:
- **Heroku**: Add a `Procfile` with `web: node server.js`
- **Vercel**: Works out of the box with the `vercel.json` config
- **DigitalOcean**: Deploy as a standard Node.js app
- **AWS/GCP**: Use Elastic Beanstalk or App Engine

## 📁 File Structure

```
website/
├── index.html          # Main HTML file with all sections
├── styles.css          # Enhanced styles with CSS variables
├── script.js           # Improved JavaScript with error handling
├── server.js           # Express server with security and logging
├── package.json        # Dependencies and scripts
├── railway.json        # Railway deployment configuration
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── logo.jpg            # Company logo (JPEG)
├── logo.png            # Company logo (PNG, for favicons)
└── fist.png            # Additional brand asset
```

## 🎨 Customization

### Colors
Edit the CSS custom properties in `styles.css`:

```css
:root {
    --color-accent: #5865f2;          /* Primary brand color */
    --color-bg-primary: #0a0a0a;      /* Background */
    --color-text-primary: #ffffff;    /* Text */
    /* ... more variables */
}
```

### Content
Update the following sections in `index.html`:
- Hero section text and features
- Terms of Service content
- Privacy Policy content
- Footer information

### Logo
Replace `logo.jpg` and `logo.png` with your own branding (recommended size: 512x512px)

### Google Analytics

The site includes Google Analytics integration. To enable tracking:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Open `index.html` and replace both instances of `G-XXXXXXXXXX` with your actual ID:

```html
<!-- Find this in the <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); <!-- Replace this -->
</script>
```

**Note:** Analytics will only work once deployed to a public URL (not on localhost).

### Contact Form

The contact form is pre-built but currently shows a success message without actually sending emails. To make it functional, you have two options:

**Option 1: Use a Form Service (Easiest)**
- [Formspree](https://formspree.io/) - Free tier available
- [EmailJS](https://www.emailjs.com/) - Free tier available
- [Web3Forms](https://web3forms.com/) - Completely free

**Option 2: Build Your Own Backend**
- Add a POST endpoint at `/api/contact` in `server.js`
- Use Nodemailer or SendGrid to send emails
- See comments in `script.js` for the API call structure

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
PORT=3000
NODE_ENV=production
```

### Server Configuration

Edit `server.js` for:
- Custom security headers
- Cache policies
- Additional routes
- Middleware

## 📊 Monitoring

### Health Check Endpoint

Access the health check at `/health`:

```json
{
  "status": "healthy",
  "timestamp": "2026-02-01T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logging

The server logs all requests with:
- Timestamp
- HTTP method and URL
- Status code
- Response time
- Client IP address

Example log:
```
[2026-02-01T12:00:00.000Z] GET / 200 45ms - ::1
```

## 🧪 Testing

Run basic validation:
```bash
npm test
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy, change it:
```bash
PORT=8080 npm start
```

### Module Not Found
Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Deployment Issues on Railway
1. Check `railway.json` is present
2. Verify `package.json` has correct `start` script
3. Check Railway logs for specific errors

## 🔒 Security Features

- ✅ Content Security Policy (CSP)
- ✅ XSS Protection headers
- ✅ Clickjacking protection
- ✅ MIME type sniffing prevention
- ✅ Referrer policy
- ✅ Secure error handling
- ✅ Input validation
- ✅ Rate limiting ready structure

## ♿ Accessibility Features

- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Skip to content link
- ✅ Reduced motion support
- ✅ Semantic HTML
- ✅ High contrast ratios

## 📱 Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 📄 License

ISC License - See LICENSE file for details

## 👥 Credits

- **Design & Development**: Military Essentials™
- **Technical Implementation**: ArchiveAnt
- **Version**: 2.0.0
- **Last Updated**: February 2026

## 🤝 Contributing

This is a private project for Military Essentials. For issues or suggestions, contact the development team.

## 📞 Support

For support with hosting services, visit the website or contact Military Essentials through official channels.

---

**© 2026 Military Essentials™. All rights reserved.**
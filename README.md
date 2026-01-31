# Military Marketplace Services Website

Professional Discord bot hosting and management website.

## Features

- Modern Railway-inspired design
- Animated background with blurred circles
- Terms of Service page
- Privacy Policy page
- Fully responsive design

## Deployment to Railway

### Option 1: Deploy from GitHub

1. Push this `website` folder to a GitHub repository
2. Go to [Railway](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will automatically detect the Node.js project and deploy it
7. Your website will be live at the provided Railway URL

### Option 2: Deploy with Railway CLI

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
   cd website
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

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

## File Structure

- `index.html` - Main HTML file with all pages
- `styles.css` - Styling and animations
- `script.js` - Navigation and interactivity
- `server.js` - Express server for Railway deployment
- `package.json` - Node.js dependencies
- `railway.json` - Railway deployment configuration

## Logo

Make sure the `fist.png` logo file is in the parent directory (`../fist.png`) or update the path in `index.html`.

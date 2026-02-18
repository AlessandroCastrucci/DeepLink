# DV-Deeplink - Work in Progress

Temporary placeholder website for the DV-Deeplink project.

## About

This is a simple HTML placeholder page displaying the "Work in Progress" status for the DV-Deeplink application - Demonstrating Deeplinking for Digital Virgo Applications.

## Build Process

For CI/CD pipelines that require a build step:

```bash
npm install
npm run build
```

This creates a `dist/` folder containing the static files ready for deployment.

## Deployment

You can deploy this website with or without the build process. Simply upload the following files to any web server:

- `index.html` (main page)
- `public/` folder (contains the Work in Progress image)

Or deploy the contents of the `dist/` folder after running `npm run build`.

### Deployment Options

**Option 1: Traditional Web Hosting**
Upload `index.html` and the `public/` folder to your web server root directory.

**Option 2: GitHub Pages**
1. Push this repository to GitHub
2. Enable GitHub Pages in repository settings
3. Select the main branch as source

**Option 3: Netlify/Vercel**
Simply drag and drop the project folder into the deployment interface.

## Local Testing

Open `index.html` directly in your web browser, or use any simple HTTP server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`
# GitHub Pages Setup Instructions

## Enable GitHub Pages

To complete the GitHub Pages setup, you need to enable it in your repository settings:

### Step 1: Repository Settings
1. Go to your repository on GitHub: `https://github.com/tiation/tiation-rigger-platform`
2. Click on the **Settings** tab
3. Scroll down to **Pages** in the left sidebar

### Step 2: Configure Source
1. Under **Source**, select **GitHub Actions**
2. This will allow the workflow we created (`.github/workflows/deploy-pages.yml`) to deploy to Pages

### Step 3: Verify Deployment
1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (green checkmark)
4. Your site will be available at: `https://tiation.github.io/tiation-rigger-platform`

## Site URLs

Once deployed, your sites will be available at:

- **Main Platform**: https://tiation.github.io/tiation-rigger-platform
- **Developer Profile**: https://tiation.github.io/tiation-rigger-platform/profile

## Troubleshooting

### If the deployment fails:
1. Check the Actions tab for error messages
2. Ensure you have enabled GitHub Pages in Settings > Pages
3. Verify the workflow has proper permissions

### If pages don't load correctly:
1. Check browser developer tools for 404 errors
2. Ensure all asset paths are correct with the base path
3. Clear browser cache and try again

## Automatic Updates

The site will automatically update whenever you push changes to the `main` branch. The GitHub Actions workflow will:

1. Build the Next.js application for static export
2. Upload the generated files to GitHub Pages
3. Deploy the new version

## Local Development

To test the static export locally:

```bash
cd apps/web
npm run build
npx serve out
```

This will serve the static files on `http://localhost:3000` to preview how they'll appear on GitHub Pages.
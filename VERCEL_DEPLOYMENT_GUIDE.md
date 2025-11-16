# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Git installed on your computer

## Step-by-Step Deployment Process

### Option 1: Deploy via Vercel Dashboard (Recommended for Beginners)

#### Step 1: Push Your Code to GitHub

1. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Portfolio ready for deployment"
   ```

2. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `my-portfolio` or any name you prefer
   - Don't initialize with README (your project already has files)
   - Click "Create repository"

3. **Push your code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find your portfolio repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: Choose a name (e.g., `my-portfolio`)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `next build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Environment Variables** (if needed)
   - Click "Environment Variables"
   - Add any required variables (none needed for this project)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Your site will be live at: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI (Advanced)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Answer questions about project setup
   - Your site will be deployed!

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

### 1. Custom Domain (Optional)
1. Go to your project on Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add any secrets or API keys
3. Redeploy for changes to take effect

### 3. Automatic Deployments
- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment
- Pull requests get automatic preview URLs

## Troubleshooting

### Build Errors

**Error: Module not found**
```bash
# Solution: Install missing dependencies
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: Build failed**
```bash
# Solution: Test build locally first
npm run build

# If it works locally, check Vercel build logs
# Usually it's a missing environment variable
```

### Image Optimization Issues

If you see image errors, ensure `next.config.js` has proper image domains:
```javascript
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
```

## Performance Optimization

### 1. Enable Analytics
1. Go to Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. Enable Web Analytics (free)

### 2. Enable Speed Insights
1. Install package:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Add to `app/layout.tsx`:
   ```typescript
   import { SpeedInsights } from '@vercel/speed-insights/next'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     )
   }
   ```

### 3. Enable Web Vitals
1. Install package:
   ```bash
   npm install @vercel/analytics
   ```

2. Add to `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Remove a deployment
vercel rm [deployment-url]

# Link local project to Vercel
vercel link

# Pull environment variables
vercel env pull
```

## Best Practices

1. ✅ Always test `npm run build` locally before deploying
2. ✅ Use environment variables for sensitive data
3. ✅ Enable automatic deployments from GitHub
4. ✅ Use preview deployments for testing
5. ✅ Set up custom domain for professional look
6. ✅ Enable analytics to track performance
7. ✅ Keep dependencies updated

## Your Project URLs

After deployment, you'll get:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-branch.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support

## Quick Checklist Before Deployment

- [ ] All code is committed to Git
- [ ] `npm run build` works locally
- [ ] No console errors in browser
- [ ] All images load correctly
- [ ] Mobile responsive design works
- [ ] Theme toggle works
- [ ] All links work correctly
- [ ] Contact form (if any) is configured
- [ ] Environment variables are set (if needed)
- [ ] Custom domain DNS is configured (if using)

---

**Ready to Deploy?** Follow Option 1 above for the easiest deployment experience!

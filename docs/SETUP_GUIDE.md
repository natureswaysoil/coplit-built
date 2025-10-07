# Quick Setup Guide - Nature's Way Soil Improvements

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Resend account
- OpenAI API key
- Pictory API credentials (optional, for video generation)

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/natureswaysoil/coplit-built.git
cd coplit-built
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI (Required for chat)
OPENAI_API_KEY=sk-your_openai_key_here

# Resend (Required for emails)
RESEND_API_KEY=re_your_resend_key_here

# Pictory (Optional - only needed for video generation)
PICTORY_API_KEY=your_pictory_key
PICTORY_CLIENT_ID=your_client_id
PICTORY_CLIENT_SECRET=your_client_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://natureswaysoil.com
```

### 3. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to SQL Editor in your Supabase dashboard
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and run the SQL in the editor
6. Verify tables were created in the Table Editor

### 4. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain:
   - Go to Domains → Add Domain
   - Add DNS records to your domain provider
   - Wait for verification (can take up to 48 hours)
3. Create an API key:
   - Go to API Keys → Create API Key
   - Copy the key to your `.env.local`

### 5. Set Up OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key in the API Keys section
3. Add billing information (required for API access)
4. Copy the key to your `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your site!

### 7. Test Features

#### Test Chat Widget
1. Click the chat icon in the bottom right
2. Ask: "What's the best fertilizer for tomatoes?"
3. Verify you get an intelligent response

#### Test Email Capture
1. Scroll to the email capture section
2. Enter a test email
3. Check your Supabase dashboard for the new record
4. Check your email for the welcome message

#### Test Product Views
1. Visit any product page
2. Check Supabase `product_views` table for the new record

### 8. Deploy to Production

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

#### Option B: Other Platforms

Build the production version:
```bash
npm run build
npm start
```

Deploy the `.next` folder and `public` folder to your hosting provider.

## Verification Checklist

- [ ] Homepage loads with hero video section
- [ ] Chat widget appears and responds
- [ ] Email capture form works
- [ ] Product pages show inventory tracker
- [ ] Social proof notifications appear
- [ ] Personalized recommendations load
- [ ] All environment variables are set
- [ ] Supabase tables are created
- [ ] Resend domain is verified
- [ ] OpenAI API is working

## Common Issues

### Chat not working
**Problem**: Chat widget doesn't respond
**Solution**: 
- Check OpenAI API key is valid
- Verify you have billing set up on OpenAI
- Check browser console for errors

### Emails not sending
**Problem**: Welcome emails not arriving
**Solution**:
- Verify Resend domain is verified (check DNS records)
- Check Resend dashboard for delivery logs
- Make sure API key has send permissions

### Database errors
**Problem**: "relation does not exist" errors
**Solution**:
- Run the migration SQL again in Supabase
- Check that all tables were created
- Verify RLS policies are enabled

### Build errors
**Problem**: TypeScript or build errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. **Generate Videos** (Optional):
   ```bash
   python scripts/generate_all_videos.py
   ```

2. **Customize Content**:
   - Edit hero video script in `scripts/hero_video_script.txt`
   - Update product descriptions in `data/products.json`
   - Modify email templates in `lib/resend_client.ts`

3. **Configure Analytics**:
   - Add Google Analytics
   - Set up conversion tracking
   - Monitor Supabase metrics

4. **Test Email Flows**:
   - Sign up with test email
   - Add items to cart and abandon
   - Complete a test purchase

5. **Optimize Performance**:
   - Enable CDN for images
   - Set up caching headers
   - Monitor Core Web Vitals

## Support

Need help? Check:
- Full documentation: `docs/IMPROVEMENTS.md`
- GitHub Issues: https://github.com/natureswaysoil/coplit-built/issues
- Email: dev@natureswaysoil.com

## Security Notes

⚠️ **Important Security Reminders**:
- Never commit `.env.local` to git
- Use environment variables for all secrets
- Enable RLS on all Supabase tables
- Rotate API keys regularly
- Monitor API usage for anomalies

## Cost Estimates

Monthly costs for typical usage (1000 visitors/month):

- **Supabase**: Free tier (up to 500MB database)
- **Resend**: Free tier (100 emails/day)
- **OpenAI**: ~$10-20 (depends on chat usage)
- **Pictory**: ~$29/month (if generating videos)
- **Vercel**: Free tier (hobby projects)

**Total**: $10-50/month depending on usage

## Performance Targets

- **Lighthouse Score**: 90+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Chat Response Time**: < 2s
- **Email Delivery**: < 30s

---

Ready to launch! 🚀

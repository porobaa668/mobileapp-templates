ange# Deployment Setup Guide

This guide walks you through setting up automated deployment of React Native + Expo mobile app templates to Cloudflare R2 using GitHub Actions.

## Prerequisites

1. **Cloudflare Account** with R2 enabled
2. **GitHub Repository** with this template code
3. **R2 Bucket** created (recommended name: `mobileapp-templates`)

## Step-by-Step Setup

### Step 1: Create a Cloudflare R2 Bucket

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage** in the sidebar
3. Click **Create bucket**
4. Choose bucket name: `mobileapp-templates`
5. Select a location (use "Automatic" for optimal performance)
6. Click **Create bucket**

### Step 2: Create R2 API Token

1. In the Cloudflare Dashboard, go to **R2 Object Storage**
2. Click **Manage R2 API tokens** (under Account details)
3. Click **Create API token**
4. Configure the token:
   - **Token name**: `GitHub Actions Template Deployment`
   - **Permissions**: Select **Object Read and Write**
   - **Bucket**: Select `mobileapp-templates`
   - **TTL**: Leave default or set to "Custom" for longer validity
5. Click **Create API Token**
6. **Important**: Copy the **Access Key ID** and **Secret Access Key** immediately

### Step 3: Get Your Cloudflare Account ID

1. In the Cloudflare Dashboard, go to the right sidebar
2. Under **Account details**, copy your **Account ID**

### Step 4: Configure GitHub Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** and add:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `R2_ACCOUNT_ID` | Your Cloudflare Account ID | Found in Dashboard sidebar |
| `R2_ACCESS_KEY_ID` | Your R2 API Token Access Key | From Step 2 |
| `R2_SECRET_ACCESS_KEY` | Your R2 API Token Secret Key | From Step 2 |
| `R2_BUCKET_NAME` | `mobileapp-templates` | Your bucket name |

### Step 5: Enable R2 Public Access (Optional)

If you want templates to be publicly accessible via HTTP:

1. Go to your R2 bucket in the Cloudflare Dashboard
2. Click **Settings** tab
3. Under **Public access**, click **Allow Access**
4. Your templates will be available at:
   - **Catalog**: `https://mobileapp-templates.r2.dev/template_catalog.json`
   - **Templates**: `https://mobileapp-templates.r2.dev/templates/expo-agents.zip`

### Step 6: Test the Deployment

1. Push a commit to the `main` branch
2. Go to **Actions** tab in your GitHub repository
3. Watch the "Deploy Templates to Cloudflare R2" workflow run
4. Check the deployment summary for success status

## What the Workflow Does

The GitHub Actions workflow automatically:

1. **Generates** all Expo templates from definitions
2. **Creates** the template catalog JSON
3. **Packages** optimized zip files for each template:
   - Maximum compression
   - Excludes `node_modules`, `.git`, etc.
4. **Uploads** to R2 bucket:
   - `template_catalog.json` in root
   - Template zips in `/templates/` folder
5. **Provides** deployment summary with URLs

## R2 Bucket Structure

After deployment:

```
mobileapp-templates/
├── template_catalog.json
└── templates/
    ├── expo-blank.zip
    ├── expo-DO.zip
    ├── expo-DO-v2.zip
    └── expo-agents.zip
```

## Available Templates

| Template | Description |
|----------|-------------|
| `expo-blank` | Basic React Native + Expo with Cloudflare Workers |
| `expo-DO` | Expo + Durable Objects for stateful storage |
| `expo-DO-v2` | Expo + Multi-entity DO storage |
| `expo-agents` | Expo + AI Agents with MCP integration |

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use repository secrets** for all sensitive information
3. **Limit API token permissions** to Object Read & Write only
4. **Scope tokens to specific buckets** rather than account-wide
5. **Monitor usage** in the Cloudflare Dashboard

## Troubleshooting

### "Access Denied" Error
- **Cause**: Incorrect API credentials or insufficient permissions
- **Solution**: Verify `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are correct

### "Bucket Not Found" Error
- **Cause**: Incorrect bucket name
- **Solution**: Check `R2_BUCKET_NAME` matches your actual bucket name

### "Invalid Account ID" Error
- **Cause**: Wrong account ID
- **Solution**: Verify `R2_ACCOUNT_ID` matches your Cloudflare account

### Workflow Fails on Upload
- **Cause**: Network issues or rate limiting
- **Solution**: Re-run the workflow

## Manual Deployment

You can also deploy manually:

```bash
# Set environment variables
export R2_BUCKET_NAME=mobileapp-templates

# Run deployment script
bash deploy_templates.sh
```

Or trigger via GitHub:

1. Go to **Actions** tab
2. Select "Deploy Templates to Cloudflare R2"
3. Click **Run workflow**

## Integration with mobileapp-production

The main `mobileapp-production` app fetches templates from this R2 bucket.

Configure in `wrangler.jsonc`:
```jsonc
{
  "vars": {
    "TEMPLATES_R2_BUCKET": "mobileapp-templates"
  }
}
```

The AI system will automatically select the appropriate template based on user requirements:
- Simple apps → `expo-blank`
- Stateful apps → `expo-DO` or `expo-DO-v2`
- AI/Chat apps → `expo-agents`

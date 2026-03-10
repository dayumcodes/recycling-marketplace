# Deploy B2B Medusa Backend and Storefront on Azure

This guide walks you through deploying **b2b-medusa** (Medusa v2 backend) and **b2b-medusa-storefront** (Next.js storefront) on Azure. No code changes are required; only Azure resource creation, configuration, and deployment steps.

---

## Prerequisites

- **Azure subscription** (e.g. Visual Studio Enterprise Subscription).
- **Azure CLI** installed and logged in (`az login`).
- **Node.js 20+** and **npm** on your machine (for local build and deploy, or use GitHub Actions).
- **Git** (if you deploy from a repository).
- **Medusa backend** running locally at least once so you have run migrations and created a publishable API key (you will reuse the key or create a new one in Admin after deploy).

---

## Part 1: Create Azure resources

### 1.1 Sign in and set subscription

```bash
az login
az account set --subscription "Visual Studio Enterprise Subscription"
az account show
```

### 1.2 Create resource group

Pick a region (e.g. `uaenorth` to match your existing resources, or `eastus`).

```bash
RESOURCE_GROUP="rg-b2b-marketplace"
LOCATION="uaenorth"

az group create --name $RESOURCE_GROUP --location $LOCATION
```

### 1.3 Create PostgreSQL Flexible Server (for Medusa)

Medusa requires PostgreSQL. Use Azure Database for PostgreSQL flexible server.

```bash
# Names must be globally unique
POSTGRES_SERVER="psql-b2b-marketplace"
POSTGRES_ADMIN_USER="marketplace"
POSTGRES_ADMIN_PASSWORD="marketplace123"
POSTGRES_DB_NAME="marketplace-db"

# Create the server (takes a few minutes)
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_ADMIN_USER \
  --admin-password $POSTGRES_ADMIN_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16
```

Create the database and allow Azure services + your IP to connect:

```bash
# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB_NAME

# Allow Azure services (e.g. App Service) to connect
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Optional: allow your current IP for debugging
MY_IP=$(curl -s ifconfig.me)
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --rule-name AllowMyIP \
  --start-ip-address $MY_IP \
  --end-ip-address $MY_IP
```

Build the Medusa connection string (replace password):

```text
DATABASE_URL=postgres://medusaadmin:<POSTGRES_ADMIN_PASSWORD>@psql-b2b-scrapcircle.postgres.database.azure.com:5432/medusa?sslmode=require
```

(Use the actual server FQDN from the Azure portal if different.)

### 1.4 Create App Service plan and Web Apps

One plan can host both apps, or use two plans. Below: one plan, two Web Apps.

```bash
APP_SERVICE_PLAN="plan-b2b-marketplace"
MEDUSA_APP_NAME="b2b-medusa-backend"
STOREFRONT_APP_NAME="b2b-marketplace-storefront"

# Create App Service plan (Linux, Node)
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --location $LOCATION \
  --is-linux \
  --sku B1

# Backend (Medusa)
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $MEDUSA_APP_NAME \
  --runtime "NODE:20-lts"

# Storefront (Next.js)
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $STOREFRONT_APP_NAME \
  --runtime "NODE:20-lts"
```

Note the default URLs (replace with your actual names if different):

- Medusa backend: `https://b2b-medusa-backend.azurewebsites.net`
- Storefront: `https://b2b-scrapcircle-storefront.azurewebsites.net`

### 1.5 Configure Medusa backend (b2b-medusa) on Azure

Set **Startup Command** so the app runs `medusa start` (or `npm start`):

```bash
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $MEDUSA_APP_NAME \
  --startup-file "npm start"
```

Add application settings (env vars). Replace placeholders:

```bash
# Generate a random secret for JWT/COOKIE (e.g. openssl rand -hex 32)
JWT_SECRET="<your-jwt-secret>"
COOKIE_SECRET="<your-cookie-secret>"
DATABASE_URL="postgres://medusaadmin:<PASSWORD>@psql-b2b-scrapcircle.postgres.database.azure.com:5432/medusa?sslmode=require"

# Storefront URL (your deployed storefront)
STOREFRONT_URL="https://b2b-scrapcircle-storefront.azurewebsites.net"

az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $MEDUSA_APP_NAME \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="$DATABASE_URL" \
    JWT_SECRET="$JWT_SECRET" \
    COOKIE_SECRET="$COOKIE_SECRET" \
    STORE_CORS="$STOREFRONT_URL,https://b2b-scrapcircle-storefront.azurewebsites.net" \
    ADMIN_CORS="https://$MEDUSA_APP_NAME.azurewebsites.net,https://portal.azure.com,$STOREFRONT_URL" \
    AUTH_CORS="https://$MEDUSA_APP_NAME.azurewebsites.net,$STOREFRONT_URL"
```

If you use Redis in production, create Azure Cache for Redis, then add:

```bash
REDIS_URL="<your-azure-redis-connection-string>"
# Add REDIS_URL to the appsettings set above
```

### 1.6 Configure Storefront (b2b-medusa-storefront) on Azure

Set startup for Next.js (run `npm start`):

```bash
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $STOREFRONT_APP_NAME \
  --startup-file "npm start"
```

Set application settings. Replace `MEDUSA_BACKEND_URL` and publishable key:

```bash
MEDUSA_BACKEND_URL="https://b2b-medusa-backend.azurewebsites.net"
NEXT_PUBLIC_MEDUSA_BACKEND_URL="$MEDUSA_BACKEND_URL"
NEXT_PUBLIC_BASE_URL="https://b2b-scrapcircle-storefront.azurewebsites.net"
# Use the publishable key from your Medusa Admin (create one if needed)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_xxxx"

az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $STOREFRONT_APP_NAME \
  --settings \
    NODE_ENV=production \
    MEDUSA_BACKEND_URL="$MEDUSA_BACKEND_URL" \
    NEXT_PUBLIC_MEDUSA_BACKEND_URL="$NEXT_PUBLIC_MEDUSA_BACKEND_URL" \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" \
    NEXT_PUBLIC_BASE_URL="$NEXT_PUBLIC_BASE_URL" \
    NEXT_PUBLIC_DEFAULT_REGION=in \
    REVALIDATE_SECRET="<random-secret-for-revalidation>"
```

(Add `NEXT_PUBLIC_STRIPE_KEY` and other optional vars if you use them.)

---

## Part 2: Deploy the applications

### 2.1 Deploy Medusa backend (b2b-medusa)

From your machine, in the **b2b-medusa** folder:

```bash
cd b2b-medusa

# Install dependencies and build
npm ci
npm run build

# Create a deployable package (no node_modules in zip if you use remote build)
# Option A: Zip and deploy (Azure runs npm install and build if you configure it)
zip -r ../medusa-deploy.zip . -x "node_modules/*" -x ".git/*"

# Deploy zip to the Web App
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $MEDUSA_APP_NAME \
  --src-path ../medusa-deploy.zip \
  --type zip
```

**Alternative (full local build and deploy):** Include `node_modules` and the build output, then zip and deploy so the app only runs `npm start`. Ensure `package.json` has `"start": "medusa start"` (or `node dist/main.js` if your build outputs there). Then:

```bash
npm ci --production=false
npm run build
# Zip including node_modules and dist (or .medusa build output)
# Upload via az webapp deploy or Azure DevOps / GitHub Actions
```

**Run migrations (first time)** after deploy. Use SSH or Console in Azure Portal, or run locally against the production DB (not recommended for production; prefer a release pipeline step):

```bash
# From your repo (with DATABASE_URL pointing to Azure Postgres)
DATABASE_URL="postgres://..." npx medusa db:migrate
```

Or in Azure Portal: **Web App → Advanced Tools (Kudu) → SSH**, then:

```bash
cd /home/site/wwwroot
npx medusa db:migrate
```

After the backend is up, open **Admin**: `https://b2b-medusa-backend.azurewebsites.net/app`. Log in and create or copy a **publishable API key**, then set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in the storefront App Service settings.

### 2.2 Deploy Next.js storefront (b2b-medusa-storefront)

Next.js on App Service runs in Node.js mode (`next start`). Build locally or in CI and deploy the built app.

From the **b2b-medusa-storefront** folder:

```bash
cd b2b-medusa-storefront

# Set env for build (use production backend URL and a placeholder key if needed)
export NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://b2b-medusa-backend.azurewebsites.net"
export NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_placeholder"
export NEXT_PUBLIC_BASE_URL="https://b2b-scrapcircle-storefront.azurewebsites.net"

npm ci
npm run build

# Create zip (Azure will run npm install --production && npm start if you deploy without node_modules)
zip -r ../storefront-deploy.zip . -x "node_modules/*" -x ".next/cache/*" -x ".git/*"
```

Deploy the zip:

```bash
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $STOREFRONT_APP_NAME \
  --src-path ../storefront-deploy.zip \
  --type zip
```

If the Web App is configured to use **remote build** (default for some runtimes), Azure may run `npm install` and `npm run build` on the server; in that case, ensure **Application settings** (including `NEXT_PUBLIC_*`) are set **before** deploy so the build uses the correct values. Alternatively, build locally (or in GitHub Actions) and deploy the `.next` folder and `node_modules` so the server only runs `npm start`.

---

## Part 3: Post-deploy checklist

1. **Backend**
   - Open `https://<medusa-app-name>.azurewebsites.net/app` and log in.
   - Create a **publishable API key** (Settings → Publishable API Keys) if you didn’t reuse one.
   - Update the storefront’s `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in Azure App Service settings and restart the storefront app.

2. **CORS**
   - In Medusa Admin or via env, ensure `STORE_CORS` includes the exact storefront URL (e.g. `https://b2b-scrapcircle-storefront.azurewebsites.net`). No trailing slash.

3. **Regions**
   - In Medusa Admin, ensure at least one region (e.g. India) exists and has countries and currency so the storefront can load.

4. **Storefront**
   - Visit `https://<storefront-app-name>.azurewebsites.net` and confirm the home page loads and can call the backend (e.g. no “fetch failed” or “valid publishable key” errors).

5. **Custom domain (optional)**
   - In Azure: Web App → Custom domains → Add (e.g. `store.scrapcircle.com`). Add the CNAME or A record as shown. Bind TLS if needed.

---

<!-- ------------------------------------------------------------------------------------------------- -->


Here are the **next steps in the Azure Portal** only (using your resource group **recycling-marketplace-rg**, UAE North):

---

## Step 1: Create PostgreSQL Flexible Server

1. In the resource group **recycling-marketplace-rg**, click **+ Create**.
2. Search for **Azure Database for PostgreSQL** and choose **Azure Database for PostgreSQL** (the one with “Flexible server” in the description).
3. Click **Create**.
4. **Basics** tab:
   - **Subscription:** Visual Studio Enterprise Subscription  
   - **Resource group:** recycling-marketplace-rg  
   - **Server name:** e.g. `psql-b2b-marketplace` (must be globally unique; try a variant if taken).  
   - **Region:** UAE North  
   - **PostgreSQL version:** 16  
   - **Workload type:** Development (or Production if you prefer).  
   - **Compute + storage:** e.g. Burstable, B1ms, 32 GiB storage.  
   - **Authentication:** PostgreSQL authentication.  
   - **Admin username:** e.g. `marketplace` (or `medusaadmin`).  
   - **Password:** set a strong password and **save it** (you’ll need it for `DATABASE_URL`).
5. **Networking** tab:
   - **Connectivity method:** Public access (or Private if you use VNet).  
   - **Firewall rules:**  
     - Add **Allow public access from any Azure service within Azure to this server** (checkbox).  
     - Add a rule to allow your IP (e.g. “My IP”) so you can connect for migrations.
6. Leave other tabs as default, then **Review + create** → **Create**. Wait until the server is created.

---

## Step 2: Create the database on the server

1. Go to **All resources** (or the resource group) and open the **PostgreSQL flexible server** you just created.
2. In the left menu, under **Settings**, click **Databases**.
3. Click **+ Add**.
4. **Database name:** e.g. `marketplace-db` (or `medusa`).  
5. Click **Save**.

---

## Step 3: Note the PostgreSQL connection details

1. On the same PostgreSQL server resource, open **Overview**.
2. Copy the **Server name** (e.g. `psql-b2b-marketplace.postgres.database.azure.com`).
3. Your connection string will be:
   - `postgres://<admin-username>:<password>@<server-name>:5432/marketplace-db?sslmode=require`  
   Replace `<admin-username>`, `<password>`, and `<server-name>` with the values you used.
postgres://recycling_marketplace:<password>@recycling-marketplace-psql.postgres.database.azure.com:5432/postgres?sslmode=require
postgres://recycling_marketplace:Marketplace@123@recycling-marketplace-psql.postgres.database.azure.com:5432/postgres?sslmode=require
---

## Step 4: Create App Service plan

1. In **recycling-marketplace-rg**, click **+ Create**.
2. Search for **App Service** and select it → **Create**.
3. **Basics** tab:
   - **Subscription:** Visual Studio Enterprise Subscription  
   - **Resource group:** recycling-marketplace-rg  
   - **Name:** e.g. `b2b-medusa-backend` (this will be the **backend** app first).  
   - **Publish:** Code  
   - **Runtime stack:** Node 20 LTS  
   - **Operating system:** Linux  
   - **Region:** UAE North  
   - **Pricing:** e.g. Basic B1 (or your chosen plan).
4. Click **Review + create** → **Create**.  
   After creation you’ll have one Web App. You’ll create the second one next.

---

## Step 5: Create the second Web App (storefront)

1. In **recycling-marketplace-rg**, click **+ Create**.
2. Search for **Web App** → **Create**.
3. **Basics** tab:
   - **Resource group:** recycling-marketplace-rg  
   - **Name:** e.g. `b2b-marketplace-storefront` (globally unique).  
   - **Publish:** Code  
   - **Runtime:** Node 20 LTS, Linux  
   - **Region:** UAE North  
   - **App Service plan:** Select the **same plan** you created in Step 4 (so both apps share one plan).
4. **Review + create** → **Create**.

You should now have:
- 1 App Service plan  
- 2 Web Apps: one backend (e.g. `b2b-medusa-backend`), one storefront (e.g. `b2b-marketplace-storefront`).

---

## Step 6: Configure the Medusa backend Web App

1. Open the **backend** Web App (e.g. `b2b-medusa-backend`).
2. **Startup command:**
   - Left menu: **Settings** → **Configuration** → **General settings**.
   - **Startup Command:** `npm start`  
   - Save.
3. **Application settings (env vars):**
   - **Settings** → **Configuration** → **Application settings** → **+ New application setting**.
   - Add each of these (replace placeholders with your real values):

   - `NODE_ENV` = `production`  
   - `DATABASE_URL` = `postgres://marketplace:<your-password>@psql-b2b-marketplace.postgres.database.azure.com:5432/marketplace-db?sslmode=require`  
   - `JWT_SECRET` = (e.g. a long random string)  
   - `COOKIE_SECRET` = (e.g. a long random string)  
   - `STORE_CORS` = `https://b2b-marketplace-storefront.azurewebsites.net`  
   - `ADMIN_CORS` = `https://b2b-medusa-backend.azurewebsites.net,https://b2b-marketplace-storefront.azurewebsites.net`  
   - `AUTH_CORS` = `https://b2b-medusa-backend.azurewebsites.net,https://b2b-marketplace-storefront.azurewebsites.net`  

   Use your **actual** backend and storefront URLs if the names are different.  
   - Save (top of Application settings) and **Restart** the app if prompted.

---

## Step 7: Configure the storefront Web App

1. Open the **storefront** Web App (e.g. `b2b-marketplace-storefront`).
2. **Startup command:**
   - **Configuration** → **General settings** → **Startup Command:** `npm start` → Save.
3. **Application settings:**
   - **Configuration** → **Application settings**, add:

   - `NODE_ENV` = `production`  
   - `MEDUSA_BACKEND_URL` = `https://b2b-medusa-backend.azurewebsites.net`  
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` = `https://b2b-medusa-backend.azurewebsites.net`  
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` = (your publishable key from Medusa Admin, e.g. `pk_...`)  
   - `NEXT_PUBLIC_BASE_URL` = `https://b2b-marketplace-storefront.azurewebsites.net`  
   - `NEXT_PUBLIC_DEFAULT_REGION` = e.g. `in`  
   - `REVALIDATE_SECRET` = (any random secret string)  

   Adjust URLs if your app names differ.  
   - Save and restart if needed.

---

## Step 8: Deploy the code (from the portal)

You still need to get your code onto the Web Apps. From the portal you can do:

**Option A – Zip deploy (via portal)**  
1. On your PC: build the app (e.g. `npm ci`, `npm run build`), create a zip of the project (excluding `node_modules` if you use “Run from package” or SCM build).  
2. In the backend Web App: **Deployment** → **Deployment Center** → **Settings** tab.  
3. **Source:** Zip Deploy (or “Local Git” / “GitHub” if you prefer).  
4. If Zip is available: upload the zip and deploy.  
5. Repeat for the storefront Web App.

**Option B – Deployment Center (GitHub)**  
1. In each Web App, open **Deployment Center**.  
2. **Source:** GitHub → authorize and select repo + branch.  
3. Configure build: for Node, Azure often runs `npm install` and `npm run build` (or you set a custom script).  
4. Save; Azure will build and deploy.  
   For the storefront, ensure **Application settings** (especially `NEXT_PUBLIC_*`) are set **before** the first build so the build uses the correct backend URL and key.

**Option C – FTP / VS Code Azure extension**  
You can also deploy by uploading files via FTP or using the “Deploy to Web App” from VS Code; the important part is that the backend runs `npm start` and the storefront runs `npm start` after a successful `npm run build`.

---

## Step 9: After first deploy – backend

1. Run migrations on the **production** database (from your machine with `DATABASE_URL` pointing to Azure, or via **Advanced Tools (Kudu)** → **SSH** on the backend Web App, then `npx medusa db:migrate` in `/home/site/wwwroot`).
2. Open **https://&lt;your-backend-app-name&gt;.azurewebsites.net/app**, log in to Medusa Admin, and create or copy a **Publishable API key**.
3. Put that key in the **storefront** Web App’s **Application settings** as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, then restart the storefront.

---

## Quick order summary (portal only)

1. Create **PostgreSQL Flexible Server** in recycling-marketplace-rg (with firewall rules).  
2. Create **database** on that server.  
3. Create **App Service** (backend) → then create **second Web App** (storefront) on the **same** plan.  
4. Configure **backend**: startup `npm start` + app settings (DB, CORS, secrets).  
5. Configure **storefront**: startup `npm start` + app settings (backend URL, publishable key, base URL).  
6. Deploy code to both apps (Deployment Center / zip / GitHub).  
7. Run migrations, set publishable key in Admin, then add that key to the storefront and restart.

If you tell me your exact backend and storefront app names (and whether you’ll use GitHub or zip), I can give you the exact URLs and a minimal list of app settings to paste.
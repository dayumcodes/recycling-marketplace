import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const fileBackendBase =
  process.env.MEDUSA_FILE_BACKEND_URL?.replace(/\/$/, "") ||
  process.env.MEDUSA_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:9000"

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    [Modules.FILE]: {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              backend_url: `${fileBackendBase}/static`,
            },
          },
        ],
      },
    },
    sellerModule: {
      resolve: "./src/modules/seller",
      definition: {
        isQueryable: true,
      },
    },
  },
})

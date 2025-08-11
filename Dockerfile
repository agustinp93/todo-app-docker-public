# ------------ 0. base image ------------
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ------------ 1. deps ------------
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev                # prod deps only

# ------------ 2. builder ------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build                    # creates .next/standalone + .next/static

# ------------ 3. runner ------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Stand-alone server bundle (includes minimal node_modules)
COPY --from=builder /app/.next/standalone ./

# Expose and launch
EXPOSE 3000
CMD ["node", "server.js"]

# Install dependencies only when needed
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

COPY .yarn/releases/yarn-4.3.1.cjs .yarn/releases/yarn-4.3.1.cjs

RUN yarn install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 demogroup
RUN adduser --system --uid 1001 demouser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=demouser:demogroup /app/.next/standalone ./
COPY --from=builder --chown=demouser:demogroup /app/.next/static ./.next/static

USER demouser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
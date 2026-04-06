FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
ENV DATABASE_URL="file:./prisma/prod.db"
RUN npm ci
COPY . .
RUN npx prisma migrate deploy
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3300
ENV DATABASE_URL="file:./prisma/prod.db"
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
EXPOSE 3300
CMD ["node", "server.js"]

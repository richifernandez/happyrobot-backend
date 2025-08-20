# ---------- Stage 1: build ----------
    FROM node:20-slim AS builder
    WORKDIR /app
    
    # Instala TODAS las deps (incluye typescript)
    COPY package*.json ./
    RUN npm ci
    
    # Copia el código y compila
    COPY . .
    RUN npm run build
    
    # ---------- Stage 2: runtime ----------
    FROM node:20-slim AS runner
    WORKDIR /app
    
    # Solo deps de producción
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # Copia el build y assets necesarios
    COPY --from=builder /app/dist ./dist
    # Tus estáticos del dashboard (sirves /public desde process.cwd())
    COPY --from=builder /app/public ./public
    # IMPORTANTE: copia los JSON a dist/data (TS no los copia)
    COPY --from=builder /app/src/data ./dist/data
    
    EXPOSE 3000
    CMD ["node", "dist/server.js"]
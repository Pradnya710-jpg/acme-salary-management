FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY tsconfig.json ./
COPY src ./src
RUN npm install --no-save typescript tsx && npm run build
EXPOSE 4000
CMD ["node","dist/server.js"]

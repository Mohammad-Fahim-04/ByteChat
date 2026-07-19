FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

ENV NODE_ENV=production
ENV PORT=8080

RUN chown -R node:node /app
USER node

EXPOSE 8080

CMD ["node", "server.js"]

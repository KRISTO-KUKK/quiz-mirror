FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server
COPY views ./views
COPY script ./script
COPY src ./src
COPY style.css ./style.css

ENV NODE_ENV=production
ENV PORT=8118

EXPOSE 8118

CMD ["npm", "start"]

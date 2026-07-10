FROM node:24

WORKDIR /app

COPY package*.json ./
COPY .npmrc  ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

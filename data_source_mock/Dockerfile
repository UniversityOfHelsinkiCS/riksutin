# Use official Node.js LTS image
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

# docker build --platform linux/amd64 -t mluukkai/riksutin_datasource_mock .
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh -s -- --ci
ENV PATH="/root/.safe-chain/shims:/root/.safe-chain/bin:${PATH}"
RUN npm safe-chain-verify

RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

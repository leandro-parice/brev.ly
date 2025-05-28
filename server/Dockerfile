FROM node:20-alpine3.21

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 3333

CMD ["npm", "start"]
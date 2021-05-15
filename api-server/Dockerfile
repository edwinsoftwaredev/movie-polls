# Production Environment
FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npx prisma generate
# RUN npx prisma migrate deploy
# JavaScript files are generated from the TypeScript files
RUN npm run build
EXPOSE 4000
ENTRYPOINT [ "npm", "run", "start" ]
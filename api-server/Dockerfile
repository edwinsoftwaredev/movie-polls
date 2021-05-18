# Database Migration & Production Build
FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npx prisma generate
# JavaScript files are generated from the TypeScript files
RUN npm run build
EXPOSE 4000
# db migrations and back-end services have to be executed
# independently. In this case both are executed when the container starts.
ENTRYPOINT npx prisma migrate deploy && npm start

# Containarized DBs are a good solution only when the stored data
# is ephemeral or when data loss is acceptable (e.g caches, etc...).
# Containers are ephemeral, Databases in general are stateful and persistent.
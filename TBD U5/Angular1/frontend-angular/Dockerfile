# Etapa de build con Node 22
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa final con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend-angular /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

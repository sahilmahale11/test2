# Build step #1: build the React front end
FROM node:16.20 as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN rm -rf node_modules
RUN npm install -g npm@9.3.1
RUN npm install
RUN npm run build -- --force

# Build step #2: build an nginx container
FROM nginx:stable-alpine
WORKDIR /app
COPY --from=build-step /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
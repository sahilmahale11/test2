FROM node:16.20
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN npm install -g npm@9.8.1
RUN npm install
EXPOSE 80
CMD npm run stage
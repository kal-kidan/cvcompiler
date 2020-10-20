FROM node:12-stretch-slim
FROM mongodb:4.0.20-xenial
WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
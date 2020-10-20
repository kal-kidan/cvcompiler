FROM node:12-stretch-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
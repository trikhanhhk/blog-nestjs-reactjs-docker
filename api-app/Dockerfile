FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

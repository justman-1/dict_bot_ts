FROM node:17
WORKDIR /app
COPY package*.json ./
RUN npm i 
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
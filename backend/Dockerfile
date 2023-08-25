#build
FROM node:18.15.0 

WORKDIR /backend

COPY package.json ./
COPY src ./
COPY tsconfig.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
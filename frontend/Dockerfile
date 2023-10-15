#build
FROM node:18.15.0 as build

WORKDIR /frontend
COPY package.json ./
COPY src ./
COPY public ./
COPY tsconfig.json ./


RUN npm install
COPY . ./

RUN npm run build

EXPOSE 3000
# run app
CMD ["npx", "serve", "build"]
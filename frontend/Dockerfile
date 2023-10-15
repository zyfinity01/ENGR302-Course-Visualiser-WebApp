#build
FROM node:18.15.0 as build

WORKDIR /frontend
COPY package.json ./
COPY src ./
COPY public ./
COPY tsconfig.json ./

RUN npm install
COPY . ./

ARG REACT_APP_COURSE_API_URL
ENV REACT_APP_COURSE_API_URL=$REACT_APP_COURSE_API_URL

RUN npm run build

EXPOSE 3000
# run app
CMD ["npx", "serve", "build"]
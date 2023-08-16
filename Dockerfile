FROM node:18-alpine
# ENV NODE_ENV=production

WORKDIR /bmireact

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

CMD ["npm", "start"]

EXPOSE 5000
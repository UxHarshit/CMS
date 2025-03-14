FROM node:lts AS runtime
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000
EXPOSE 25
EXPOSE 465
EXPOSE 587

CMD ["node", "server.js"]

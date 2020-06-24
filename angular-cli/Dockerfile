FROM node:10

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli@latest --unsafe && npm install && npm install --save core-js@^2.5.0

CMD ["npm", "start"]
#dev mode
FROM node:latest AS dev
# RUN apk add --no-cache tzdata
ENV NODE_PATH /opt/server/node_modules

WORKDIR /opt/server/

CMD [ "node" ]

#production mode

FROM node:latest AS production
ENV NODE_PATH /server/node_modules
# RUN apk add --no-cache tzdata
WORKDIR /opt/server/

COPY /*.json ./

RUN npm i

CMD ["sh","-c","npm run start"]




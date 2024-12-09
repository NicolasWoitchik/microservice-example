FROM node:18-alpine AS base

ENV CI=true

RUN apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

FROM base AS builder

RUN apk add --no-cache git curl

RUN mkdir -p /tmp
WORKDIR /tmp

COPY package*.json yarn.lock tsconfig.json tsconfig.build.json /tmp/
RUN yarn install --frozen-lockfile

COPY /src /tmp/src
RUN yarn run build && \
    rm -rf /tmp/node_modules

# Can be setted only after build
ENV NODE_ENV=production

RUN yarn install --production=true --prefer-offline && \
    rm -rf .npmrc


FROM base AS final
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /tmp/node_modules /usr/src/app/node_modules
COPY --from=builder /tmp/dist /usr/src/app/dist
COPY package.json /usr/src/app/

EXPOSE 8080 9001

CMD ["/usr/src/app/dist/main.js"]
#
# Build
#

FROM node:18 AS build
WORKDIR /build

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

#
# Dependencies
#

FROM node:18 AS deps
WORKDIR /build

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

#
# Final
#

FROM gcr.io/distroless/nodejs:18
WORKDIR /app

USER 1000
COPY --from=build /build/dist ./dist
COPY --from=deps /build/node_modules ./node_modules
COPY package.json ./

CMD [ "./dist/main" ]

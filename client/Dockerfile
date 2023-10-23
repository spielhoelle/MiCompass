FROM --platform=linux/amd64 node:16.20.2
LABEL org.opencontainers.image.source https://github.com/spielhoelle/micompass-client
WORKDIR /home/app/client

ENV PATH /home/app/client/node_modules/.bin:$PATH
RUN corepack enable && corepack prepare pnpm@8.9.2 --activate 
ENV NODE_ENV=production

COPY package.json yarn.lock ./
COPY . .
RUN pnpm install
EXPOSE 3001
CMD ["npm", "start"]
FROM --platform=linux/amd64 node:18.17.1
LABEL org.opencontainers.image.source https://github.com/spielhoelle/micompass

WORKDIR /home/app/api

ENV PATH /home/app/api/node_modules/.bin:$PATH

COPY package*.json ./
ARG DATABASE_URL
RUN npm install
# RUN npm uninstall -g typescript
# RUN ls -la 
# RUN npm install -g typescript@4.3.5

# RUN npm rebuild
# RUN npx tsc -v
# RUN npm ls typescript
COPY . .
# RUN ls -la node_modules

EXPOSE 3000
RUN echo $DATABASE_URL
RUN npm run db-migrate
RUN ls -lat
CMD ["npm", "run", "run-prod"]
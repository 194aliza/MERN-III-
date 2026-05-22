FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install
# Install & build frontend
RUN cd frontend && npm install && npm run build

EXPOSE 5000

CMD ["npm", "start"]
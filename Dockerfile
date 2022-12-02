FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

#Bundle app source
COPY . .

# Expose the service port
EXPOSE 3000

# Run the service
CMD ["node", "server.js"]
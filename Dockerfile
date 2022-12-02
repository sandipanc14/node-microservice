FROM node:18

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

#Bundle app source
COPY . /app

# Expose the service port
EXPOSE 3000

# Run the service
CMD ["node", "server.js"]
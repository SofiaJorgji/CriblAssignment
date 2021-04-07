FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . ./
ADD target ./
ADD splitter ./
ADD agent ./

CMD node app.js ${FOLDER}

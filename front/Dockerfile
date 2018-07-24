# Create image with your nodejs image (replace zbbfufu by your docker id)
FROM alpine:3.5

# some usefull tags
LABEL image-name docker-sfeirschool-front
LABEL maintainer furgerot.f@sfeir.com
LABEL sfeirschool-date 2017-12-20

# Environment variable
ENV appDir /app

RUN apk add --update nodejs

# declare ports listening in the container
EXPOSE 3000

# Execute shell command : here create folder /app
RUN mkdir ${appDir}

# declare /app as current default directory
WORKDIR ${appDir}

# Copy all files from "build context" to /app folder
ADD . ${appDir}

# Build the application
RUN npm install

# Declare container startup command
ENTRYPOINT node server.js

# Create image with your nodejs image (replace zbbfufu by your docker id)
FROM zbbfufu/nodejs:1.0

# some usefull tags
LABEL image-name docker-sfeirschool-back
LABEL maintainer furgerot.f@sfeir.com
LABEL sfeirschool-date 2017-12-20

# Environment variable
ENV appDir /app

# declare ports listening in the container
EXPOSE 9000

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

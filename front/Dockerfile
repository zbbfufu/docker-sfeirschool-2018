# Create image with your nodejs image (replace zbbfufu by your docker id)
FROM zbbfufu/nodejs:1.0

# declare ports listening in the container
EXPOSE 3000

# Execute shell command : here create folder /app
RUN mkdir /app

# declare /app as current default directory
WORKDIR /app

# Copy all files from "build context" to /app folder
ADD . /app

# Build the application
RUN npm install

# Declare container startup command
ENTRYPOINT node server.js

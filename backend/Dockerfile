# 1. Use Node.js version 20 (The "JDK" of JavaScript)
FROM node:20

# 2. Create the directory where our app will live inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
# This allows Docker to cache your "maven dependencies" so builds are faster
COPY package*.json ./

# 4. Install the backend dependencies
RUN npm install

# 5. Copy all your backend source code (server.js, routes, etc.)
COPY . .

# 6. Expose the port your Spring-like server runs on
EXPOSE 5000

# 7. The command to run your app
CMD ["node", "server.js"]
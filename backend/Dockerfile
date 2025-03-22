# Use the official Bun image for better performance
FROM oven/bun AS runtime

# Set the working directory
WORKDIR /app

# Copy all files into the container
COPY . .

# Install dependencies using Bun
RUN bun install

# Expose port 5000
EXPOSE 5000

# Run the server using Bun
CMD ["bun", "run", "server.js"]

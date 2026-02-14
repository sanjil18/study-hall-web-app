#!/bin/bash

# Start the Jenkins container
echo "Starting Jenkins container..."
docker start jenkins-main

# Wait a moment for it to initialize
sleep 2

# Apply the permissions fix
echo "Fixing Docker socket permissions..."
docker exec -u root jenkins-main chmod 666 /var/run/docker.sock

echo "Done! You can now log in at http://localhost:8080 and run builds."

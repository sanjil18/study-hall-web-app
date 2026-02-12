pipeline {
    agent any

    environment {
        // --- DOCKER CONFIGURATION ---
        DOCKER_HUB_USER       = "sanjil245320"
        IMAGE_NAME_BACKEND    = "sanjil245320/study-hall-backend"
        IMAGE_NAME_FRONTEND   = "sanjil245320/study-hall-frontend"
        IMAGE_TAG             = "build-${BUILD_NUMBER}"
        
        // --- CREDENTIALS ---
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds'
        
        // This MUST be a "Secret File" credential containing the content of ~/ProjectKey.pem
        AWS_SSH_KEY_FILE_ID   = 'aws-ssh-key-file' 
        
        AWS_USER              = 'ubuntu'
        
        // If your Jenkins server needs AWS Credentials for Terraform
        // AWS_ACCESS_KEY_ID     = credentials('aws-access-key')
        // AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sanjil18/study-hall-web-app.git'
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        if (isUnix()) {
                            sh "echo $PASS | docker login -u $USER --password-stdin"
                            sh "export TAG=${IMAGE_TAG} && docker-compose build"
                            sh "export TAG=${IMAGE_TAG} && docker-compose push"
                        } else {
                            // Windows Agent
                            bat "docker login -u %USER% -p %PASS%"
                            bat "set TAG=%IMAGE_TAG% && docker-compose build"
                            bat "set TAG=%IMAGE_TAG% && docker-compose push"
                        }
                    }
                }
            }
        }

        stage('Deploy Infrastructure (Terraform)') {
            steps {
                script {
                    dir('terraform') {
                        if (isUnix()) {
                            sh 'terraform init'
                            // Use ProjectKey which we created earlier
                            sh 'terraform apply -var="key_name=ProjectKey" -auto-approve'
                            // Capture Public IP
                            env.SERVER_IP = sh(script: 'terraform output -raw public_ip', returnStdout: true).trim()
                        } else {
                            bat 'terraform init'
                            bat 'terraform apply -var="key_name=ProjectKey" -auto-approve'
                            // Note: Capturing output on Windows batch is complex. 
                            // Ensure the IP is known or use a different method if this fails.
                        }
                    }
                    echo "Deploying to Server IP: ${env.SERVER_IP}"
                }
            }
        }

        stage('Configure Server (Ansible)') {
            steps {
                script {
                    dir('ansible') {
                        if (isUnix()) {
                            // Create inventory file dynamically with the new IP
                            sh "echo '[webservers]\n${SERVER_IP} ansible_user=${AWS_USER} ansible_ssh_private_key_file=ssh_key.pem' > inventory.ini"
                            
                            withCredentials([file(credentialsId: AWS_SSH_KEY_FILE_ID, variable: 'SSH_KEY_FILE')]) {
                                sh 'cp $SSH_KEY_FILE ssh_key.pem'
                                sh 'chmod 600 ssh_key.pem'
                                // Run Playbook (Installs Docker/Compose)
                                sh 'ansible-playbook -i inventory.ini playbook.yml --key-file ssh_key.pem'
                            }
                        } else {
                            echo "Skipping Ansible on Windows Agent (Requires Linux tools)."
                        }
                    }
                }
            }
        }

        stage('Deploy App') {
            steps {
                script {
                     withCredentials([file(credentialsId: AWS_SSH_KEY_FILE_ID, variable: 'SSH_KEY_FILE')]) {
                        // Remote commands to run on the server
                        def remoteCommand = """
                            # Ensure directory exists
                            mkdir -p ~/study-hall-web-app
                            cd ~/study-hall-web-app

                            # Clone or Pull latest code
                            if [ ! -d ".git" ]; then
                                git clone https://github.com/sanjil18/study-hall-web-app.git .
                            else
                                git pull origin main
                            fi
                            
                            # Deploy with new tag
                            export TAG=${IMAGE_TAG}
                            docker-compose pull
                            docker-compose up -d --remove-orphans
                            docker image prune -f
                        """
                        
                        if (isUnix()) {
                            // Use StrictHostKeyChecking=no to avoid prompt
                            sh "ssh -o StrictHostKeyChecking=no -i $SSH_KEY_FILE ${AWS_USER}@${SERVER_IP} '${remoteCommand}'"
                        } else {
                             echo "Skipping SSH Deploy on Windows Agent."
                        }
                     }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}

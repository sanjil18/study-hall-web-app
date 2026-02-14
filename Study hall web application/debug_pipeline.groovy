pipeline {
    agent any

    environment {
        // --- DOCKER CONFIGURATION ---
        DOCKER_HUB_USER       = "sanjil245320"
        IMAGE_NAME_BACKEND    = "sanjil245320/study-hall-backend"
        IMAGE_NAME_FRONTEND   = "sanjil245320/study-hall-frontend"
        IMAGE_TAG             = "build-${BUILD_NUMBER}"
        
        // --- CREDENTIALS ---
        AWS_SSH_KEY_FILE_ID   = 'aws-ssh-key-file' 
        AWS_USER              = 'ubuntu'
        
        // --- PATH CONFIGURATION ---
        PROJECT_DIR           = "Study hall web application"
    }

    stages {
        stage('Deploy Infrastructure (Terraform)') {
            steps {
                script {
                    dir("${PROJECT_DIR}/terraform") {
                        withCredentials([usernamePassword(credentialsId: 'aws-credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                            if (isUnix()) {
                                sh 'terraform init'
                                env.SERVER_IP = sh(script: 'terraform output -raw public_ip', returnStdout: true).trim()
                            } else {
                                bat 'terraform init'
                                bat 'terraform output -raw public_ip > server_ip.txt'
                                env.SERVER_IP = readFile('server_ip.txt').trim()
                            }
                        }
                    }
                    echo "Checking logs on Server IP: ${env.SERVER_IP}"
                }
            }
        }

        stage('Fetch Logs') {
            steps {
                script {
                     withCredentials([file(credentialsId: AWS_SSH_KEY_FILE_ID, variable: 'SSH_KEY_FILE')]) {
                        def remoteCommand = """
                            cd 'study-hall-web-app/${PROJECT_DIR}'
                            echo "=== DOCKER PS ==="
                            docker compose ps -a
                            echo ""
                            echo "=== BACKEND LOGS ==="
                            docker compose logs backend --tail 100
                            echo ""
                            echo "=== MYSQL LOGS ==="
                            docker compose logs mysql --tail 50
                        """
                        
                        if (isUnix()) {
                            sh "ssh -o StrictHostKeyChecking=no -i $SSH_KEY_FILE ${AWS_USER}@${SERVER_IP} '${remoteCommand}'"
                        } else {
                             echo "Skipping SSH on Windows Agent."
                        }
                     }
                }
            }
        }
    }
}

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
        AWS_SSH_KEY_FILE_ID   = 'aws-ssh-key-file' 
        AWS_USER              = 'ubuntu'
        
        // --- PATH CONFIGURATION ---
        // Your code is in a subdirectory: "Study hall web application"
        PROJECT_DIR           = "Study hall web application"
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
                    // Go into the project directory first
                    dir(PROJECT_DIR) {
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            if (isUnix()) {
                                sh "echo $PASS | docker login -u $USER --password-stdin"
                                sh "export TAG=${IMAGE_TAG} && docker-compose build"
                                sh "export TAG=${IMAGE_TAG} && docker-compose push"
                            } else {
                                bat "docker login -u %USER% -p %PASS%"
                                bat "set TAG=%IMAGE_TAG% && docker-compose build"
                                bat "set TAG=%IMAGE_TAG% && docker-compose push"
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy Infrastructure (Terraform)') {
            steps {
                script {
                    // Path is: "Study hall web application/terraform"
                    dir("${PROJECT_DIR}/terraform") {
                        // Inject AWS Credentials for Terraform
                        withCredentials([usernamePassword(credentialsId: 'aws-credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {

                            if (isUnix()) {
                                // 1. Init (Retry logic)
                                sh 'for i in {1..3}; do terraform init && break || sleep 10; done'
                                
                                // 2. Import existing Security Group if it exists but is not in state
                                sh '''
                                    EXISTING_SG_ID=$(aws ec2 describe-security-groups --filters Name=group-name,Values=study-hall-sg --query "SecurityGroups[0].GroupId" --output text)
                                    if [ "$EXISTING_SG_ID" != "None" ] && [ "$EXISTING_SG_ID" != "" ]; then
                                        echo "Importing existing Security Group: $EXISTING_SG_ID"
                                        terraform import aws_security_group.study_hall_sg $EXISTING_SG_ID || echo "SG already in state or import failed (ignoring)"
                                    fi
                                '''


                                // 3. Import existing Instance if it exists (by Name tag)
                                sh '''
                                    EXISTING_INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=StudyHall-Server" "Name=instance-state-name,Values=running" --query "Reservations[0].Instances[0].InstanceId" --output text)
                                    if [ "$EXISTING_INSTANCE_ID" != "None" ] && [ "$EXISTING_INSTANCE_ID" != "" ]; then
                                         echo "Importing existing Instance: $EXISTING_INSTANCE_ID"
                                         terraform import aws_instance.study_hall_server $EXISTING_INSTANCE_ID || echo "Instance in state or import failed (ignoring)"
                                    fi
                                '''

                                // 4. Import existing Elastic IP if it exists (by Name tag)
                                sh '''
                                    EXISTING_EIP_ALLOC_ID=$(aws ec2 describe-addresses --filters "Name=tag:Name,Values=StudyHall-EIP" --query "Addresses[0].AllocationId" --output text)
                                    if [ "$EXISTING_EIP_ALLOC_ID" != "None" ] && [ "$EXISTING_EIP_ALLOC_ID" != "" ]; then
                                         echo "Importing existing EIP: $EXISTING_EIP_ALLOC_ID"
                                         terraform import aws_eip.study_hall_ip $EXISTING_EIP_ALLOC_ID || echo "EIP in state or import failed (ignoring)"
                                    fi
                                '''
                                
                                // 5. Apply (Standard, NO replace)
                                sh 'terraform apply -var="key_name=ProjectKey" -auto-approve'
                                env.SERVER_IP = sh(script: 'terraform output -raw public_ip', returnStdout: true).trim()

                            } else {
                                bat 'terraform init'
                                bat 'terraform apply -var="key_name=ProjectKey" -auto-approve'
                            }

                        }
                    }
                    echo "Deploying to Server IP: ${env.SERVER_IP}"
                }
            }
        }

        stage('Configure Server (Ansible)') {
            steps {
                script {
                    // Path is: "Study hall web application/ansible"
                    dir("${PROJECT_DIR}/ansible") {
                        if (isUnix()) {
                            // inventory.ini needs to be created here (using writeFile to avoid shell quoting issues)
                            def inventoryContent = "[webservers]\n${SERVER_IP} ansible_user=${AWS_USER} ansible_ssh_private_key_file=ssh_key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'"
                            writeFile file: 'inventory.ini', text: inventoryContent
                            
                            withCredentials([file(credentialsId: AWS_SSH_KEY_FILE_ID, variable: 'SSH_KEY_FILE')]) {
                                sh 'cat "$SSH_KEY_FILE" > ssh_key.pem'
                                sh 'chmod 600 ssh_key.pem'
                                sh 'ansible-playbook -i inventory.ini playbook.yml --key-file ssh_key.pem'
                            }
                        } else {
                             echo "Skipping Ansible on Windows Agent."
                        }
                    }
                }
            }
        }

        stage('Deploy App') {
            steps {
                script {
                     withCredentials([file(credentialsId: AWS_SSH_KEY_FILE_ID, variable: 'SSH_KEY_FILE')]) {
                        def remoteCommand = """
                            # 1. Clone/Pull Repo (creates 'study-hall-web-app' folder)
                            if [ ! -d "study-hall-web-app" ]; then
                                git clone https://github.com/sanjil18/study-hall-web-app.git
                            else
                                cd study-hall-web-app && git pull
                                cd ..
                            fi
                            
                            # 2. Enter subdirectory (Handling spaces correctly)
                            cd "study-hall-web-app/${PROJECT_DIR}"
                            
                            # 3. Deploy
                            export TAG=${IMAGE_TAG}
                            docker compose pull
                            docker compose up -d --remove-orphans
                            docker image prune -f
                        """
                        
                        if (isUnix()) {
                            sh "ssh -o StrictHostKeyChecking=no -i $SSH_KEY_FILE ${AWS_USER}@${SERVER_IP} '${remoteCommand}'"
                        } else {
                             echo "Skipping SSH Deploy on Windows Agent."
                        }
                     }
                }
            }
        }
    }
}

pipeline {
    agent any
    stages {
        stage('Apply Swap Fix') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'aws-ssh-key-file', variable: 'SSH_KEY')]) {
                        sh 'cat $SSH_KEY > key.pem && chmod 600 key.pem'
                        sh '''
                        echo "Waiting for SSH..."
                        for i in {1..20}; do
                            ssh -o StrictHostKeyChecking=no -i key.pem ubuntu@13.62.172.228 "if [ ! -f /swapfile ]; then sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab; fi" && echo "Swap Added!" && exit 0 || echo "Retrying..."
                            sleep 10
                        done
                        echo "Failed to connect after 20 attempts"
                        exit 1
                        '''
                    }
                }
            }
        }
    }
}

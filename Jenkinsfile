pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "sahilmahat"
        BACKEND_IMAGE  = "bankapp-backend"
        FRONTEND_IMAGE = "bankapp-frontend"
        IMAGE_TAG      = "${BUILD_NUMBER}"

        GIT_REPO = "github.com/sahilmahat/SpringBoot-BankApp-.git"
    }

    stages {

        stage("Checkout Code") {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: "https://${GIT_REPO}"
            }
        }

        stage("Build Backend (Maven)") {
            steps {
                sh '''
                  mvn clean package -DskipTests
                '''
            }
        }

        stage("Docker Build Backend") {
            steps {
                sh '''
                  docker build -t $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG .
                '''
            }
        }

        stage("Docker Build Frontend") {
            steps {
                sh '''
                  docker build -t $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG frontend/
                '''
            }
        }

        stage("Docker Push Images") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker push $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG
                      docker push $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG
                    '''
                }
            }
        }

        stage("Update Kubernetes Manifests") {
            steps {
                sh '''
                  sed -i "s|image:.*bankapp-backend.*|image: $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG|" k8s/backend-deployment.yaml
                  sed -i "s|image:.*bankapp-frontend.*|image: $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG|" k8s/frontend-deployment.yaml
                '''
            }
        }

        stage("Commit & Push to GitHub (GitOps Trigger)") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    sh '''
                      git config user.email "jenkins@ci.com"
                      git config user.name "jenkins"

                      git add k8s/
                      git commit -m "Update images to build $IMAGE_TAG" || echo "No changes to commit"
                      git push https://$GIT_USER:$GIT_PASS@${GIT_REPO} main
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI successful. ArgoCD will now deploy to EKS."
        }
        failure {
            echo "❌ Build failed. Check logs."
        }
    }
}


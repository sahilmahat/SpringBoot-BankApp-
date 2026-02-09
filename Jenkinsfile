pipeline {
  agent any

  environment {
    DOCKERHUB_USER = "sahilmahat"
    BACKEND_IMAGE  = "bankapp-backend"
    FRONTEND_IMAGE = "bankapp-frontend"
    IMAGE_TAG      = "${BUILD_NUMBER}"
    SONAR_PROJECT  = "bankapp"
  }


  stages {

    stage('Checkout Code') {
      steps {
        git branch: 'main',
            url: 'https://github.com/sahilmahat/SpringBoot-BankApp.git'
      }
    }

    stage('Build Backend (Maven)') {
      steps {
        sh 'mvn clean package -DskipTests'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh '''
            mvn sonar:sonar \
              -Dsonar.projectKey=${SONAR_PROJECT} \
              -Dsonar.projectName=${SONAR_PROJECT}
          '''
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Docker Build Images') {
      steps {
        sh '''
          docker build -t $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG .
          docker build -t $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG ./frontend
        '''
      }
    }

    stage('Trivy Scan (Images)') {
      steps {
        sh '''
          trivy image --severity HIGH,CRITICAL --exit-code 1 $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG
          trivy image --severity HIGH,CRITICAL --exit-code 1 $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG
        '''
      }
    }

    stage('Docker Push Images') {
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

    stage('Update Kubernetes Manifests') {
      steps {
        sh '''
          sed -i "s|image: .*bankapp-backend.*|image: $DOCKERHUB_USER/$BACKEND_IMAGE:$IMAGE_TAG|" k8s/backend-deployment.yaml
          sed -i "s|image: .*bankapp-frontend.*|image: $DOCKERHUB_USER/$FRONTEND_IMAGE:$IMAGE_TAG|" k8s/frontend-deployment.yaml
        '''
      }
    }

    stage('Commit & Push (GitOps)') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'github-creds',
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_PASS'
        )]) {
          sh '''
            git config user.name "jenkins"
            git config user.email "jenkins@devops.com"
            git add k8s/
            git commit -m "Update images to build ${IMAGE_TAG}" || true
            git push https://$GIT_USER:$GIT_PASS@github.com/<YOUR-USERNAME>/SpringBoot-BankApp.git main
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ CI passed. ArgoCD will deploy automatically."
    }
    failure {
      echo "❌ Pipeline failed. Deployment blocked."
    }
  }
}


pipeline {
  environment {
    PROJECT = "trainee-2020-6-bereketeab"
    APP_NAME = "cv-comp-api-st"
    NAMESPACE = "staging"
    IMAGE_TAG = "gcr.io/${PROJECT}/${APP_NAME}:${env.BRANCH_NAME}.${BUILD_NUMBER}"
  }
    agent {
        kubernetes {
            defaultContainer 'jnlp'
            yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: cv-comp-jenkins
  containers:
  - name: gcloud
    image: gcr.io/cloud-builders/gcloud
    command:
    - cat
    tty: true
  - name: kubectl
    image: gcr.io/cloud-builders/kubectl
    command:
    - cat
    tty: true
'''
        }
    }
    stages {
        stage('Build & Push kal-dev') {
        when { branch 'kal-dev' }    
          steps {
            container('gcloud'){
              sh ('gcloud builds submit -t ${IMAGE_TAG} .')
            }
          }
        }
      
        stage('Deploy kal-dev') {
        when { branch 'kal-dev' }     
          steps {
            container('kubectl'){
              sh("sed -i.bak 's#gcr.io/gcr-project/sample:1.0.0#${IMAGE_TAG}#' ./deployment/*.yaml")
              sh("kubectl --namespace=${NAMESPACE} apply -f ./deployment/ -n staging")
            }
          }
        }
    }
}
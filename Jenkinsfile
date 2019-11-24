pipeline {
    agent {
        docker {
            image 'node:12'
            args '-p 2995:80'
        }
    }
    environment {
        CI = 'true' 
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') { 
            steps {
                sh './jenkins/test.sh' 
            }
        }
    }
}
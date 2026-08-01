// CI only — no deploy stage (production hosting isn't decided yet, see
// backend/docker-compose.yml's `jenkins` service and
// docs/architecture/deployment.md).
pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}

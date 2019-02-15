#!/usr/bin/env groovy

// params
def nodeLabel = 'ops-alfred3-aws'

// variables
def numToKeepStr = '10'

pipeline {

    agent {
        node { label "${nodeLabel}" }}
    }

    tools {
        nodejs 'Node 8.11.3'
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: numToKeepStr))
    }

    stages {

        stage('Run Main build') {
            steps {
                script {
                    echo "Run Main build"
                    echo "Commit SHA: ${env.GIT_COMMIT}"
                    echo "Branch Name: ${env.GIT_BRANCH}"         
                    sh 'printenv'
                    build job: 'Playback-Web-CI-test/html5-skin-commits-test-2', parameters: [
                        string(name: 'commitHash', value: env.GIT_COMMIT),
                        string(name: 'branchNameFrom', value: env.GIT_BRANCH)]
                }
            }
        }
    }
}
#!/bin/bash

#create git release branch and push to remote if deploying to staging or production
if [ $deploy_to != "sandbox" ]; then
  git checkout -b $version
  git push origin $version
  echo "New Branch $version created"
fi
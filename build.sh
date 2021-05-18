#!/bin/bash

NEWEST_TAG=$(git describe --tags $(git rev-list --tags --max-count=1))

#Make latest Build from prodution branch
echo "build@latest"
git co production
npm run build
mkdir -p build/app@latest
mv dist build/app@latest/dist

#Make latest Build from Latest Tag
echo "build@${NEWEST_TAG}"
git checkout "${NEWEST_TAG}"
npm run build
mkdir -p "build/app@${NEWEST_TAG}"
mv dist "build/app@${NEWEST_TAG}/dist"

#Rest Everything Back to Production Branch
git co production
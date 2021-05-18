#!/bin/bash

NEWEST_TAG=$(git describe --tags $(git rev-list --tags --max-count=1))

echo "build@latest"

npm run build
mkdir -p build/app@latest
mv dist build/app@latest/dist

echo "build@${NEWEST_TAG}"
git checkout "${NEWEST_TAG}"
npm run build
mkdir -p "build/app@${NEWEST_TAG}"
mv dist "build/app@${NEWEST_TAG}/dist"
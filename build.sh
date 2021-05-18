#!/bin/bash

NEWEST_TAG=$(git describe --tags $(git rev-list --tags --max-count=1))

echo $NEWEST_TAG
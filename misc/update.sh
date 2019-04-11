#!/usr/bin/env bash

# Launch me from root-directory

set -e -x

git reset --hard HEAD~200
git pull origin master
git log | head -20

# Keep config in root-directory/..

sbt "runMain org.mauritania.main4ino.Server ../config" 



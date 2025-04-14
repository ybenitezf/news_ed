#!/bin/bash
# Update all poetry locks

echo "Updating dependencies in projects"
for dir in projects/*; do (
    cd "$dir"
    echo "Updating $dir"
    poetry lock
); done
# update dependencies in development
poetry lock

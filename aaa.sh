#!/bin/bash

# Add the original repository as a remote
git remote add upstream https://github.com/chitangchin/Groceryapp.git

# Fetch all branches and tags from the original repository
git fetch upstream

# Iterate over each branch in the forked repository
for branch in $(git branch -r | grep -v '\->'); do
    branch_name=$(echo $branch | sed 's#^.*origin/##')
    
    # Skip if it's the main branch (e.g., master, main)
    if [ "$branch_name" == "master" ]; then
        continue
    fi
    
    # Reset the branch to match the corresponding branch in the original repository
    git checkout $branch_name
    git reset --hard upstream/$branch_name
done

# Delete any local branches in the forked repository that don't exist in the original repository
git fetch -p
git branch --merged | grep -v '\*' | xargs -n 1 git branch -d

# Return to main branch
git checkout master

echo "All branches in your forked repository are now up to date with the original repository."

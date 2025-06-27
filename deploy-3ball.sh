#!/bin/bash

echo "📦  Staging all changes..."
git add .

echo "📝  Enter a commit message: "
read commitMessage
git commit -m "$commitMessage"

echo "🚀  Pushing to GitHub..."
git push origin main

echo "⏳  Waiting 10 seconds to let GitHub Action start..."
sleep 10

echo "🌐  Optionally deploy manually to Firebase? (y/n)"
read deployNow

if [ "$deployNow" = "y" ]; then
  echo "🔥 Deploying to Firebase manually..."
  firebase deploy
else
  echo "✅ Done. Let GitHub handle deployment."
fi

Firebase Cloud Functions for weekly rotation.

To deploy:

1. Install firebase-tools and login:
   npm i -g firebase-tools
   firebase login

2. From this project root, deploy functions only:
   cd functions
   npm install
   npx tsc --init   # if you compile TS, else convert to JS
   # Alternatively if using JS, adjust index.js
   firebase deploy --only functions

Notes:
- The scheduled function is set to run every Monday at 00:05 UTC. Adjust the cron schedule in functions/index.ts if you need a different timezone.
- Ensure the Firestore rules allow the service account to read/write the collections used: users, tasks, weekHistory.

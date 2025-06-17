import { db, auth, storage } from '../../shared/firebase.js';
// ...existing code...
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    firebase.firestore().collection('videos').where('uploadedBy', '==', user.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, doc.data());
          // Display video info here
        });
      })
      .catch(error => {
        console.error("Error getting user's videos:", error);
      });
  }
});
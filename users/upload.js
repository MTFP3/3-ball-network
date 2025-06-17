// Handles video upload logic
document.addEventListener('DOMContentLoaded', () => {
  // Video upload logic here
});

// Test Firestore write/read
import { db, storage } from '../../shared/firebase.js';

async function testFirebase() {
  // Firestore write
  await setDoc(doc(db, "testCollection", "testDoc"), { hello: "world" });

  // Firestore read
  const docSnap = await getDoc(doc(db, "testCollection", "testDoc"));
  console.log("Firestore read:", docSnap.data());

  // Storage upload
  const file = new Blob(["hello world"], { type: "text/plain" });
  const storageRef = ref(storage, 'test/hello.txt');
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  console.log("Storage file URL:", url);
}
testFirebase();

<script src="registration.js"></script>
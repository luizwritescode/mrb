import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCJbz7ss1Xv4ht449yTWWvGg3wURYfKuyA",
  authDomain: "blockfolio-b445e.firebaseapp.com",
  projectId: "blockfolio-b445e",
  storageBucket: "blockfolio-b445e.appspot.com",
  messagingSenderId: "716937708154",
  appId: "1:716937708154:web:b70642fc0f7ce72a6af1c3"
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase)

export default firebase
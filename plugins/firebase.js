import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxeGmPpgW3gclBDeueWJ06uL-nFGxXC18",
  authDomain: "puthengdotcom.firebaseapp.com",
  projectId: "puthengdotcom",
  storageBucket: "puthengdotcom.appspot.com",
  messagingSenderId: "243047133152",
  appId: "1:243047133152:web:6e80e676941ba1d80bc585",
  measurementId: "G-HXTS12RD0M"
};

let app = null;

if(!firebase.apps.length){
  app = firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
export const storageUrl = "https://firebasestorage.googleapis.com/v0/b/puthengdotcom.appspot.com/o/";
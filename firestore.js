import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyB_OBzbRGPS-nE35FHg8arS_Axi171IFUI",
  authDomain: "deve1-3e4cc.firebaseapp.com",
  projectId: "deve1-3e4cc",
  storageBucket: "deve1-3e4cc.appspot.com",
  messagingSenderId: "381117632444",
  appId: "1:381117632444:web:1c88144f0b81c4a74125b9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const firestore = firebase.firestore();

export default firestore;
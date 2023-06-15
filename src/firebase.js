// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyhxqHhI_jpLRqQo7DisnFY4waI8F2HGk",
    authDomain: "realtor-react-bca8d.firebaseapp.com",
    projectId: "realtor-react-bca8d",
    storageBucket: "realtor-react-bca8d.appspot.com",
    messagingSenderId: "45018386204",
    appId: "1:45018386204:web:9d8d59f1fbe0e886ca34d9"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
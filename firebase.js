import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyB6eqGsNTa3mOos6fNSZ2CmSdBehF05HyA",
    authDomain: "whatsapp2-dff3c.firebaseapp.com",
    projectId: "whatsapp2-dff3c",
    storageBucket: "whatsapp2-dff3c.appspot.com",
    messagingSenderId: "1094045071219",
    appId: "1:1094045071219:web:0d4b16bb01b795d2eb7706"
};

// if already initialised then return that instance or else create a new instance of the app
const app = !firebase.apps.length 
? firebase.initializeApp(firebaseConfig) 
: firebase.app();

const db = app.firestore();

const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import dotenv from 'dotenv';


// const config = {
//     apiKey: "AIzaSyCerDZ3bME1ZHKzqRySAEPCYxoJIzd5mYQ",
//     authDomain: "firstreact-9d694.firebaseapp.com",
//     databaseURL: "https://firstreact-9d694.firebaseio.com",
//     projectId: "firstreact-9d694",
//     storageBucket: "firstreact-9d694.appspot.com",
//     messagingSenderId: "936040294648",
//     appId: "1:936040294648:web:ada6df8068e2881eab330d",
//     measurementId: "G-N7KZZP65CY"
// };

dotenv.config();

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor () {
        app.initializeApp(config);
        
        this.auth = app.auth();
        this.db = app.database();
    }
    
    // ** Auth API **
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email,password);

    doSignInWithEmailAndPassword = (email,password) =>
        this.auth.signInWithEmailAndPassword(email,password);
    
    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    // ** User API **
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
}


export default Firebase;
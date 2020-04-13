import firebase from 'firebase/app'
import 'firebase/storage'

require('dotenv').config();

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCF2YPH99BVMEJCT4gAAuLwAUAaniHNwxM",
    authDomain: "journaldemo300.firebaseapp.com",
    databaseURL: "https://journaldemo300.firebaseio.com",
    projectId: "journaldemo300",
    storageBucket: "journaldemo300.appspot.com",
    messagingSenderId: "209896766188",
    appId: "1:209896766188:web:92169630f8de9a315643c9",
    measurementId: "G-C7080H2SY2"

    // can't get this to work:

    // apiKey: process.env.APIKEY,
    // authDomain: process.env.AUTHDOM,
    // databaseURL: process.env.DBURL,
    // projectId: process.env.PID,
    // storageBucket: process.env.STRBUCK,
    // messagingSenderId: process.env.MSID,
    // appId: process.env.APPID,
    // measurementId: process.env.MEASID
  };

  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  export default storage;

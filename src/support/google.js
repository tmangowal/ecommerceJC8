import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyA6HPzRUMB7T_sNI5o-1-9n1FMo6SsALPo",
    authDomain: "login-with-82bec.firebaseapp.com",
    databaseURL: "https://login-with-82bec.firebaseio.com",
    projectId: "login-with-82bec",
    storageBucket: "login-with-82bec.appspot.com",
    messagingSenderId: "612635381145"
};


firebase.initializeApp(config)
export const ref = firebase.database().ref()
export const auth = firebase.auth;
export const provider = new firebase.auth.GoogleAuthProvider();
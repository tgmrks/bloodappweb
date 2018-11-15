var app_firebase = {};
(function () {
    
    // Initialize Firebase
  const config = {
    apiKey: "AIzaSyDuUMgHVhfCp4Gs2sA0oZCr2QiFph2frMk",
    authDomain: "bloodapp-software.firebaseapp.com",
    databaseURL: "https://bloodapp-software.firebaseio.com",
    projectId: "bloodapp-software",
    storageBucket: "bloodapp-software.appspot.com",
    messagingSenderId: "880598623271"
  };
  firebase.initializeApp(config);
 
 app_firebase = firebase;
 }());
    
{

  /* ========================
    Variables
  ======================== */

  const FIREBASE_AUTH = firebase.auth();
  const FIREBASE_DATABASE = firebase.database();

  //const signOutButton = document.getElementById('sign-out');
  const backArrownButton = document.getElementById('button-back-arrow');
  const saveBuildingButton = document.getElementById('building-save');
  const clearingButton = document.getElementById('clearing');
  var targetUid = false;
  var appInstance = 0;
  const usertype = 'building';
  //const saveBuildingForm = document.getElementById('save-building-form');

  const cnpjField = document.getElementById('cnpj');
  const companyNameField = document.getElementById('company-name');
  const tradingNameField = document.getElementById('trading-name');
  const addressField = document.getElementById('address');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');

  /* ========================
    Event Listeners
  ======================== */

  //FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

  //signOutButton.addEventListener('click', signOut);
  backArrownButton.addEventListener('click',goBack);
  saveBuildingButton.addEventListener('click', saveBuilding);
  clearingButton.addEventListener('click', clearForm);
  //saveBuildingForm.addEventListener('submit', saveBuilding);

  /* ========================
    Functions
  ======================== */

  function signOut() { FIREBASE_AUTH.signOut(); }

  function goBack() {
    window.history.back();
  }

  function reloadPage() {
    window.location.reload();
  }

  FIREBASE_AUTH.onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log('LOGGED !!');
        //console.log(firebaseUser);
    } else {
        console.log('not logged in');
        window.location.pathname = 'index.html'
        //window.location.pathname = 'testeLogin/index.php'
    }
  });

  function clearForm(){
    //cnpjField.value = "";
    companyNameField.value = "";
    tradingNameField.value = "";
    addressField.value = "";
    emailField.value = "";
    passwordField.value = "";
  }

  function saveBuilding() {

    var cnpj = cnpjField.value;
    var companyName = companyNameField.value;
    var tradingName = tradingNameField.value;
    var address = addressField.value;
    var email = emailField.value;
    var password = passwordField.value;
    var buid = 0;
    //console.log("email: " + email + " pw: " + password);
    //console.log("rsocial: " + companyName + " tname: " + tradingName + " addr: " + address);

    var data = {
      uid: targetUid,
      cnpj: cnpj,
      companyName: companyName,
      tradingName: tradingName,
      address: address,
      email: email,
      password: password,
      type: usertype,
      buid: targetUid
  }

    if(data.uid) {
      updateBuilding(data);
    } else {
      newBuilding(data);
    }

  }

  function updateBuilding(data) {
    console.log("UPDATE " + data.uid);
    delete data.password;
    console.log(data);
    
    var updates = {};
    updates['/users/' + data.uid] = data;
    FIREBASE_DATABASE.ref().update(updates);

    alert('The user was saved successfully!');
    /*companyNameField.value = "";
    tradingNameField.value = "";
    addressField.value = "";
    emailField.value = "";
    passwordField.value = "";*/
    reloadPage();

  }

  function newBuilding(data) {
    appInstance++;
    console.log('App Instance: ', appInstance);
    const config = {apiKey: "AIzaSyDuUMgHVhfCp4Gs2sA0oZCr2QiFph2frMk", authDomain: "bloodapp-software.firebaseapp.com", databaseURL: "https://bloodapp-software.firebaseio.com", projectId: "bloodapp-software",storageBucket: "bloodapp-software.appspot.com", messagingSenderId: "880598623271"};
    var secondaryApp = firebase.initializeApp(config, "B_appInstance" + appInstance);

    secondaryApp.auth().createUserWithEmailAndPassword(data.email, data.password)
      .then(function(firebaseUser) {
        data.uid = secondaryApp.auth().currentUser.uid;
        data.buid = data.uid;
        console.log("User " + data.uid + " created successfully!");
        updateBuilding(data);
        secondaryApp.auth().signOut();    
      }).catch(function(error) {
        console.error("Error: ", error);
        /* TODO: handle errors
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error); */
        });
  }

}
{
  
    /* ========================
      Variables
    ======================== */
  
    const FIREBASE_AUTH = firebase.auth();
    const FIREBASE_DATABASE = firebase.database();
  
    //const signOutButton = document.getElementById('sign-out');
    const backArrownButton = document.getElementById('button-back-arrow');
    const saveBuildingButton = document.getElementById('user-save');
    const clearingButton = document.getElementById('clearing');
    var selectUserBuid = document.getElementById("select-user-buid");
    var selectUserType = document.getElementById("select-user-type");
    const userTypeOpt = document.getElementById("user-type");
    const userBuidOpt = document.getElementById("user-buid");

    var targetUid = false;
    var appInstance = 0;
    const userType = 'user';
    const userBuid = sessionStorage.getItem('buid');

    const cpfField = document.getElementById('cpf');
    const fullnameField = document.getElementById('fullname');
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
          if (sessionStorage.getItem('type') == 'admin') {
            console.log('User is admin');
            fillBuidOption();
          } else {
            console.log('user is not admin');
          }

      } else {
          console.log('not logged in');
          window.location.pathname = 'index.html'
          //window.location.pathname = 'testeLogin/index.php'
      }
    });

    function clearForm(){
      //cpfField.value = "";
      fullnameField.value = "";
      emailField.value = "";
      passwordField.value = "";
    }
    function saveBuilding() {
      
          var cpf = cpfField.value;
          var fullname = fullnameField.value;
          var email = emailField.value;
          var password = passwordField.value;
          //console.log("email: " + email + " pw: " + password);
          //console.log("rsocial: " + companyName + " tname: " + tradingName + " addr: " + address);
      
          var data = {
            uid: targetUid,
            cpf: cpf,
            fullname: fullname,
            email: email,
            password: password,
            type: userType,
            buid: userBuid
        }

        if(sessionStorage.getItem('type') == 'admin') {
          var selectedTypeVal = selectUserType.options[selectUserType.selectedIndex].value;
          var selectedBuidVal = selectUserBuid.options[selectUserBuid.selectedIndex].value;
          /*
          var selectedTypeKey = selectUserType.options[selectUserType.selectedIndex].index;
          var selectedBuidKey = selectUserBuid.options[selectUserBuid.selectedIndex].index;
          console.log('type selected ' + selectedTypeKey + " " + selectedTypeVal);
          console.log('buid selected ' + selectedBuidKey + " " + selectedBuidVal);
          */
          data.type = selectedTypeVal;
          data.buid = selectedBuidVal;
        }

        //console.log(data);
      
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
      var secondaryApp = firebase.initializeApp(config, "U_appInstance" + appInstance);
  
      secondaryApp.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then(function(firebaseUser) {
          data.uid = secondaryApp.auth().currentUser.uid;
          //data.buid = data.uid;
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

    function fillBuidOption() {

      FIREBASE_DATABASE.ref('/users').orderByChild("type").equalTo('building').on("value", function(snapshot) {
        //console.log(snapshot.val());
        var buidOptions = {};
        snapshot.forEach(function(data) {
          //console.log("key " + data.key + " value " + data.val() + "company " + data.val().companyName);
          buidOptions[data.val().uid] = data.val().companyName;
        });
        
        var bOptSize = Object.keys(buidOptions).length
        console.log('options: ' + buidOptions + ' size: ' + bOptSize );
        
        for(index in buidOptions) {
          //console.log("BUILDING OPT " + buidOptions[index] + " " + index);
          selectUserBuid.options[selectUserBuid.options.length] = new Option(buidOptions[index], index);
        }
        
        userBuidOpt.removeAttribute('hidden');
        userTypeOpt.removeAttribute('hidden');

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      
    }

}
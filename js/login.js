{
// TODO: check spelling and pw validation
// TODO: add a barrier to prevent common users to login (check in /users first)
  /* ========================
    Variables
  ======================== */

  const FIREBASE_AUTH = firebase.auth();
  const FIREBASE_DATABASE = firebase.database();

  const signInButton = document.getElementById('sign-in');
  const signOutButton = document.getElementById('sign-out');
  const txtEmail = document.getElementById('email');
  const txtPass = document.getElementById('password');
  const resetPasswordLink = document.getElementById('resetPassword');
  
  /* ========================
    Event Listeners
  ======================== */

  txtPass.addEventListener('keypress', function (e) { 
    var key = e.which || e.keyCode; if (key === 13) { signIn();}});
  signInButton.addEventListener('click', signIn);
  resetPasswordLink.addEventListener('click', resetPassword);
  //signOutButton.addEventListener('click', signOut);

  /* ========================
    Functions
  ======================== */

  function signIn() {
    /* To Sig-In w/ Google: FIREBASE_AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider()); */
    const email = txtEmail.value;
    const pass = txtPass.value;

    FIREBASE_AUTH.signInWithEmailAndPassword(email, pass)
    .catch(function(error) { // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Senha inválida.');
      } else if (errorCode === 'auth/invalid-email') {
        alert('E-mail Inválido.');
      } else if (errorCode === 'auth/user-not-found') {
        alert('Usuário não encontrado.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
    //Promise.catch(e => console.log(e.message));   
  }

  //function signOut() { FIREBASE_AUTH.signOut(); }

  FIREBASE_AUTH.onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log('LOGGED !!');
        console.log(firebaseUser);

        if (typeof(Storage) !== "undefined") {
          // Code for localStorage/sessionStorage.
          getUserData();
    
         } else {
          // Sorry! No Web Storage support..
          alert('Sorry! No Web Storage support..');
        }

        setTimeout(function() {
          //your code to be executed after 1 second
          window.location.pathname = 'main.html'
        }, 1500);
    

        
    } else {
        console.log('not logged in');
        //window.location.pathname = 'testeLogin/index.php'
    }
  });

  function resetPassword() {
    var sendEmailAddress = prompt("Por favor, informe seu email para enviarmos a recuperação de senha:", "");
    if (sendEmailAddress != null) {  
      setTimeout(function() {
        FIREBASE_AUTH.sendPasswordResetEmail(sendEmailAddress).then(function() {
          console.log("Email sent to ", sendEmailAddress);
        }).catch(function(error) {
          console.log("An error happened... ", sendEmailAddress);
        });

      }, 1000);//your code to be executed after 1 second
    }
  }
  function getUserData() {
    FIREBASE_DATABASE.ref('/users/'+ FIREBASE_AUTH.currentUser.uid).once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        //console.log(snapshot.val());
        sessionStorage.setItem("uid", FIREBASE_AUTH.currentUser.uid);
        sessionStorage.setItem("email", FIREBASE_AUTH.currentUser.email);
        //console.log("uid: " + sessionStorage.getItem("uid"));
        //console.log("email: " + sessionStorage.getItem("email"));
        // Get rest from snapshot of the database
        sessionStorage.setItem("type", snapshot.val().type);
        sessionStorage.setItem("buid", snapshot.val().buid);
        //console.log("TYPE IS: " + sessionStorage.getItem("type"));
        if(snapshot.val().type == 'building') {
          sessionStorage.setItem("address", snapshot.val().address);
          sessionStorage.setItem("tradingName", snapshot.val().tradingName);
          sessionStorage.setItem("companyName", snapshot.val().companyName);  
        } else {
          sessionStorage.setItem("fullname", snapshot.val().fullname); 
        }
      
      } else {
        console.log('something went wrong');
        //unsubscribeButton.setAttribute("hidden", "true");
        //subscribeButton.removeAttribute("hidden");
      }
    });   
  
  }
}
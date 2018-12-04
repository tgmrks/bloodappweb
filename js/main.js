{

  /* ========================
    Variables
  ======================== */

  const FIREBASE_AUTH = firebase.auth();
  const FIREBASE_DATABASE = firebase.database();

  const homeButton = document.getElementById('home-screen');
  const reportsButton = document.getElementById('reports-screen');
  const addBuildingButton = document.getElementById('add-building-screen');
  const addUserButton = document.getElementById('add-user-screen');
  const sendNotificationButton = document.getElementById('send-notification-screen');
  const signOutButton = document.getElementById('sign-out');
  const greetingsText = document.getElementById('greetings');

  //const currentUser = FIREBASE_AUTH.currentUSer

  /* ========================
    Event Listeners
  ======================== */

  //FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

  homeButton.addEventListener('click', reloadPage);
  reportsButton.addEventListener('click', showReports);
  addBuildingButton.addEventListener('click', addBuildingScreen);
  addUserButton.addEventListener('click', addUserScreen);
  sendNotificationButton.addEventListener('click', sendNotificationScreen);
  signOutButton.addEventListener('click', signOut);

  /* ========================
    Functions
  ======================== */

  function reloadPage() {
    
    //console.log(getDate());
    
    console.log('HOME');
    window.location.reload();
    console.log("uid: " + sessionStorage.getItem("uid"));
    console.log("email: " + sessionStorage.getItem("email"));
  }

  function showReports() {
    window.location.pathname = 'reports.html'
  }

  function addBuildingScreen() {
    window.location.pathname = 'building.html';
    //window.location.replace('test.html');
  }

  function addUserScreen() {
    window.location.pathname = 'user.html'
  }

  function sendNotificationScreen() {
    window.location.pathname = 'message.html'
  }

  function signOut() { 
    FIREBASE_AUTH.signOut(); 
    //window.location.pathname = 'index.html'
  }

  FIREBASE_AUTH.onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {

        console.log('LOGGED !!');
        console.log(firebaseUser.email);
        console.log("uid: " + sessionStorage.getItem("uid"));
        console.log("email: " + sessionStorage.getItem("email"));
        console.log("type: " + sessionStorage.getItem("type"));
        console.log("buid: " + sessionStorage.getItem("buid"));
             
        checkUserType();
    } else {
        console.log('not logged in');
        window.location.pathname = 'index.html'
        //window.location.pathname = 'testeLogin/index.php'
        //subscribeButton.setAttribute("hidden", "true");
        //unsubscribeButton.removeAttribute("hidden");
    }
  });

  function checkUserType() {
    //FIREBASE_DATABASE.ref('/users').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value').then((snapshot) => { ... });   
    var type = sessionStorage.getItem("type");
    console.log(type);
    if (type == 'admin') {
      reportsButton.removeAttribute("hidden");
      addBuildingButton.removeAttribute("hidden");
      addUserButton.removeAttribute("hidden");
      sendNotificationButton.removeAttribute("hidden");
      //greetingsText.innerText("Seja bem-vindo(a), " + sessionStorage.getItem("fullname"));
    } else if (type == 'building') {
      addUserButton.removeAttribute("hidden");
      sendNotificationButton.removeAttribute("hidden");
      //greetingsText.innerText("Seja bem-vindo, " + sessionStorage.getItem("tradingName"));
    } else if (type == 'user') {
      sendNotificationButton.removeAttribute("hidden");
      //greetingsText.innerText("Seja bem-vindo(a), " + sessionStorage.getItem("fullname"));
    } else {
      alert('something went wrong! User type undefined...');
    }
  }

  // TO REMOVE
  const newUserButton = document.getElementById('new-user');
  newUserButton.addEventListener('click', newUser);

  function newUser() {
    
        const email = FIREBASE_AUTH.currentUser.email;
        const type = "admin";
        //const uid = FIREBASE_DATABASE.ref().child('users').push().key;
        const uid = FIREBASE_AUTH.currentUser.uid;
            var data = {
                uid: uid,
                email: email,
                type: type
            }
    
            var updates = {};
            updates['/users/' + uid] = data;
            FIREBASE_DATABASE.ref().update(updates);
    
            alert('The user is created successfully!');
            //reload_page();
      }

      function getDate() {
        
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var mn = today.getMinutes();
            
            if(dd<10) {
                dd = '0'+dd
            } 
            
            if(mm<10) {
                mm = '0'+mm
            } 
            
            today = mm + '/' + dd + '/' + yyyy + " " + hh + ":" + mn;
            //document.write(today);
            return today;
      }
        

}

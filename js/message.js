{

  /* ========================
    Variables
  ======================== */

  const FIREBASE_AUTH = firebase.auth();
  const FIREBASE_MESSAGING = firebase.messaging();
  const FIREBASE_DATABASE = firebase.database();

  const subscribeButton = document.getElementById('subscribe');
  const unsubscribeButton = document.getElementById('unsubscribe');
  const sendNotificationForm = document.getElementById('send-notification-form');
  const backArrownButton = document.getElementById('button-back-arrow');

  /* ========================
    Event Listeners
  ======================== */

  //FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);
  FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);
  /*
  subscribeButton.addEventListener('click', subscribeToNotification);
  unsubscribeButton.addEventListener('click', unsubscribeToNotification);
*/
  sendNotificationForm.addEventListener('submit', sendNotification);

  backArrownButton.addEventListener('click',goBack);
  /* ========================
    Functions
  ======================== */

  function signOut() { FIREBASE_AUTH.signOut(); }

  function goBack() {
    window.history.back();
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

  function subscribeToNotification() {
    FIREBASE_MESSAGING.requestPermission()
      .then(() => handleTokenRefresh())
      .then(() => checkSubscription())
      .catch((err) => {
        console.log("error getting permission");
      });
  }

  function handleTokenRefresh() {
    return FIREBASE_MESSAGING.getToken()
      .then((token) => {
        FIREBASE_DATABASE.ref('/tokens').push({
          token: token,
          uid: FIREBASE_AUTH.currentUser.uid
        });
      });
  }

  function unsubscribeToNotification() {
    FIREBASE_MESSAGING.getToken()
      .then((token) => FIREBASE_MESSAGING.deleteToken(token))
      .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value'))
      .then((snapshot) => {
        const key = Object.keys(snapshot.val())[0];
        return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
      })
      .then(() => checkSubscription())
      .catch((err) => {
        console.log("error deleting token");
      });
  }

  function checkSubscription() {
    FIREBASE_DATABASE.ref('/tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value')
      .then((snapshot) => {
        if (snapshot.val()) {
          subscribeButton.setAttribute("hidden", "true");
          unsubscribeButton.removeAttribute("hidden");
        } else {
          unsubscribeButton.setAttribute("hidden", "true");
          subscribeButton.removeAttribute("hidden");
        }
      });
  }

  function sendNotification(e) {
    e.preventDefault();

    const notificationMessage = document.getElementById('notification-message').value;

    //var msgFrom = FIREBASE_AUTH.currentUser.displayName != undefined ? FIREBASE_AUTH.currentUser.displayName : sessionStorage.getItem("buid");
    var msgFrom = sessionStorage.getItem("buid");
    var buidName, buidAddress;

    FIREBASE_DATABASE.ref('/users/'+ msgFrom).once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        buidName = snapshot.val().tradingName;
        buidAddress = snapshot.val().address;
      } else {
        console.log('something went wrong');
      }
    }).then(() => {

      var today = getDate();
      console.log(buidName, buidAddress);
      console.log(notificationMessage, msgFrom);
      console.log(today);
  
        FIREBASE_DATABASE.ref('/notifications').push({
          buid: msgFrom,
          user: buidName,
          address: buidAddress,
          message: notificationMessage,
          date: today
    
        }).then(() => {
          document.getElementById('notification-message').value = "";
        })
    });  

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
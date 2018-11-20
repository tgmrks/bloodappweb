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

    var msgFrom = FIREBASE_AUTH.currentUser.displayName != undefined ? FIREBASE_AUTH.currentUser.displayName : sessionStorage.getItem("buid");

    console.log(notificationMessage, msgFrom);

    FIREBASE_DATABASE.ref('/notifications').push({
      user: msgFrom,
      message: notificationMessage
    }).then(() => {
      document.getElementById('notification-message').value = "";
    })
  }

}
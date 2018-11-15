const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//exports.sendNotification = functions.database.ref('/notifications/{notificationId}').onWrite((event) => {
exports.sendNotification = functions.database.ref('/notifications/{notificationId}').onWrite((change, context) => {

    console.log("Triggering Messaging Notification !!");
    //return in case someone has been editing the message from DB, this way it wont notificate while editing.
    if (change.before.val()) { 
        return; 
    }
    
    //return in case the message has been deleted, to avoid notification while deleting
    if (!change.after.exists()) { 
        return; 
    }

    // Setup notification
  const NOTIFICATION_SNAPSHOT = change.after;
  const payload = {
    notification: {
      title: `New Message from ${NOTIFICATION_SNAPSHOT.val().user}!`,
      body: NOTIFICATION_SNAPSHOT.val().message
      //click_action: `https://${functions.config().firebase.authDomain}`
    }
  }

  //console.info(payload);

  return admin.database().ref('/tokens').once('value').then((data) => {
      
    if ( !data.val() ) {
        //console.log("data has NO value !!");
        return;
    } else {
        //console.log("data has value !!");
    }
    

    const snapshot = data.val();
    const tokensWithKey = [];
    const tokens = [];

    //get the token list 
    for (let key in snapshot) {
        tokens.push( snapshot[key].token );
        tokensWithKey.push({
          token: snapshot[key].token,
          key: key
        });
      }
    console.log(tokens.entries());

admin.messaging().send

    return admin.messaging().sendToDevice(tokens, payload)
    .then((response) => cleanInvalidTokens(tokensWithKey, response.results))
    //.then(() => admin.database().ref('/notifications').child(NOTIFICATION_SNAPSHOT.key).remove())

  });

  // Clean invalid tokens
  function cleanInvalidTokens(tokensWithKey, results) {
    
        const invalidTokens = [];
    
        results.forEach((result, i) => {
          if ( !result.error ) return;
    
          console.error('Failure sending notification to', tokensWithKey[i].token, result.error);
          
          switch(result.error.code) {
            case "messaging/invalid-registration-token":
            case "messaging/registration-token-not-registered":
              invalidTokens.push( admin.database().ref('/tokens').child(tokensWithKey[i].key).remove() );
              break;
            default:
              break;
          }
        });
    
        return Promise.all(invalidTokens);
      }

  });
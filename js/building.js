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

    if(!validarCNPJ(cnpj)) { alert('CNPJ inválido!'); return; }
    if(companyName == "" || tradingName == "") { alert('Nome inválido!'); return; }
    if(address == "") { alert('Endereço inválido!'); return; }
    if(!validateEmail(email)) { alert('E-mail inválido!'); return; }
    if(password.length < 6) { alert('Senha inválida!'); passwordField.value = ""; return; }
    

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

  

function validateEmail(email) {
    //SIMPLE TEST
    //var re = /\S+@\S+/; console.log("estive aq "   + re + " " + re.test(email));
    //99.99% EFFICIENCY 
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;  
    return re.test(email);
}

  //validar CNPJ
  function validarCNPJ(cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g,'');
    
     console.log("cnpj ->" + cnpj);
    
        if(cnpj == '') return false;
    
        if (cnpj.length != 14)
            return false;
    
     
    
        // Elimina CNPJs invalidos conhecidos
    
        if (cnpj == "00000000000000" || 
    
            cnpj == "11111111111111" || 
    
            cnpj == "22222222222222" || 
    
            cnpj == "33333333333333" || 
    
            cnpj == "44444444444444" || 
    
            cnpj == "55555555555555" || 
    
            cnpj == "66666666666666" || 
    
            cnpj == "77777777777777" || 
    
            cnpj == "88888888888888" || 
    
            cnpj == "99999999999999")
    
            return false;
    
             
    
        // Valida DVs
    
        tamanho = cnpj.length - 2
    
        numeros = cnpj.substring(0,tamanho);
    
        digitos = cnpj.substring(tamanho);
    
        soma = 0;
    
        pos = tamanho - 7;
    
        for (i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
    
          if (pos < 2)
                pos = 9;
    
        }
    
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
        if (resultado != digitos.charAt(0))
            return false;
    
        tamanho = tamanho + 1;
    
        numeros = cnpj.substring(0,tamanho);
    
        soma = 0;

        pos = tamanho - 7;
    
        for (i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
    
          if (pos < 2)
                pos = 9;
        }
    
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
        if (resultado != digitos.charAt(1))
              return false;
  
        return true;

    }

}
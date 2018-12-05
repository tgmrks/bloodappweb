{
    
      /* ========================
        Variables
      ======================== */
    
      const FIREBASE_AUTH = firebase.auth();
      const FIREBASE_DATABASE = firebase.database();
    
      //const signOutButton = document.getElementById('sign-out');
      const backArrownButton = document.getElementById('button-back-arrow');
      const bloodTypeTable = document.getElementById('tbl_bloodtype_list');
      const buildingTable = document.getElementById('tbl_building_list');
      const appusersTable = document.getElementById('tbl_appusers_list');
    
      /* ========================
        Event Listeners
      ======================== */
    
      //FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);
      //signOutButton.addEventListener('click', signOut);
      backArrownButton.addEventListener('click',goBack);
     
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
            bloodTypeReport();
            buildingReport();
            appusersReport();
        } else {
            console.log('not logged in');
            window.location.pathname = 'index.html'
            //window.location.pathname = 'testeLogin/index.php'
        }
      });

      function bloodTypeReport() {
          FIREBASE_DATABASE.ref('/profiles').once('value')
          .then((snapshot) => {
            if (snapshot.val()) {
             console.log(snapshot.val());
             // O+	O-	A+	A-	B+	B-	AB+	AB-
             var btCount = {'O+': 0,	'O-': 0, 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0,'AB-':0};
             snapshot.forEach(function(data) {
              if("O+" == data.val().bloddType) btCount["O+"]++;
              if("O-" == data.val().bloddType) btCount["O-"]++;  
              if("A+" == data.val().bloddType) btCount["A+"]++;
              if("A-" == data.val().bloddType) btCount["A-"]++;
              if("B+" == data.val().bloddType) btCount["B+"]++;
              if("B-" == data.val().bloddType) btCount["B-"]++;
              if("AB+" == data.val().bloddType) btCount["AB+"]++;
              if("AB-" == data.val().bloddType) btCount["AB-"]++;
              });

              var rowIndex = 1;
              for (index in btCount) {
                //console.log(btCount[index]);
                var childKey = index;
                var childData = btCount[index];
                var row = bloodTypeTable.insertRow(rowIndex);
                var cellId = row.insertCell(0);
                var cellName = row.insertCell(1);
                cellId.appendChild(document.createTextNode(childKey));
                cellName.appendChild(document.createTextNode(childData));
                rowIndex = rowIndex + 1;
              };
              //console.log(btCount);
            } else {
              console.log('something went wrong');
            }
          });   
      }
      
      function buildingReport() {
      FIREBASE_DATABASE.ref('/users').once('value')
        .then((snapshot) => {
          if (snapshot.val()) {
           console.log(snapshot.val());
            //  admin   building    user
           var utCount = {'admin': 0,	'hemocentro': 0, 'funcionário': 0};
           snapshot.forEach(function(data) {
            if("admin" == data.val().type) utCount["admin"]++;
            if("building" == data.val().type) utCount["hemocentro"]++;  
            if("user" == data.val().type) utCount["funcionário"]++;
            });

            var rowIndex = 1;
            for (index in utCount) {
              //console.log(btCount[index]);
              if(index != "admin") {
              var childKey = index;
              var childData = utCount[index];
              var row = buildingTable.insertRow(rowIndex);
              var cellId = row.insertCell(0);
              var cellName = row.insertCell(1);
              cellId.appendChild(document.createTextNode(childKey));
              cellName.appendChild(document.createTextNode(childData));
              rowIndex = rowIndex + 1;
            }
            };
            //console.log(btCount);
          } else {
            console.log('something went wrong');
          }
        });   
    }

    function appusersReport() {
           FIREBASE_DATABASE.ref('/profiles').once('value')
            .then((snapshot) => {
              if (snapshot.val()) {
               console.log(snapshot.val());
               snpqtd = Object.keys(snapshot.val()).length;
                //  admin   building    user
               var ptCount = {'Cadastrados': snpqtd,	'Masculino': 0, 'Feminino': 0};
               snapshot.forEach(function(data) {
                if("Masculino" == data.val().gender) ptCount["Masculino"]++;  
                if("Feminino" == data.val().gender) ptCount["Feminino"]++;
                });
    
                var rowIndex = 1;
                for (index in ptCount) {
                  //console.log(btCount[index]);
                  var childKey = index;
                  var childData = ptCount[index];
                  var row = appusersTable.insertRow(rowIndex);
                  var cellId = row.insertCell(0);
                  var cellName = row.insertCell(1);
                  cellId.appendChild(document.createTextNode(childKey));
                  cellName.appendChild(document.createTextNode(childData));
                  rowIndex = rowIndex + 1;
                };
                //console.log(btCount);
              } else {
                console.log('something went wrong');
              }
            });   
        }    
  
  }
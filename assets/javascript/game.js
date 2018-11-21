var config = {
    apiKey: "AIzaSyDwU1FB_6fGRqgpaMrYv6enaYaB1rhX1PU",
    authDomain: "perfect-date-b7ea3.firebaseapp.com",
    databaseURL: "https://perfect-date-b7ea3.firebaseio.com",
    projectId: "perfect-date-b7ea3",
    storageBucket: "perfect-date-b7ea3.appspot.com",
    messagingSenderId: "852010734268"
  };
firebase.initializeApp(config);
var db = firebase.database();

var perfectDate =
{
    connectionId: "",
    myName: "",
    oppName: ""
    
}


function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }

  function createPlayer() {
      if(perfectDate.connectionId === "")
      {
        perfectDate.connectionId = guid();
        db.ref("couples/" + perfectDate.connectionId).set({
        user1: perfectDate.myName,
        user2: "",
        status1: 0,
        status2: 0
        }); 
        $("#conn-id-info").text("Your connection Id will be: " + perfectDate.connectionId);
      }
      else
      {
        db.ref("couples/" + perfectDate.connectionId).child("user2").set(perfectDate.myName);
      }

    
}

window.onload = function() {

     $("#btn-connect").on("click", function(){
        perfectDate.myName = $("#name-input").val();
        perfectDate.connectionId = $("#connId-input").val();
        $("#btn-connect").attr("style", "pointer-events: none; opacity: 0.4;");
        createPlayer();
    });

}

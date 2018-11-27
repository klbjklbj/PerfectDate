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
    
    myName: "",
    guestName: "",
    guestEmail: "",
    location: "",
    date: "",
    connectionId: "",
    guestID: "",
    hostID: ""
    
}


function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }

  function buildDB() {
     
      perfectDate.connectionId = guid();
      perfectDate.guestID = guid();
      perfectDate.hostID = guid();
      db.ref("couples/" + perfectDate.connectionId).set({
        date: perfectDate.date,
        location: perfectDate.location
      });
      db.ref("couples/" + perfectDate.connectionId + "/" + perfectDate.hostID).set({
        name: perfectDate.myName,
        status: 0
      }); 
      db.ref("couples/" + perfectDate.connectionId + "/" + perfectDate.guestID).set({
        name: perfectDate.guestName,
        status: 0
      });
}

window.onload = function() {

     $("inviteButton").on("click", function(){
        event.preventDefault();
        perfectDate.myName = $("#name-input").val();
        perfectDate.guestName = $("#guest-name-input").val();
        perfectDate.guestEmail = $("#guest-email-input").val();
        perfectDate.location = $("#location-input").val();
        perfectDate.date = $("#date-input").val();
        $("#invite").attr("style", "pointer-events: none; opacity: 0.4;");
        buildDB();

        var template_params = {
          "guest_email": perfectDate.guestEmail,
          "guest_name": perfectDate.guestName,
          "inviter_name": perfectDate.myName,
          "date": perfectDate.date,
          "connection_key": perfectDate.connectionId,
          "guest_id": perfectDate.guestID
       };
       
       var service_id = "gmail";
       var template_id = "perfect_date_invitation";
       // !!! KEEP DISABLED to avoid reaching sent email quota !!!
       // emailjs.send(service_id,template_id,template_params);

       $("#add-conn-link").text("Invite has been sent. Please save and use the following link to add your preferences");
       $("#link-pref").attr("href", "pickYourPlace.html?connkey=" + perfectDate.connectionId + "&userid=" + perfectDate.hostID);
       $("#link-pref").text("Preferences for a Perfect Date");
    });

}

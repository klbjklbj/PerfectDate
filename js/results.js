// Initialize Firebase
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

var queryURLs = {
    userRestaurant: "",
    userEvent: "",
    friendRestaurant: "",
    friendEvent: ""
}

// Ready solution from stack overflow
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var datarefFriend = "couples/" + getUrlParameter('connkey') + "/" + getUrlParameter('friendid');
var datarefUser = "couples/" + getUrlParameter('connkey') + "/" + getUrlParameter('userid');

window.onload = function () {
    ////////////////// check if our partner has selected the preferences
    db.ref(datarefFriend + "/status").once("value", function (snapshot) {
        if (snapshot.val() === 1) {
            ////////////////// get restaurants query URLs
            db.ref(datarefUser + "/Restaurant_queryURL").once("value", function (snapshot) {
                queryURLs.userRestaurant = snapshot.val();
                db.ref(datarefFriend + "/Restaurant_queryURL").once("value", function (snapshot) {
                    queryURLs.friendRestaurant = snapshot.val();

                    ////////////////// now we load restaurants data
                    ImportRestaurantsData();
                });
            });

            ////////////////// get events query URLs
            db.ref(datarefUser + "/Event_queryURL").once("value", function (snapshot) {
                queryURLs.userEvent = snapshot.val();

                db.ref(datarefFriend + "/Event_queryURL").once("value", function (snapshot) {
                    queryURLs.friendEvent = snapshot.val();

                    ////////////////// now we load events data
                    ImportEventsData();
                });
            });
        }
        else {
            ///////////// message that have no response from friend yet
            alert("Your friend is not decided yet");

            // TODO !!!!!!!!!
        }
    });
}
/*
function ImportRestaurantsData(){
    $.ajax({
        url: queryURLs.userRestaurant,
        method: "GET"
    }).then(function (userResponse) {
        console.log(userResponse);
        
        $.ajax({
            url: queryURLs.friendRestaurant,
            method: "GET"
        }).then(function (friendResponse) {
            console.log(friendResponse);
            
            ///////////// Find matching restaurants
            OutputRestaurantsData(userResponse, friendResponse);
        });
    });
}
*/

function ImportRestaurantsData() {
    var service;
    var request = {
        query: queryURLs.friendRestaurant
    };
    service = new google.maps.places.PlacesService($("#otherRestaurants").get(0));
    service.textSearch(request, callback);
    function callback(userResponse, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(userResponse);
            var service;
            var request = {
                query: queryURLs.friendRestaurant
            };
            service = new google.maps.places.PlacesService($("#otherRestaurants").get(0));
            service.textSearch(request, callback);
            function callback(friendResponse, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    console.log(friendResponse);
                    ///////////// Find matching restaurants
                    OutputRestaurantsData(userResponse, friendResponse);
                }
            }
        }
    }
}

function ImportEventsData() {
    $.ajax({
        url: queryURLs.userEvent,
        method: "GET",
    }).then(function (userResponse) {
        console.log(queryURLs.userEvent);


        for (let i = 0; i < response.events.length; i++) {
            var event = response.events[i];

            var eventName = event.name.html
            var eventUrl = event.url;
            var eventTime = moment(event.start.local).format('M/D/YYYY h:mm A');
            var venueName = event.venue.name;
            var venueCity = event.venue.address.city;

            var spaces = "&nbsp;&nbsp;"

            //console.log(eventName);
            //console.log(eventUrl);
            //console.log(eventTime);
            //console.log(venueName);
            //console.log(venueCity);

            // BELOW IS AN EXAMPLE FOR RESULTS PAGE
            // var eventListing = "<li>" + eventTime + spaces + "<a href='" + eventUrl + "'>" + eventName + "</a>" + spaces + venueName + " - " + venueCity + "</li>";
            // console.log(eventListing);

            // $("--REPLACE WITH EVENTS RESULTS DIV OR SECTION ID--"").append(eventListing);
        }

        $.ajax({
            url: queryURLs.friendEvent,
            method: "GET",
        }).then(function (friendResponse) {
            console.log(queryURLs.friendEvent);


            for (let i = 0; i < response.events.length; i++) {
                var event = response.events[i];

                var eventName = event.name.html
                var eventUrl = event.url;
                var eventTime = moment(event.start.local).format('M/D/YYYY h:mm A');
                var venueName = event.venue.name;
                var venueCity = event.venue.address.city;

                var spaces = "&nbsp;&nbsp;"

                //console.log(eventName);
                //console.log(eventUrl);
                //console.log(eventTime);
                //console.log(venueName);
                //console.log(venueCity);

                // BELOW IS AN EXAMPLE FOR RESULTS PAGE
                // var eventListing = "<li>" + eventTime + spaces + "<a href='" + eventUrl + "'>" + eventName + "</a>" + spaces + venueName + " - " + venueCity + "</li>";
                // console.log(eventListing);

                // $("--REPLACE WITH EVENTS RESULTS DIV OR SECTION ID--"").append(eventListing);
            }

            OutputEventsData(userResponse, friendResponse);
        });
    });
}

function OutputRestaurantsData(userRestaurants, friendRestaurants) {
    // TODO !!!!!!!
    //for (var i = 0; i < results.length; i++) {
    //console.log(results[i].name, results[i].types)
}

function OutputEventsData(userEvents, friendEvents) {
    // TODO !!!!!!!
}

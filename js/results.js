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
var placeResponse = {};

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
                    //getDetails("ChIJN1t_tDeuEmsRUsoyG83frY4");
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

function ImportRestaurantsData() {
    var service;
    var request = {
        query: queryURLs.userRestaurant
    };
    service = new google.maps.places.PlacesService($("<div>").get(0));
    service.textSearch(request, callback);
    function callback(userResponse, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            var request = {
                query: queryURLs.friendRestaurant
            };
            service = new google.maps.places.PlacesService($("<div>").get(0));
            service.textSearch(request, callback);
            function callback(friendResponse, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    ///////////// Find matching restaurants
                    OutputRestaurantsData(userResponse, friendResponse);
                }
            }
        }
    }
}

function getDetails(placeId) {
    var service;
    var request = {
        placeId: placeId,
        fields: ['website', 'url']
    };
    service = new google.maps.places.PlacesService($("<div>").get(0));
    service.getDetails(request, callback);

    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //console.log(place)
            placeResponse = place;

        }
    }
}

function ImportEventsData() {
    $.ajax({
        url: queryURLs.userEvent,
        method: "GET",
    }).then(function (userResponse) {
        //console.log(userResponse.events);
        var userResponse = userResponse.events;
        $.ajax({
            url: queryURLs.friendEvent,
            method: "GET",
        }).then(function (friendResponse) {
            //console.log(friendResponse.events);
            var friendResponse = friendResponse.events;
            OutputEventsData(userResponse, friendResponse);
        });
    });
}

function OutputRestaurantsData(userResponse, friendResponse) {
    var otherPlaces = [];
    var matchingPlaces = [];

    for (var i = 0; i < userResponse.length; i++) {
        var userPlaceId = userResponse[i].place_id;
        var userPlace = userResponse[i];
        for (var j = 0; j < friendResponse.length; j++) {
            var friendPlaceId = friendResponse[j].place_id
            if (userPlaceId === friendPlaceId) {
                if (!matchingPlaces.includes(userPlace)) {
                    matchingPlaces.push(userPlace);
                }
            }
        }
    }

    // remove matching options from userResponse
    for (var i = 0; i < matchingPlaces.length; i++) {
        for (var j = 0; j < userResponse.length; j++) {
            if (matchingPlaces[i].place_id === userResponse[j].place_id) {
                userResponse.splice(j, 1)
            }
        }
    }

    // remove matching options from friendResponse
    for (var i = 0; i < matchingPlaces.length; i++) {
        for (var j = 0; j < friendResponse.length; j++) {
            if (matchingPlaces[i].place_id === friendResponse[j].place_id) {
                friendResponse.splice(j, 1)
            }
        }
    }


    // push userResponse to otherPlaces
    for (var i = 0; i < userResponse.length; i++) {
        otherPlaces.push(userResponse[i])
    }

    // push freindResponse to otherPlaces
    for (var i = 0; i < friendResponse.length; i++) {
        otherPlaces.push(friendResponse[i])
    }

    // if no matching options show message "No matches found"
    if (matchingPlaces == "") {
        var name = $("<h5>").text("No matches found");
        $("#bestMatchingRestaurant").append(name).append("<br>");
    }
    // show matching options
    else {
        for (var l = 0; l < matchingPlaces.length; l++) {
            var matchRestaurant = $("<div>");
            var name = $("<h5>").text(matchingPlaces[l].name).addClass("mb-0");
            var rating = $("<a>").text("Rating: " + matchingPlaces[l].rating);
            var web = $("<a>").text("Web").attr("href", placeResponse.website);
            var map = $("<a>").text("Map").attr("href", placeResponse.url);
            matchRestaurant.append(name);
            matchRestaurant.append(rating).append(" | ");
            matchRestaurant.append(web).append(" | ");
            matchRestaurant.append(map);
            $("#bestMatchingRestaurant").append(matchRestaurant).append("<br>");
        }
    }
    // show other options
    for (var k = 0; k < otherPlaces.length; k++) {
        getDetails(otherPlaces[k].place_id);
        var otherRestaurant = $("<div>");
        var name = $("<h5>").text(otherPlaces[k].name).addClass("mb-0");
        var rating = $("<a>").text("Rating: " + otherPlaces[k].rating);
        var web = $("<a>").text("Web").attr("href", placeResponse.website);
        var map = $("<a>").text("Map").attr("href", placeResponse.url);
        otherRestaurant.append(name);
        otherRestaurant.append(rating).append(" | ");
        otherRestaurant.append(web).append(" | ");
        otherRestaurant.append(map);
        $("#otherRestaurants").append(otherRestaurant).append("<br>")
    }
}

function OutputEventsData(userResponse, friendResponse) {
    for (var i = 0; i < userResponse.length; i++) {
        var userEvent = userResponse[i].id
        for (var j = 0; j < friendResponse.length; j++) {
            var friendEvent = friendResponse[j].id
            if (userEvent === friendEvent) {
                //console.log(userEvent);

                var eventName = friendResponse[j].name.html;
                var eventUrl = friendResponse[j].url;
                var eventTime = moment(friendResponse[j].start).format('M/D/YYYY');
                var venueName = friendResponse[j].venue.name;
                var venueCity = friendResponse[j].venue.address.city;

                var spaces = "&nbsp;&nbsp;"

                //console.log(eventName);
                //console.log(eventUrl);
                //console.log(eventTime);
                //console.log(venueName);
                //console.log(venueCity);


                //BELOW IS AN EXAMPLE FOR RESULTS PAGE
                var eventListing = "<li>" + eventTime + spaces + "<a href='" + eventUrl + "'>" + eventName + "</a>" + spaces + venueName + " - " + venueCity + "</li>";
                //console.log(eventListing);

                $("#bestMatchingEvent").append(eventListing);
            }
            else { console.log("no match") }
        }
    }

}
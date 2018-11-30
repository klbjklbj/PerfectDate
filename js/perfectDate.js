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

// Get parameters from URLs to know which user is completing the form
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

var dataref = "couples/" + getUrlParameter('connkey');
var datarefURLs = "couples/" + getUrlParameter('connkey') + "/" + getUrlParameter('userid');

// Select Restaurant
$("#foodPlace").change(function () {
    if ($(this).val() === "restaurant") {
        $(".moreOptions").empty();
        var restaurantType = $("<label>").text("Restaurant type:").attr("id", "restaurantType");
        var restaurant = $("<select>").attr("id", "restaurant");
        var additional = $("<label>").text("Additional preferences if any: ").attr("id", "additionalPreferences");
        var input = $("<input>").attr("type", "text").attr("id", "otherFoodPlace");
        var selectOne = $("<option>").text("Select One").attr("value", "");
        var barbecue = $("<option>").text("Barbecue").attr("value", "barbecue");
        var chinese = $("<option>").text("Chinese").attr("value", "chinese");
        var greek = $("<option>").text("Greek").attr("value", "greek");
        var italian = $("<option>").text("Italian").attr("value", "italian");
        var indian = $("<option>").text("Indian").attr("value", "indian");
        var mexican = $("<option>").text("Mexican").attr("value", "mexican");
        var pizza = $("<option>").text("Pizza").attr("value", "pizza");
        var seafood = $("<option>").text("Seafood").attr("value", "seafood");
        var steakhouse = $("<option>").text("Steakhouse").attr("value", "steakhouse");
        var vegetarian = $("<option>").text("Vegetarian").attr("value", "vegetarian");
        var other = $("<option>").text("Other").attr("value", "");
        restaurant.append(selectOne, barbecue, chinese, greek, italian, indian, mexican, pizza, seafood, steakhouse, vegetarian, other);
        restaurantType.append("<br>").append(restaurant);
        additional.append(input);
        $(".moreOptions").append(restaurantType).append(additional);
    }

    else if ($(this).val() === "other") {
        $(".moreOptions").empty();
        var additional = $("<label>").text("Please specify: ");
        var input = $("<input>").attr("type", "text").attr("id", "otherRestaurant").attr("id", "otherFoodPlace");
        additional.append(input);
        $(".moreOptions").append(additional);
    }

    else if ($(this).val() === "selectOne") {
        $(".moreOptions").empty();
    }

    else {
        $(".moreOptions").empty();
        var additional = $("<label>").text("Additional preferences if any: ");
        var input = $("<input>").attr("type", "text").attr("id", "otherFoodPlace");
        additional.append(input);
        $(".moreOptions").append(additional);
    };
});

var place = "";
var date = "";

// Pull "place" and "date" from database
window.onload = function () {
    db.ref(dataref + "/location").once("value", function (snapshot) {
        place = snapshot.val();
    });

    db.ref(dataref + "/date").once("value", function (snapshot) {
        date = snapshot.val();
    });

    ///////////// if Preferences are submited i.e. (status = 1) redirect to results page
    db.ref(datarefURLs + "/status").once("value", function (snapshot) {
        if (snapshot.val() === 1) {
            window.location.href = "resultPage.html?connkey=" + getUrlParameter('connkey') + "&userid=" + getUrlParameter('userid') + "&friendid=" + getUrlParameter('friendid');
        }
    });

}

//Make an AJAX call to google API with user's input to receive Response
$(document).ready(function () {
    $(".submitSelection").on("click", function () {
        event.preventDefault();

        // Google places API call
        if ($("#foodPlace").val() === "selectOne" || $("#eventType").val() === "") {
            event.preventDefault();
        }
        else if ($("#foodPlace").val() === "restaurant" && $("#restaurant").val() !== "") {
            event.preventDefault();

            var query = $("#foodPlace").val() + " " + $("#restaurant").val() + " " + $("#otherFoodPlace").val() + " " + "in " + place;
        }
        else if ($(".submitSelection").val() === "other") {
            event.preventDefault();
            var query = $("#otherFoodPlace").val() + " " + "in " + place;
        }
        else {
            event.preventDefault();
            var query = $("#foodPlace").val() + " " + $("#otherFoodPlace").val() + " " + "in " + place;
        }

        //////////////// Adding Restaurant URL to DB
        //var API_KEY = "AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM";
        //var googleQueryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + API_KEY;
        db.ref(datarefURLs).child("Restaurant_queryURL").set(query);

        // Eventbrite API call
        var eventType = $("#eventType").val();
        //  results for price are either "free" or "paid"...looks like we can't do price range or else it could limit options unnecessarily
        var price = $("input[name=inlineRadioOptions]:checked").val();
        var otherKeywords = $("#otherKeywords").val(); //otherKeywords is a string for the "q" parameter
        var date1 = date + "T00:00:00";
        var date2 = date + "T23:59:59";
        var token = '5E76NLXTIQ7IVJFI3SNJ'; //Eventbrite API Key

        var price = $("input[name=inlineRadioOptions]:checked").val();
        //  results for price are either "free" or "paid"...looks like we can't do price range or else it could limit options unnecessarily

        if (eventType !== "" && $("#foodPlace").val() !== "selectOne") {
            var eventBriteQueryUrl = "https://www.eventbriteapi.com/v3/events/search/?token=" + token + "&q=" + otherKeywords + "&location.address=" + place + "&start_date.range_start=" + date1 + "&start_date.range_end=" + date2 + "&categories=" + eventType + "&price=" + price + "&expand=venue"; //added venue expansion

            //////////////// Adding Eventbrite URL to DB
            db.ref(datarefURLs).child("Event_queryURL").set(eventBriteQueryUrl);

            ////////////// Set status = 1 and go to results page
            db.ref(datarefURLs + "/status").set(1);

            ////////////// Navigate away - to results page.
            window.location.href = "resultPage.html?connkey=" + getUrlParameter('connkey') + "&userid=" + getUrlParameter('userid') + "&friendid=" + getUrlParameter('friendid');
        }
    });
});

// when both users complete forms (use window.onload)
    // run response 
    // pull place ids
    // compare place id
    // show result 

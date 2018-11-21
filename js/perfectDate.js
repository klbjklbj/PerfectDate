/*
var config = {
    apiKey: "AIzaSyB76U2wdaiboIdMzc9aocSoMprAUIGjUbY",
    authDomain: "vahedemo.firebaseapp.com",
    databaseURL: "https://vahedemo.firebaseio.com",
    projectId: "vahedemo",
    storageBucket: "vahedemo.appspot.com",
    messagingSenderId: "447795963850"
};
firebase.initializeApp(config);

var database = firebase.database();
*/


$("#submit").on("click", function () {
    event.preventDefault();
    var query = $("#foodPlace").val() + " " + $("#otherFoodPlace").val() + $("#restaurant").val() + " " + $("#otherRestaurant").val() + "in " + $("#location").val(); 
    var minPrice = $("#priceMin").val();
    var maxPrice = $("#priceMax").val();
    var API_KEY = "AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM";
    //var API_KEY = "zykZaud5RdF8nTZ-4mUSjKfb4kDEWxEJGT97O2wB98wLWNMmrYf-UhxhE0pNSBmR3Xc-hVlgBOA8cXkPnxK5C2ROJ4k06Qqn4ykmzfqzAj2DlnONRez9ziLot27zW3Yx"
    var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&minprice=" + minPrice + "&maxprice=" + maxPrice + "&key=" + API_KEY;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
    })
});

// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ_8Dquo9skFQRx3XvidLWtAU&key=AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM
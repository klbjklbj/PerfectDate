
$(".submitName").on("click", function () {
    var name = $("#name").val();
    var place = $("#location").val();
    var date = $("#date").val();

    if (name === "" || place === "" || date === "") {
        event.preventDefault()
    }
    else {
        localStorage.clear();
        localStorage.setItem("name", JSON.stringify(name));
        localStorage.setItem("place", JSON.stringify(place));
        localStorage.setItem("date", JSON.stringify(date));
    }

});

$("#submit-food").on("click", function () {
    event.preventDefault();
    var place = localStorage.getItem("place")
    var query = $("#foodPlace").val() + " " + $("#otherFoodPlace").val() + $("#restaurant").val() + " " + $("#otherRestaurant").val() + "in " + place;
    var minPrice = $("#priceMin").val();
    var maxPrice = $("#priceMax").val();
    var API_KEY = "AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM";
    var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&minprice=" + minPrice + "&maxprice=" + maxPrice + "&key=" + API_KEY;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
    })
});

// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ_8Dquo9skFQRx3XvidLWtAU&key=AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM


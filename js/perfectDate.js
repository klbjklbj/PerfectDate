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


//Make an AJAX call to google API wiht user's input to receive Response
$(".submitSelection").on("click", function () {
    if ($("#foodPlace").val() === "selectOne") {
        event.preventDefault();
    }

    else if ($("#foodPlace").val() === "restaurant") {
        event.preventDefault();
        //var place = localStorage.getItem("place")
        var query = $("#foodPlace").val() + " " + $("#restaurant").val() + " " + $("#otherFoodPlace").val() + " " + "in " + place;
        var API_KEY = "AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM";
        var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + API_KEY;

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(queryURL);
            // push querryURL to Firebase
        })
    }
    else if ($(".submitSelection").val() === "other") {
        event.preventDefault();
        var place = localStorage.getItem(place)
        var query = $("#otherFoodPlace").val() + " " + "in " + place;
        var API_KEY = "AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM";
        var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + API_KEY;
        

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(queryURL);
            // push querryURL to Firebase
        });
    }
    else {
        event.preventDefault();
        var place = localStorage.getItem("place")
        var query = $("#foodPlace").val() + " " + $("#otherFoodPlace").val() + " " + "in " + place;
        var API_KEY = "AIzaSyCWUcRBqODE7dNoFCKF4ZvP4EqNm5JbjsM";
        var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + API_KEY;
        

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(queryURL);
            // push querryURL to Firebase
        });   
    }
});


// when both users complete forms (use window.onload)
    // run response 
    // pull place ids
    // compare place id
    // show result 

$(".submitSelection").on("click", function () {

    event.preventDefault();

    //Results currently set to max of 50

    var place = "seattle";
    // This variable to be put in the queryURL...For example, "seattle"  in this part of queryURL..."&location.address=seattle" ...Zip codes and addresses work too.

    var date = "tomorrow";
    // Right now start_date.keyword ("tomorrow") is used. Keyword options are “this_week”, “next_week”, “this_weekend”, “next_month”, “this_month”, “tomorrow”, “today”. This can be changed to actual date or date range.

    var token = '5E76NLXTIQ7IVJFI3SNJ';

    var eventType = $("#eventType").val();

    var otherCategory = $("#otherCategory").val(); //otherCategory is a string for the "q" parameter
    //console.log(otherCategory);

    var subcategory = $("#subcategory").val();
    //There are a lot of subcategories. It's hard to narrow them down to just a few. Music has a bunch, Arts has a bunch, Sports & Fitness does, etc.  Here they are...https://www.eventbriteapi.com/v3/subcategories/?token=5E76NLXTIQ7IVJFI3SNJ&page=1
    // Format might be a better parameter...there are a lot less options and it helps clarify the type of event for which the user is searching. Here is the list of formats ... https://www.eventbriteapi.com/v3/formats/?token=5E76NLXTIQ7IVJFI3SNJ&page=1 
    //console.log(subcategory);


    var otherSubcategory = $("#otherSubcategory").val();
    //console.log(otherSubcategory);
    //***Can't yet get two other input boxes together as one string for the "q=" parameter. So this is not included in queryURL ****//

    var price = $('input[name=inlineRadioOptions]:checked').val();
    //  results for price are either "free" or "paid". looks like we can't do price range.
    //console.log(price); 

    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?token=" + token + "&q=" + otherCategory + "&location.address=" + place + "&start_date.keyword=" + date + "&categories=" + eventType + "&subcategories=" + subcategory + "&price=" + price;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
    })
});
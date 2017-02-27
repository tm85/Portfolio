$(document).ready(function () {
    //Start the game
   $("#workExamples img").on('click', this, function () {
        //Open full size image when it is clicked onclick
        //Get name of original image from data
        var popUpImg = "images/" + $(this).data("largeImg");
        $(this).after($("<div></div>")
            .attr("id", "popUpOverlay")
            .hide() //Hide created div to prevent it from appearing right away
            .append(
            $("<img></img>").attr({
                "src": popUpImg,
                "alt": $(this).attr('title'),
                "title": $(this).attr('title')
            }).css("height",window.innerHeight))
            .fadeIn(600));
    });//End of #workExamples img onclick
    $("#workExamples").on('click', "#popUpOverlay img, #popUpOverlay", function () {
        //Fade out overlay div then remove once finished
        $("#popUpOverlay").fadeOut(600, function () {
            $("#popUpOverlay").remove();
        });
    })//End of onclick

})//End of (document).ready

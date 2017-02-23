//Create user
var userPlaying;

function initUser() {
    return RPS($('#firstname').val(), $('#lastname').val());
}
function rpsPlay(played) {
    //Convert user's choice into Object
    var userPlayed = userPlaying.convertToObj(played);

    //Generate Comp's choice while passing in user obj
    var compPlayed = userPlaying.aiPlay.aiChoice.call(userPlaying);
    //Adjust Probability based on which hands were played.  Passes through user obj and user's selection
    userPlaying.aiPlay.adjustProb.call(userPlaying, userPlayed);

    //create gameResult div if it does not exist
    if ($("#gameResult").length === 0)
        $("<div></div>").attr("id", "gameResult").appendTo("#playArea");

    //Check to see # of div elements in #gameResult.  If more than 5, remove last div. Helps prevent long scrolling page 
    var divCount = $("#gameResult").children().length;
    var maxShow = 1; //Set number of results you would like to show
    if (divCount >= 1) {
        //Remove last div
        $("#gameResult").children("div").last().remove();
    }//

    //Construct new divs with ids from the playCnt object variable
    var resultName = "result" + userPlaying.count.playCnt;
    //create resultName with unique id
    $("<div></div>").attr("id", resultName).prependTo("#gameResult");

    //Concat # for ID identifier
    resultName = "#" + resultName;

    //Users Choice
    $("<div>User Played: " + userPlayed.name + "</div>").css("margin-top", "10px").appendTo(resultName);
    //Comps Choice
    $("<div>Comp Played: " + compPlayed.name + "</div>").css("margin-bottom", "10px").appendTo(resultName);

    //Get Result
    var result = userPlaying.compareHands(userPlayed.name, compPlayed.name);
    $("<div>Result: " + result + "</div>").css("margin-bottom", "10px").appendTo(resultName);
    $("<div>" +
        " Play Count: " + userPlaying.count.playCnt +
        " - Wins:" + userPlaying.count.winCnt +
        " - Loses: " + userPlaying.count.loseCnt +
        " - Ties: " + userPlaying.count.tieCnt +
        "</div>").css({
            "font-weight": "bold",
            "margin-top": "10px"
        }).appendTo(resultName);
}//end of function rpsPlay();

$(document).ready(function () {
    //Start the game
    $('#startGame').on('click', function () {
        //$('#resetGame').show();

        //Resets playArea on new submission
        $('#playArea').empty();
        userPlaying = initUser();
        $('<div>Hello ' + userPlaying.createFormalName() + '</div>').attr('id', 'greeting').appendTo('#playArea');

        var greetingInstr = "Lets play a simple game of Rock, Paper, Scissors game!";
        $('<div>' + greetingInstr + '</div>').attr('id', 'greetingInstr').appendTo('#playArea');

        //Create buttons for playing 
        $('<div></div>').attr('id', 'chooseMove').appendTo('#playArea');
        var playedObj = userPlaying.handPlayed;
        var gameChoices = [playedObj.Rock.name, playedObj.Paper.name, playedObj.Scissors.name]
        for (var i = 0; i < gameChoices.length; i++) {
            $('<input>').attr({
                type: "button",
                id: gameChoices[i],
                value: gameChoices[i],
                onclick: "rpsPlay(\"" + gameChoices[i] + "\")"
            }).appendTo('#chooseMove');
        }//End for   
    });//End of #startGame 
    $("#workExamples img").on('click', this, function () {
        console.log($(this).attr('title'));
        console.log($(this).data("largeImg"));
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
                "title": $(this).attr('title'),
            }))
            .fadeIn(600));
    });//End of #workExamples img onclick
    $("#workExamples").on('click', "#popUpOverlay img, #popUpOverlay", function () {
        //Fade out overlay div then remove once finished
        $("#popUpOverlay").fadeOut(600, function () {
            $("#popUpOverlay").remove();
        });
    })//End of onclick

})//End of (document).ready

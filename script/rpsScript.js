$(document).ready(function () {
    $('#startGame').on('click', function () {
        //$('#resetGame').show();

        //Resets playArea on new submission
        $('#playArea').empty();
        userPlaying = initUser();
        $('<div>Hello ' + userPlaying.createFormalName() + '</div>').attr('id', 'greeting').appendTo('#playArea');

        var greetingInstr = "Lets play a simple game of Rock, Paper, Scissors!";
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
})

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

//Rock Paper Scissors Construct
(function (global) {
    //Initialize RPS object and current user playing
    var RPS = function (firstname, lastname) {
        return new RPS.init(firstname, lastname);
    }
    var initProb = 1 / 3;
    //Set prototype methods and variables
    RPS.prototype = {
        createFormalName: function (firstname, lastname) {
            return this.firstname + " " + this.lastname;
        },
        incCount: function (countObj) {
            //Increment playCnt when function is invoked and increment correct variable
            this.count.playCnt++;
            countObj.count++;
        },
        aiPlay: {
            aiChoice: function () {
                //RNG to find initial probability for comp to play certain hands
                var aiProb = Math.random();
                var obj = this.handPlayed;

                //Compare probability to see which hand comp will play
                if (aiProb < obj.Rock.prob) {
                    return { name: "Rock", prob: aiProb };
                }
                else if (aiProb < (obj.Rock.prob + obj.Paper.prob)) {
                    return { name: "Paper", prob: aiProb };
                }
                else {
                    return { name: "Scissors", prob: aiProb };
                }
            },
            //Adjust probability based on users selection. Obj = user played object
            adjustProb: function (obj) {
                var paperProb = this.handPlayed.Paper;
                var rockProb = this.handPlayed.Rock;
                var scissorsProb = this.handPlayed.Scissors;
                if (obj.name === "Rock") {
                    //Increase Comp Paper Prob, and decrease others
                    adjust.call(this, paperProb, rockProb, scissorsProb);
                }
                else if (obj.name === "Paper") {
                    //Increase Comp Scissors Prob, and decrease others                   
                    adjust.call(this, scissorsProb, paperProb, rockProb);

                }
                else {
                    //Increase Comp Rock Prob, and decrease others
                    adjust.call(this, rockProb, scissorsProb, paperProb);
                }

                function adjust(incProb, decProb, decProb2) {
                    var upperLimit = 0.60; //Set a upper limit 
                    var lowerLimit = 0.15; // Set lower limit
                    if (incProb.prob <= upperLimit) {
                        //incProb increases by .04 to allow chance for win. 
                        incProb.prob = incProb.prob + .04;
                    }
                    if (decProb.prob > lowerLimit) {
                        //decProb decreases slightly to allow chance for tie
                        decProb.prob = decProb.prob - .01;
                    }
                    if (decProb2.prob > lowerLimit) {
                        //decProb2 decreases chance of playing losing hand against played hand
                        decProb2.prob = decProb2.prob - .03;
                    }
                    return this;
                }//End of adjust
            }//End of adjustProb fn 
        },
        compareHands: function (userHand, compHand) {
            var playerStatus = "";

            if (userHand === compHand)
                playerStatus = "Tie";
            else {
                if (userHand === "Rock") {
                    if (compHand === "Paper")
                        playerStatus = "Lose";
                    else
                        playerStatus = "Win";
                }
                if (userHand === "Paper") {
                    if (compHand === "Rock")
                        playerStatus = "Win";
                    else
                        playerStatus = "Lose";
                }
                if (userHand === "Scissors") {
                    if (compHand === "Rock")
                        playerStatus = "Lose";
                    else
                        playerStatus = "Win";
                }
            }//end of else userHand, compHand not equal

            this.storeStatus(playerStatus);
            return playerStatus;
        },
        storeStatus: function (status) {
            if (status === "Win")
                this.count.winCnt++;
            else if (status === "Lose")
                this.count.loseCnt++;
            else
                this.count.tieCnt++;

        },
        convertToObj: function (userPlayed) {
            //Find object in prototype from string that is selected from buttons
            var handObj = this.handPlayed;
            if (userPlayed === "Rock") {
                this.incCount(handObj.Rock);
                return handObj.Rock;
            }
            else if (userPlayed === "Paper") {
                this.incCount(handObj.Paper);
                return handObj.Paper;
            }
            else {
                this.incCount(handObj.Scissors);
                return handObj.Scissors;
            }
        }//End of converToObj;
    };

    RPS.init = function (firstname, lastname) {
        //User Constructor
        var self = this;
        self.firstname = firstname || "Rock, Paper, Scissors";
        self.lastname = lastname || "Guru";

        //Initial variables
        self.count = {
            playCnt: 0,
            winCnt: 0,
            loseCnt: 0,
            tieCnt: 0,
        },
            self.handPlayed = {
                Rock: { name: "Rock", prob: initProb },
                Paper: { name: "Paper", prob: initProb },
                Scissors: { name: "Scissors", prob: initProb },
            }
    };

    RPS.init.prototype = RPS.prototype;

    //Set global variable to be used later
    global.RPS = RPS;

}(window))
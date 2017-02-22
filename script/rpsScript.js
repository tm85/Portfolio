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

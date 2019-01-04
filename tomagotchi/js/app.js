// SET UP TITLE SCREEN ANIMATION
let startPosX = 0;
titleScreenAnim();
function titleScreenAnim(){
    $('#startAnim').css("background-image", "url('assets/Dog_walk.gif')");
    // $('#startAnim').css("transform", "rotateY(180deg)");

    let leftOffset = '+=10';

    let randDist = Math.floor(Math.random()*300+30);    // random distance
    let randTime = Math.floor(Math.random()*1000+2000); // random duration
    let randDir = Math.floor(Math.random()*360);        // left and right

    leftOffset = "+=" + (randDist * Math.cos(randDir*Math.PI/180)).toString();
    let animObject = {
        left: leftOffset,
    }

    let futurePosX = (randDist * Math.cos(randDir*Math.PI/180)) + startPosX;
    if (futurePosX < 0 || futurePosX > 600){
        titleScreenAnim();
        return;
    }

    startPosX += randDist * Math.cos(randDir*Math.PI/180);

    if (randDir <= 90 || randDir >= 270){
        $('#startAnim').css("transform", "rotateY(180deg)");
    } else {
        $('#startAnim').css("transform", "rotateY(0deg)");
    }

    $('#startAnim').animate(animObject, randTime, function() {
        $(this).after(titleScreenAnim());
    });
}

// SET UP ENVIRONMENT
const environment = {
    animations: [],
    daylight: true,
    timer: 0,
    toggleLight(){
        daylight = !daylight;
    }
};

// START GAME WHEN BUTTON IS CLICKED
let husky = $("#character");
let player1 = {};
let interval1 = null;
let interval2 = null;
let interval3 = null;
let gameLoop = null;
let ageCounter = 0;
$("#start").on('click', function(event){
    init();
})

// GAME START FUNCTION
function init() {

    // TAKE USER INPUT AND MAKE TOMAGOTCHI
    let playerName = prompt("What's the dude's name?");
    let player = new Tomagotchi(playerName);  // User text input
    player1 = player;                           // Global tomagotchi object

    // DISPLAY TOMAGOTCHI AT CENTER OF SCREEN
    husky.css("background-image", player1.imgUrl);

    // START GAME LOOP TO HANDLE ANIMATION/HUNGER/ETC.
    animateChar();

    // START TIMERS FOR HUNGER, BOREDOM, ETC.
    timer();

    // HIDE THE START BUTTON AND SHOW THE GAME
    $("#start").hide();
    $("#game").css("visibility","visible");
    $("#game").css("position","static");
    $("#titleScreen").remove();

    // SET ON CLICK EVENTS FOR ALL BUTTONS
    $('#feed, #play, #exercise').on('click', function(){
        if (player1.alive) {
            if ($(this).attr("id")=="feed") {
                if (player1.hunger < 40){
                    player1.hunger = 0;
                } else {
                    player1.hunger -= 40;
                }
                $('#hunger').attr('style','width:'+player1.hunger+'%');
            } else if ($(this).attr("id")=="play") {
                if (player1.boredom < 20){
                    player1.boredom = 0;
                } else {
                    player1.boredom -= 20;
                }
                $('#boredom').attr('style','width:'+player1.boredom+'%');
            } else if ($(this).attr("id")=="exercise") {
                if (player1.sleepiness < 20){
                    player1.sleepiness = 0;
                } else {
                    player1.sleepiness -= 20;
                }
                $('#sleepiness').attr('style','width:'+player1.sleepiness+'%');
            }    
        }
    });

    $('#lightOn, #lightOff').on('click', function(){
        if (environment.daylight && $(this).attr("id")=="lightOff"){
            $('#environment').css("filter","brightness(50%)")
            environment.daylight = false;
        } else if (!environment.daylight && $(this).attr("id")=="lightOn"){
            $('#environment').css("filter","brightness(100%)")
            environment.daylight = true;
        }
    });

    $('#newGame').on('click', function(){
        window.location.reload();
    });
}

// GAME END FUNCTION
function endGame() {
    // Stop changing hunger and age
    clearInterval(gameLoop);
    player1.alive = false;
    player1.kill();
    $('#newGame').css("visibility","visible");
}

function timer(){
    gameLoop = setInterval(function(){
        // INCREASE/DECREASE STATS RANDOMLY
        player1.hunger += 10;
        $('#hunger').attr('style','width:'+player1.hunger+'%');
        player1.sleepiness += 10;
        $('#sleepiness').attr('style','width:'+player1.sleepiness+'%');
        player1.boredom += 10;
        $('#boredom').attr('style','width:'+player1.boredom+'%');
        checkIfMaxed();
        checkDangerLevel();
        ageCounter ++;
        // INCREASE AGE EVERY 5 SEC
        if (ageCounter%2 == 0) {
            player1.getOlder();
            ageCounter = 0;
        }
        $('#charAge').text(`Age : ${player1.age}`);
        if (player1.age >= 30){
            endGame();
        }
    }, 1000);
}

// SET UP GAME LOOP THAT WILL BE CALLED AFTER EACH ANIMATION

function animateChar(){
    // CYCLE BETWEEN WALK/IDLE/SITTING ACTIONS BASED ON RANDOM NUMBER
    let rand = Math.floor(Math.random()*4);
    // console.log(`The random number is ${rand} and a new animation should begin`);
    // CHECK IF CHARACTER IS DEAD!
    if (!player1.alive) {
        player1.kill();
        return
    }
    switch (rand) {
    case 0:
        player1.wag();
    break;
    case 1:
        player1.sit();
    break;
    case 2:
        player1.walk();
    break;
    case 3:
        player1.bark();
    break;
    default:
        animateChar();
    }
}

function checkIfMaxed(){
    if (player1.hunger >= 100 || player1.sleepiness >= 100 || player1.boredom >= 100 ){
        endGame();
    }
}

let sleepFlashing = false;
let hungerFlashing = false;
let boredomFlashing = false;
function checkDangerLevel(){
    // HUNGER DANGER LEVEL
    if (player1.hunger == 70){
        if (!hungerFlashing){
            interval1 = setInterval(function(){
                if ($('#hunger').hasClass("bg-primary")){
                    $('#hunger').removeClass("bg-primary");
                    $('#hunger').addClass("bg-danger");
                    console.log("You should see changing colors!");
                } else {
                    $('#hunger').removeClass("bg-danger");
                    $('#hunger').addClass("bg-primary");
                }
                hungerFlashing = true
            }, 200);
        }
    } else if (player1.hunger > 70){
        hungerFlashing = true;
    } else {
        hungerFlashing = false;
        clearInterval(interval1);
        $('#hunger').removeClass("bg-danger");
        $('#hunger').addClass("bg-primary");
    }
    // BOREDOM DANGER LEVEL
    if (player1.boredom == 70){
        if (!boredomFlashing){
            interval2 = setInterval(function(){
                if ($('#boredom').hasClass("bg-success")){
                    $('#boredom').removeClass("bg-success");
                    $('#boredom').addClass("bg-danger");
                    console.log("You should see changing colors!");
                } else {
                    $('#boredom').removeClass("bg-danger");
                    $('#boredom').addClass("bg-success");
                }
                boredomFlashing = true;
            }, 200);
        }
    } else if (player1.boredom > 70){
        boredomFlashing = true;
    } else {
        boredomFlashing = false;
        clearInterval(interval2);
        $('#boredom').removeClass("bg-danger");
        $('#boredom').addClass("bg-success");
    }
    // SLEEPINESS LEVEL
    if (player1.sleepiness == 70){
        if (!sleepFlashing){
            interval3 = setInterval(function(){
                if ($('#sleepiness').hasClass("bg-info")){
                    $('#sleepiness').removeClass("bg-info");
                    $('#sleepiness').addClass("bg-danger");
                    console.log("You should see changing colors!");
                } else {
                    $('#sleepiness').removeClass("bg-danger");
                    $('#sleepiness').addClass("bg-info");
                }
                sleepFlashing = true;
            }, 200);
        }
    } else if (player1.sleepiness > 70){
        sleepFlashing = true;
    } else {
        sleepFlashing = false;
        clearInterval(interval3);
        $('#sleepiness').removeClass("bg-danger");
        $('#sleepiness').addClass("bg-info");
    }
}
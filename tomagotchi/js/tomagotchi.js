class Tomagotchi {
    constructor(name) {
        this.name = name
        this.hunger = 0
        this.sleepiness = 0
        this.boredom = 0
        this.age = 0
        this.alive = true
        this.$location = $('#character')
        this.defaultAnim = "url('assets/Dog_bark.gif')"
        this.height = 48
        this.width = 73
        this.posX = 0
        this.posY = 0
        this.orientation = "left"
        this.barkAnim = "url('assets/Dog_bark.gif')"
        this.walkAnim = "url('assets/Dog_walk.gif')"
        this.runAnim = "url('assets/Dog_run.gif')"
        this.sitAnim = "url('assets/Dog_sitting.gif')"
        this.wagAnim = "url('assets/Dog_Wag.gif')"
        this.deadSprite = "";
    }
    feed(){
        // We feed this dude
    }
    play(){
        // We play with dude
    }
    exercise(){
        // We force labor upon dude
    }
    kill(){
        // This is pretty self-explanatory

    }
    getOlder(){
        this.age++;
        if (!(this.age%3) && (this.age < 20)){
            // Increase the size of the sprite every multiple of 3 up until 20
            this.height *= 1.1;
            this.width *= 1.1;
            this.$location.css("height", `${this.height}px`);
            this.$location.css("width", `${this.width}px`);
            this.$location.css("background-size", "cover");
        } else if (this.age >= 30){
            this.alive = false;
        } else {
            //Nothing
        }
    }
    wag(){
        this.$location.css("background-image", this.wagAnim);
        // Add a delay before going to game loop
        setTimeout(animateChar(), 2000);
    }
    sit(){
        // This starts the sitting animation
        this.$location.css("background-image", this.sitAnim);
        // Add a delay before going to game loop
        setTimeout(animateChar(), 2000);
    }
    bark(){
        // This starts the bark animation (frames 0-4)
        this.$location.css("background-image", this.barkAnim);
        // Add a delay before going to game loop
        setTimeout(animateChar(), 2000);
    }
    walk(){
        // DEFAULT VALUES FOR DIRECTION
        let topOffset = '+=10';
        let leftOffset = '+=10';

        // GENERATE RANDOM NUMBER FOR DISTANCE (IN PX), TIME (IN MS), AND DIRECTION (IN DEGREES)
        let randDist = Math.floor(Math.random()*300+30);
        let randTime = Math.floor(Math.random()*1000+2000);
        let randDir = Math.floor(Math.random()*360);

        // GET ANIMATION VALUES BASED ON RNG
        topOffset = "+=" + (randDist * Math.sin(randDir*Math.PI/180)).toString();
        leftOffset = "+=" + (randDist * Math.cos(randDir*Math.PI/180)).toString();
        let animObject = {
            top: topOffset,
            left: leftOffset,
        }

        // CHECK IF LEFT IS <0 OR >$('#environment').width() and IF TOP IS <0 or >$('#environment').height()
        let futurePosX = (randDist * Math.cos(randDir*Math.PI/180)) + this.posX;
        let futurePosY = (randDist * Math.sin(randDir*Math.PI/180)) + this.posY;
        if (futurePosX < 0 || futurePosX > $('#environment').width()-this.width || futurePosY < 0 || futurePosY > $('#environment').height()-this.height){
            animateChar();
            return;
        }

        // CHANGE BACKGROUND TO WALKING/RUNNING GIF AND FLIP TO PROPER DIRECTION
        this.$location.css("background-image", this.walkAnim);
        if (randDist/randTime > .05) {
            this.$location.css("background-image", this.runAnim);
        }
        
        if (randDir <= 90 || randDir >= 270){
            this.turnRight();
        } else {
            this.turnLeft();
        }
        
        // DO ANIMATION. SET NEW POSITION. CALL ANOTHER AFTER COMPLETE.
        this.posY += randDist * Math.sin(randDir*Math.PI/180);
        // console.log(`Position Y is being incremented by ${randDist * Math.sin(randDir*Math.PI/180)}`)
        this.posX += randDist * Math.cos(randDir*Math.PI/180);
        // console.log(`Position X is being incremented by ${randDist * Math.cos(randDir*Math.PI/180)}`)
        this.$location.animate(animObject, randTime, function() {
            $(this).after(animateChar());
        });
    }
    turnLeft(){
        if (this.orientation == "right") {
            this.$location.css("transform", "rotateY(0deg)");
            this.orientation = "left";
        } else {
            // DO NOTHING
        }
    }
    turnRight(){
        if (this.orientation == "left") {
            this.$location.css("transform", "rotateY(180deg)");
            this.orientation = "right";
        } else {
            // DO NOTHING
        }
    }
}
// var game;

var functions = {
    onStart : function (){
        
        //Initialize
        moblab.createDynamicGame(this, 50);
        
        //simulate mobile
        if (this.isMobile){
            $('#phaserGame').css('display', 'none');
        } else{
            $('#mobileMenu').css('display', 'none');
        }
        
        new Phaser.Time(this.game);
        //Make scope bindings

        //Add States
        moblab.addState(this, 'round', this.preloadRound, this.createRound, this.updateRound);
        this.game.state.start('round');
    },
    
    //PHASER FUNCTIONS
    preloadRound : function(){
        var path = './img/';
        moblab.loadImage(this, 'audience', path + 'audience.jpg');
        moblab.loadImage(this, 'stands', path + 'stands.png');
        moblab.loadImage(this, 'blueContainer', path + 'blueContainer.png');
        moblab.loadImage(this, 'greenContainer', path + 'greenContainer.png');
        moblab.loadSpritesheet(this, 'handsUp', path + 'handsVertical.png', 130, 130);
        moblab.loadSpritesheet(this, 'handsLeft', path + 'handsLeft.png', 130, 130);
        moblab.loadSpritesheet(this, 'handsRight', path + 'handsRight.png', 130, 127);
        moblab.loadImage(this, 'selectRock', path + 'selectRock.png');
        moblab.loadImage(this, 'selectPaper', path + 'selectPaper.png');
        moblab.loadImage(this, 'selectScissors', path + 'selectScissors.png');
        moblab.loadImage(this, 'spotlightLeft', path + 'spotlightLeft.png');
        moblab.loadImage(this, 'spotlightRight', path + 'spotlightRight.png');
        moblab.loadImage(this, 'table', path + 'table.png');
        
        this.choice = 0;
        this.choiceText = 'Rock';
        this.isWaiting = false;
    },
    
    createRound : function(){
        
        this.buildBackground();
        
        //SELECTING GROUP
        this.selecting = this.game.add.group();
        this.waiting = this.game.add.group();
        this.showtime = this.game.add.group();
        this.results = this.game.add.group();
        this.buildSelecting();
        moblab.tween(this, this.selecting, {alpha: 1}, 500, true);
    },
    
    updateRound : function(){
        
        if (this.isWaiting){
            this.startTime = this.game.time.time;
            this.yourChoice.frame = this.choice;
            this.yourChoiceText.text = this.choiceText;
        }
        
    },
    
    //HELPER FUNCTIONS
    
    buildBackground : function(){
        var audience = moblab.addDynamicSprite(this, 0, 0.5, 'audience');
        audience.anchor.setTo(0, 1);
        moblab.scaleByWidth(this, audience, 1);
        
        var stands = moblab.addDynamicSprite(this, 0, 0.5, 'stands');
        moblab.scaleByWidth(this, stands, 1);
        
        var table = moblab.addDynamicSprite(this, 0, 1.01, 'table');
        table.anchor.setTo(0, 1);
        moblab.scaleByWidth(this, table, 1);
    },
    
    buildSelecting : function(){
        
        var selectRock = moblab.addDynamicSprite(this, 1/4, 5/6, 'handsUp', this.selecting, 0);
        selectRock.anchor.setTo(0.5, 1);
        moblab.scaleByHeight(this, selectRock, 130/600);
        moblab.makeUIElement(this, selectRock, 0.7, this.chooseRock);
        moblab.addDynamicText(this, 1/4, 5/6, 'Rock', this.selecting).anchor.setTo(0.5, -0.2);
        
        var selectPaper = moblab.addDynamicSprite(this, 1/2, 5/6, 'handsUp', this.selecting, 1);
        selectPaper.anchor.setTo(0.5, 1);
        moblab.scaleByHeight(this, selectPaper, 130/600);
        moblab.makeUIElement(this, selectPaper, 0.7, this.choosePaper);
        moblab.addDynamicText(this, 1/2, 5/6, 'Paper', this.selecting).anchor.setTo(0.5, -0.2);
        
        var selectScissors = moblab.addDynamicSprite(this, 3/4, 5/6, 'handsUp', this.selecting, 2);
        selectScissors.anchor.setTo(0.5, 1);
        moblab.scaleByHeight(this, selectScissors, 130/600);
        moblab.makeUIElement(this, selectScissors, 0.7, this.chooseScissors);
        moblab.addDynamicText(this, 3/4, 5/6, 'Scissors', this.selecting).anchor.setTo(0.5, -0.2);
        
        var blueContainer = moblab.addDynamicSprite(this, 1/2, 1/3, 'blueContainer', this.selecting);
        blueContainer.anchor.setTo(0.5, 0.5);
        moblab.scaleByHeight(this, blueContainer, 116/600);
        
        var selectText = moblab.addDynamicText(this, 1/2, 1/3, 'Choose Your Next Move', this.selecting);
        selectText.anchor.setTo(0.5, 0.5);
        
        this.selecting.alpha = 0;
    },
    
    buildWaiting : function() {
        
        var blueContainer2 = moblab.addDynamicSprite(this, 1/2, 1/3, 'blueContainer', this.waiting);
        blueContainer2.anchor.setTo(0.5, 0.5);
        moblab.scaleByHeight(this, blueContainer2, 116/600);
        
        var waitText = moblab.addDynamicText(this, 1/2, 1/3, "Waiting For Other Player's Choice... \n You Chose:", this.waiting);
        waitText.anchor.setTo(0.5, 0.5);
        waitText.align = 'center';
        
        
        this.yourChoice = moblab.addDynamicSprite(this, 1/2, 5/6, 'handsUp', this.waiting, this.choice);
        this.yourChoice.anchor.setTo(0.5, 1);
        moblab.scaleByHeight(this, this.yourChoice, 130/600);
        this.yourChoiceText = moblab.addDynamicText(this, 1/2, 5/6, this.choiceText, this.waiting);
        this.yourChoiceText.anchor.setTo(0.5, -0.2); 
        
        moblab.makeUIElement(this, this.yourChoice, 0.7, this.doneWaiting);
        
        moblab.tween(this, this.yourChoice, {y: this.yourChoice.y+8}, 400, true, 0, 10000, true);
        moblab.tween(this, this.yourChoiceText, {y: this.yourChoiceText.y+8}, 400, true, 0, 10000, true);
        
        this.isWaiting = true;
        this.waiting.alpha = 0;
    },
    
    buildShowtime : function() {

        var spotlightLeft = moblab.addDynamicSprite(this, 0, 0, 'spotlightLeft', this.showtime);
        moblab.scaleByHeight(this, spotlightLeft, 435/600);
        
        var spotlightRight = moblab.addDynamicSprite(this, 1, 0, 'spotlightRight', this.showtime);
        spotlightRight.anchor.setTo(1, 0);
        moblab.scaleByHeight(this, spotlightRight, 435/600);
        
        this.showtime.alpha = 0;
    },
    
    buildResults : function(){

        var greenContainer = moblab.addDynamicSprite(this, 1/2, 1/3, 'greenContainer', this.results);
        greenContainer.anchor.setTo(0.5, 0.5);
        moblab.scaleByHeight(this, greenContainer, 116/600);
        
        var winMessage = this.winner + ' Wins Round ' + this.round;
        var winText = moblab.addDynamicText(this, 1/2, 1/3, winMessage, this.results);
        winText.anchor.setTo(0.5, 0.5);
        
        this.results.alpha = 0;
    },
    
    changeGroup : function(oldGroup, newGroup){
        this.game.canvas.style.cursor = "default";
        oldGroup.removeAll(true, true);
        switch (newGroup) {
            case this.selecting :
                this.buildSelecting();
                break;
            case this.waiting :
                this.buildWaiting();
                break;
            case this.showtime :
                this.buildShowtime();
                break;
            case this.results :
                this.buildResults();
                break;
        }
        newGroup.alpha = 0;
        moblab.tween(this, newGroup, {alpha: 1}, 500, true, 100);
    },
    
    chooseRock : function(){
        this.choice = 0;
        this.choiceText = 'Rock';
        this.changeGroup(this.selecting, this.waiting);
    },
    
    choosePaper : function(){
        this.choice = 1;
        this.choiceText = 'Paper';
        this.changeGroup(this.selecting, this.waiting);
    },
    
    chooseScissors : function(){
        this.choice = 2;
        this.choiceText = 'Scissors';
        this.changeGroup(this.selecting, this.waiting);
    },
    
    doneWaiting : function(){
        this.changeGroup(this.waiting, this.showtime);
    },
    
    //MOBLAB FUNCTIONS
    
    onGameEnd : function(){
        
    },
    
    onRoundEnd : function(){
        
    },
    
    onGameUpdate : function(){
        
    },
    
    onPlayerUpdate : function(){
        
    },
    
    //////HELPERS
    
    
}

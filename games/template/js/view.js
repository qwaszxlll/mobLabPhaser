/*----------------------------------------------------------------------------*\
//********************** MOBLAB PHASER GAME TEMPLATE *************************\\
//************************* for desktop and mobile ***************************\\
/*----------------------------------------------------------------------------*\
 * Template View module for a moblab game using the MVC model, constructed with 
 * Phaser. This template builds the phaser template and initiates a single Round
 * state using the Moblab Phaser Library. New states can be added manually, and
 * require a unique preload and create function to be passed in at minimum. 
 * Moblab functions are triggered by the controller/server and should be built
 * accordingly.
 *
 * Design notes: try to store game variables in the controller and use gameView
 * just for manipulating how Phaser displays things.
 * 
 * See Phaser documentation for more advanced functionality. 
\*----------------------------------------------------------------------------*/

var gameView = {
    
    init : function(controller){
        
        this._controller = controller;
        this._controller.view = this;
        this.DEBUG = true;
      
        //Initialize
        moblab.createDynamicGame(this, 50, 'phaserGame');
        new Phaser.Time(this.game);

        //Make helper function scope bindings

        //Add States
        moblab.addState(this, 'round', this.preloadRound, this.createRound, this.updateRound);
    },
    
    onStart : function (){
        
        this.game.state.start('round');
    },
    
    //PHASER FUNCTIONS
    preloadRound : function(){
        
        var path = './img/';
        moblab.loadImage(this, 'background', path + 'background.jpg');
        
        //TODO
    },
    
    createRound : function(){
        
        this.buildBackground();
        moblab.setPauseInBackground(this, false);
        
        //TODO
    },
    
    updateRound : function(){
        
        //TODO

    },
    
    //HELPER FUNCTIONS
    
    buildBackground : function(){
        
        //TODO
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
    
    
}

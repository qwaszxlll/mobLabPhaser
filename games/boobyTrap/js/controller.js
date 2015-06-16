/*----------------------------------------------------------------------------*\
//********************** MOBLAB PHASER GAME TEMPLATE *************************\\
//************************* for desktop and mobile ***************************\\
/*----------------------------------------------------------------------------*\
 * Template controller module for a moblab game using the MVC model, constructed  
 * with Phaser. This template includes some basic functionality necessary to the
 * game.
 * 
 * Design Notes: Try to use Phaser only in the gameView. 
\*----------------------------------------------------------------------------*/

var gameController = {
    startTime: new Date().getTime(),
    
    makeMove: function(move){
        this.yourMove = move;
    },
    
    getResult: function(){
        //TODO
    }
}
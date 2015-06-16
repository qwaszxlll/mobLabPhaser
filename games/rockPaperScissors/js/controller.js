// var rpsController = Object.create(gameController);
// rpsController.prototype = {
    
// }
var rpsController = {
    startTime: new Date().getTime(),
    theirMove: null,
    payoffMatrix: {
      'Rock': {
          'Rock': 0,
          'Paper': -1,
          'Scissors': 1
      },
      'Paper': {
          'Rock': 1,
          'Paper': 0,
          'Scissors': -1
      },
      'Scissors': {
          'Rock': -1,
          'Paper': 1,
          'Scissors': 0
      }
    },
    makeMove: function(move){
        // var move = {
        //     action: 'FISH',
        //     player: this.player.playerNumber,
        //     user: this.player.userId,
        //     data: [this.currentRound]
        // };
        // this.sendMove(move);
        this.yourMove = move;
    },
    makeDummyMove: function(){
        this.theirMove = 'Paper';
        return this.theirMove;
    },
    getTheirMove: function(){
        return this.theirMove;
    },
    getResult: function(){
        return this.payoffMatrix[this.yourMove][this.theirMove];
    }
}
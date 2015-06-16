
var gameView = {
    
    init : function(controller){
        
        this._controller = controller;
        this._controller.view = this;
        this.DEBUG = true;
      
        //Initialize
        moblab.createDynamicGame(this, 50, 'phaserGame');
        console.log(this.game.time)
        moblab.buildMenuBar(this, 'phaserGame', 50, '#00467A', '#F9A93F');
        

        //Make helper function scope bindings
        var unBox = this.openBox.bind(this);
        //Add States
        moblab.addState(this, 'round', this.preloadRound, this.createRound, this.updateRound);
        moblab.addState(this, 'endRound', this.preloadER, this.createER);
    },
    
    onStart : function (){

        this.game.state.start('round');
    },
    
    //PHASER FUNCTIONS
    preloadRound : function(){
        moblab.preloadSetup(this);

        var path = './img/';
        moblab.loadImage(this, 'background', path + 'background.png');
        moblab.loadImage(this, 'logo', path + 'logo.png');
        moblab.loadSpritesheet(this, 'box', path + 'boxSheet.png', 610, 608);
        moblab.loadImage(this, 'explosion', path + 'explosion.png');
        moblab.loadImage(this, 'money', path + 'money.png');
        moblab.loadImage(this, 'undo', path + 'undoButton.png');
        moblab.loadImage(this, 'done', path + 'done_button.png');
        //TODO
        this.bombWait = Math.random()*10 + 10;
        this.done = false;
        this.round = 1;
        this.startTime = this.game.time.time;
    },
    
    createRound : function(){
        
        this.boxes = [[],[],[],[],[],[],[],[],[],[],[]];
        this.moves = [];
        this.buildBackground();
        moblab.setPauseInBackground(this, false);
        
        //TODO
    },
    
    updateRound : function(){
        moblab.updateMenuBar(this, 15);
        //TODO
        this.boxText.text = 'x' + this.moves.length;
    },
    
    //HELPER FUNCTIONS
    
    buildBackground : function(){
        moblab.addBackground(this, 'background');
        
        var logo = moblab.addDynamicSprite(this, 0.01, 0.01, 'logo');
        moblab.scaleByWidth(this, logo, 0.3);
        
        var helpMsg = "99 boxes contain $1.00, \n1 box contains a bomb. \n \nClick on boxes to collect them, and then when you open the collected boxes at the end of the round, you'd better hope that you didn't collect a bomb!";
        var helpText = moblab.addDynamicText(this, 0.03, 0.3, helpMsg);
        moblab.setStyle(helpText, 18, 0.9*logo.width, '#000000', 1, false);
        
        this.boxCounter = moblab.addDynamicSprite(this, 0.15, 0.75, 'box', false, 1);
        moblab.scaleByWidth(this, this.boxCounter, 0.05);
        
        this.boxText = moblab.addDynamicText(this, 0.22, 0.76, 'x0');
        moblab.setStyle(this.boxText, 25, 100, '#000000', 1, false);
        
        var undoButton = moblab.addDynamicSprite(this, 0.08, 0.75, 'undo');
        moblab.scaleByWidth(this, undoButton, 0.05);
        
        var undo;
        var undoTween = moblab.makeUIElement(this, undoButton, 0.9, function(){
            if (this.moves.length > 0){
                undo = this.moves.pop();
                undo.box.alpha = 1;
                moblab.tween(this, undo.box, {x: undo.x, y: undo.y}, 1000, 0);
                self.open.stop();
            }
        });
        if(undoTween){
            undoTween.onComplete.add(function(){
                undo.box.inputEnabled = true;
                console.log(undo);
            });
        }
            
        
        var doneButton = moblab.addDynamicSprite(this, 0.88, 0.87, 'done');
        doneButton.anchor.setTo(1, 0);
        moblab.scaleByWidth(this, doneButton, 0.2);
        moblab.makeUIElement(this, doneButton, 0.8, function(){
            this.destroyBoxes();
        });
        
        var scale = 0.065
        var dY = scale*this.game.height + 5;
        var dX = 610/608 * dY;
        var startX = 0.42*this.game.width;
        var startY = 0.1*this.game.height;
        for (var j=0; j<10; j++){
            for (var i=0; i<10; i++){
                var x = startX + i * dX;
                var y = startY + j * dY;
                var box = this.game.add.sprite(x, y, 'box');
                this.boxes[j].push(box);
                var self = this;
                moblab.scaleByHeight(this, box, scale);
                moblab.makeUIElement(this, box, 0.9);
                // var unBox = this.openBox.bind(this);
                var self = this;
                box.events.onInputDown.add(function(){
                    this.inputEnabled = false;
                    self.moves.push({x: this.x, y: this.y, box: this});
                    self.open = moblab.tween(self, this, {x: self.boxCounter.x, y: self.boxCounter.y}, 1000, 0);
                    self.open.onComplete.add(function(){
                        this.alpha = 0;
                    }, this)
                    // unBox(this.x + this.width/2, this.y);
                }, box);
            }
        }
        
        
        //TODO
    },
    
    openBox : function(x, y){
        var y2 = y+10

        if (this.moves.length > this.bombWait && !this.done){
            var explosion = moblab.addSprite(this, x, y, 'explosion', this.destroyGroup);
            explosion.anchor.setTo(0.5,0.5);
            moblab.scaleByWidth(this, explosion, 0.2);
            moblab.tween(this, explosion, {alpha:0}, 2000, 1000);
            this.destroyBoxes();
            this.done = true;
        } else{
            var money = moblab.addSprite(this,x,y,'money');
            money.anchor.setTo(0.5,0);
            moblab.scaleByHeight(this, money, 0.05);
            moblab.tween(this, money, {alpha: 0}, 2000, 1000);
        }
    },
    
    destroyBoxes : function(){
        var delay = 0;
        for (var j = 9; j >= 0; j--){
            for (var i = 9; i >= 0; i--){
                delay += 20;
                var destroy = moblab.tween(this, this.boxes[j][i], {alpha:0}, 50, delay);
                this.boxes[j][i].inputEnabled = false;
                this.game.canvas.style.cursor = 'default';
                if (i==0 && j==0){
                    destroy.onComplete.add(function(){
                        this.game.state.start('endRound');
                    }, this)  
                }
            }  
        }
    },
    
    preloadER : function(){
        
    },
    
    createER : function(){
        moblab.addBackground(this, 'background');
        
        var logo = moblab.addDynamicSprite(this, 0.01, 0.01, 'logo');
        moblab.scaleByWidth(this, logo, 0.3);
        
        moblab.makeUIElement(this, logo, 1, function(){
            this.game.state.start('round');
        });
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

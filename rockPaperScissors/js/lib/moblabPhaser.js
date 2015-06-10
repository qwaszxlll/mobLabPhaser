//----------------------------------------------------------------------------//
//*********************** MOBLAB PHASER GAME LIBRARY *************************//
//************************* for desktop and mobile ***************************//
//----------------------------------------------------------------------------//
// Requires preloading jquery (v1.7+) and Phaser
// This library was created to help streamline the building of MOBLAB games 
// with dynamic content for desktop and mobile

//----------------------------------------------------------------------------//
//***************************** SETUP FUNCTIONS ******************************//
//----------------------------------------------------------------------------//
/*      TABLE OF CONTENTS
 *      getWindowHeight(padding)
 *      getWindowWidth()
 *      isMobile()
 *      createPhaserCanvas(width, height, name)
 *      createDynamicPhaserCanvas(padding, name)
 *      createPhaserState(game, state, preloadF, createF, updateF)
 *      loadImage(game, tag, path)
 *      loadSpritesheet(game, tag, path, frameWidth, frameHeight)
 *      getTextX(parent, offsetX)
 *      getTextY(parent, offsetY)
------------------------------------------------------------------------------*/
var moblab = {
    
    createDynamicGame : function (self, padding){
        
        var webHeight = 600;
        var webWidth = 904;
        
        self.isMobile = this.isMobile();
        self.gamePage = 'phaserGame';
        
        //Create Game
        if (self.isMobile){
            var height = $(window).height() - padding;
            var width = $(window).width();
            self.game = new Phaser.Game(width, height, Phaser.AUTO);
        } else{
            var height = webHeight - padding;
            var width = webWidth;
            self.game = new Phaser.Game(width, height, Phaser.AUTO, self.gamePage);
        }
    },
    
    /* 
     * Determines whether or not the device viewing the game is mobile or not
     *
     * @RETURN (BOOL) - true if the device is mobile, false if it is desktop
    */
    isMobile : function (){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            console.log(navigator.userAgent);
            return true;
        }
        return false;
    },
    
    addState : function(self, tag, preload, create, update){
        var preloadS = preload.bind(self);
        var createS = create.bind(self);
        var updateS = update.bind(self);
        
        var newState = function(){};
        
        newState.prototype = { preload: preloadS, create: createS, update: updateS};
                    
        self.game.state.add(tag, newState);
    },
    
    /* 
     * @game (PHASER GAME) - the phaser game to which the state will be added
     * @tag (STRING) - reference tag for asset
     * @path (STRING) - path location of asset
     * 
     * used in the preload() section
    */
    loadImage : function (self, tag, path){
        self.game.load.image(tag, path);
    },
    
    /* 
     * @game (PHASER GAME) - the phaser game to which the state will be added
     * @tag (STRING) - reference tag for asset
     * @path (STRING) - path location of asset
     * @frameWidth (INT) - width of each frame in the spritesheet
     * @frameHeight (INT) - height of each frame in the spritesheet
     * 
     * used in the preload() section
    */
    loadSpritesheet : function (self, tag, path, frameWidth, frameHeight){
        self.game.load.spritesheet(tag, path, frameWidth, frameHeight);
    },
    
    //----------------------------------------------------------------------------//
    //************************* GAME CREATION FUNCTIONS **************************//
    //----------------------------------------------------------------------------//
    /*      TABLE OF CONTENTS
     *      addSprite(game, x, y, srcTag, frame)
     *      makeUIElement(game, target, onDown, onOver, onOut)
     *      function addToolTip(game, toolTips, text, parent, offsetY, isMoving)
     *      setStyle(target, fontSize, width, color, alpha, centered)
     *----------------------------------------------------------------------------*/
    
    
    addDynamicSprite : function(self, xFrac, yFrac, tag, group, frame){
        var x = self.game.width * xFrac;
        var y = self.game.height * yFrac;
        if (!group){
            return self.game.add.sprite(x, y, tag, frame);
        }
        return group.create(x, y, tag, frame);  
    },

    addDynamicText : function(self, xFrac, yFrac, text, group){
        var x = self.game.width * xFrac;
        var y = self.game.height * yFrac;
        var gameText = self.game.add.text(x, y, text);
        
        if (group){
            group.add(gameText);
        }
        return gameText;  
    },
    
    scaleByWidth : function(self, element, fraction){
        var HW_Ratio = element.height/element.width;
        element.width = fraction*self.game.width;
        element.height = HW_Ratio*element.width;
    },
    
    scaleByHeight : function(self, element, fraction){
        var HW_Ratio = element.height/element.width;
        element.height = fraction*self.game.height;
        element.width = element.height/HW_Ratio;
    },
    
    tween : function (self, target, tweenVars, duration, autoStart, delay, repeat, yoyo){
      return self.game.add.tween(target).to( tweenVars, duration, Phaser.Easing.Linear.None, autoStart, delay, repeat, yoyo);  
    },
    
    /* 
     * @game (PHASER GAME) - the phaser game to which the state will be added
     * @target (PHASER SPRITE) - target sprite to give UI attributes
     * @hoverAlpha (FLOAT) - alpha change on hover
     * @onDown (FUNCTION) - function to execute on mouseDown or touch
     * @onOver (FUNCTION) - [OPTIONAL] function to execute on mouse hover (DESKTOP ONLY)
     * @onOUT (FUNCTION) - [OPTIONAL] function to execute on mouse out (DESKTOP ONLY)
     * 
     * makes and element clickable and/or hoverable. Used in the create() section
    */
    makeUIElement : function (self, target, hoverAlpha, onDown, onOver, onOut){
        target.inputEnabled = true;
        target.events.onInputOver.add(function(){
            if (target.alpha === 1){
                target.alpha = hoverAlpha;
                self.game.canvas.style.cursor = "pointer";
                if (onOver){
                    onOver();
                }
            }
            
        }, self);
        
        if (onDown){
            target.events.onInputOut.add(function(){
                target.alpha = 1;
                self.game.canvas.style.cursor = "default";
                if (onOut){
                    onOut();
                }
            }, self);
                  
            target.events.onInputDown.add(onDown, self);
        }
        
    },
    
    /*
     * @game (PHASER GAME) - the phaser game to which the state will be added
     * @toolTips (ARRAY) - an array that holds all the tooltip objects
     * @text (STRING) - the text to put in the tooltip
     * @parent (PHASER SPRITE) - sprite under which the tooltip will appear
     * @offsetY (INT) - vertical offset from the parent's anchor point
     * @isMoving (BOOL) - true if the tooltip will be attached to a moving parent
     * 
     * Creates a tooltip for an icon or clickable sprite in game
     */
    addToolTip : function (self, text, parent, offsetY, isMoving){
        var x = this.getTextX(parent, 0);
        var y = Math.max(this.getTextY(parent, offsetY), 60);
        var tooltip = self.game.add.text(x, y, text);
        tooltip.anchor.setTo(0.5, 0);
        
        //STYLE
        this.setStyle(tooltip, 18, 150, 'white', 0, true);
        
        //Make Tooltip Appear and Disappear on Hover
        parent.inputEnabled = true;
        if (!self.isMobile){
            parent.events.onInputOver.add(function(){
                tooltip.x = this.getTextX(parent, parent.width/2);
                tooltip.y = this.getTextY(parent, offsetY);
                tooltip.alpha = 1;
            }, this);
            parent.events.onInputOut.add(function(){
                tooltip.alpha = 0;
            }, this);
        }
        
        //Move Tooltip With Parent And Destroy On Click
        if (isMoving){
            parent.events.onInputDown.add(function(){
    //            tooltip.destroy();
                tooltip.alpha = 0; 
            }, this);
        }
        return tooltip;
    },
    
    setStyle : function (target, fontSize, width, color, alpha, centered){
        target.fontSize = fontSize;
        if (centered){
            target.align = 'center';
        }
        target.wordWrap = true;
        target.wordWrapWidth = width;
        target.fontWeight = 'Bold';
        target.fill = color;
        target.alpha = alpha;
    },
    
    getTextX : function (parent, offsetX){
    // Get the X Position Of A Textbox
        return parent.x-parent.width/2 + offsetX;
    },
    
    getTextY : function (parent, offsetY){
    // Get the Y Position Of A Textbox
        return parent.y + offsetY;
    }
}
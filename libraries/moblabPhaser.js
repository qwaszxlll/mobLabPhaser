/*----------------------------------------------------------------------------*\
//*********************** MOBLAB PHASER GAME LIBRARY *************************\\
//************************* for desktop and mobile ***************************\\
/*----------------------------------------------------------------------------*\
 * Author: Caleb Lin
 * 
 * Requires preloading jquery (v1.7+)
 * This library was created to help streamline the building of MOBLAB games 
 * with dynamic content for desktop and mobile
\*----------------------------------------------------------------------------*/

var moblab = {
    
    /**
     * Creates a new mobile-friendly Phaser game and attaches it to the given 
     * context. 
     * @param (Context) self        game context
     * @param (Integer) padding     width of non-game DOM's in view
     * @param (String)  attachID    ID of DOM element to embed the game in for 
     *                                  web view
     */
    createDynamicGame : function (self, padding, attachID){
        
        var webHeight = 600;
        var webWidth = 904;
        
        self.isMobile = this.isMobile();
        
        //Create Game
        if (self.isMobile){
            var height = $(window).height() - padding;
            var width = $(window).width();
            self.game = new Phaser.Game(width, height, Phaser.AUTO);
        } else{
            var height = webHeight - padding;
            var width = webWidth;
            self.game = new Phaser.Game(width, height, Phaser.AUTO, attachID);
        }
        
        new Phaser.Time(self.game);

    },
    
    /** 
     * Determines whether or not the device viewing the game is mobile or not.
     * @RETURN (Boolean)    true if the device is mobile, false if it is desktop
     */
    isMobile : function (){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        }
        return false;
    },
    
    /**
     * Creates a new Phaser state and attaches it to the game context.
     * @param (Context)     self        game context
     * @param (String)      tag         Phaser reference tag
     * @param (function)    preload     Phaser extended function
     * @param (function)    create      Phaser extended function
     * @param (function)    update      Phaser extended function
     */
    addState : function(self, tag, preload, create, update){
        var preloadS = preload.bind(self);
        var createS = create.bind(self);
        if (update){
            var updateS = update.bind(self);
        }
        
        
        var newState = function(){};
        
        newState.prototype = { preload: preloadS, create: createS, update: updateS};

        self.game.state.add(tag, newState);
    },
    
    /**
     * Preloads an image into the Phaser cache
     * @param (Context) self    game context
     * @param (String)  tag     Phaser reference tag
     * @param (String)  path    full path to asset
     */
    loadImage : function (self, tag, path){
        self.game.load.image(tag, path);
    },
    
    /**
     * Preloads a spritesheet into the Phaser cache.
     * @param (Context) self        game context
     * @param (String)  tag         Phaser reference tag
     * @param (String)  path        full path to asset
     * @param (Int)     frameWidth  width of sprite frames for cutting
     * @param (Int)     frameHeight height of sprite frames for cutting
     */
    loadSpritesheet : function (self, tag, path, frameWidth, frameHeight){
        self.game.load.spritesheet(tag, path, frameWidth, frameHeight);
    },
    
    /**
     * Tells the game whether or not it should pause when running in the background
     * @param {Scope}   self                game scope
     * @param {Boolean} pauseInBackground   true if game should pause in background
     * @returns {undefined}
     */
    setPauseInBackground : function(self, pauseInBackground){
      self.game.stage.disableVisibilityChange = !pauseInBackground;  
    },
    
    addBackground : function(self, tag){
        var background = this.addDynamicSprite(self, 0, 0, tag);
        this.scaleByWidth(self, background, 1);
        return background;
    },
    
    /**
     * Adds a sprite or spritesheet to the game context.
     * @param (Context) self    game context
     * @param (Float)   x       x position 
     * @param (Float)   y       y position
     * @param (String)  tag     Phaser reference tag (usually unused)
     * @param (Group)   group   Phaser group to attach sprite to
     * @param (Int)     frame   starting frame for spritesheet
     * @return (Group)  the created Phaser.Group
     */
    addSprite : function(self, x, y, tag, group, frame){
        if (!group){
            return self.game.add.sprite(x, y, tag, frame);
        }
        return group.create(x, y, tag, frame);  
    },
    
    /**
     * Adds a dynamically sized sprite or spritesheet to the game context.
     * @param (Context) self    game context
     * @param (Int)     xFrac   x position as a fraction of game width
     * @param (Int)     yFrac   y position as a fraction of game height
     * @param (String)  tag     Phaser reference tag (usually unused)
     * @param (Group)   group   Phaser group to attach sprite to
     * @param (Int)     frame   starting frame for spritesheet
     * @return (Group)  the created Phaser.Group
     */
    addDynamicSprite : function(self, xFrac, yFrac, tag, group, frame){
        var x = self.game.width * xFrac;
        var y = self.game.height * yFrac;
        if (!group){
            return self.game.add.sprite(x, y, tag, frame);
        }
        return group.create(x, y, tag, frame);  
    },
    
    /**
     * Adds a dynamically sized text object to the game context.
     * @param (Context) self    game context
     * @param (Int)     xFrac   x position as a fraction of game width
     * @param (Int)     yFrac   y position as a fraction of game height
     * @param (String)  text    text to be displayed
     * @param (Group)   group   Phaser group to attach sprite to
     * @return (Text)   the created Phaser.Text
     */
    addDynamicText : function(self, xFrac, yFrac, text, group){
        var x = self.game.width * xFrac;
        var y = self.game.height * yFrac;
        var gameText = self.game.add.text(x, y, text);
        
        if (group){
            group.add(gameText);
        }
        return gameText;  
    },
    
    /**
     * Scales an element by its width, based on game width.
     * @param (Context) self    game context
     * @param (Object)  element object to be scaled
     * @param (Int)     frac    target width of element, as a fraction of game 
     *                              width
     */
    scaleByWidth : function(self, element, frac){
        var HW_Ratio = element.height/element.width;
        element.width = frac*self.game.width;
        element.height = HW_Ratio*element.width;
    },
    
    /**
     * Scales an element by its height, based on game height.
     * @param (Context) self    game context
     * @param (Object)  element object to be scaled
     * @param (Int)     frac    target height of element, as a fraction of game 
     *                              height
     */
    scaleByHeight : function(self, element, frac){
        var HW_Ratio = element.height/element.width;
        element.height = frac*self.game.height;
        element.width = element.height/HW_Ratio;
    },
    
    /*
     * Animates an element by changing its css. 
     * @param (Context) self        game context
     * @param (Object)  target      object to animate
     * @param (Object)  tweenVars   Target Style object with end values
     * @param (Int)     duration    duration of animation, in ms
     * @param (Bool)    autoStart   true if animation should start automatically
     * @param (Int)     delay       time in ms to wait before playing animation
     * @param (Int)     repeat      number of times to repeat the animation
     * @param (Bool)    yoyo        true if animation should reverse
     */
    tween : function (self, target, tweenVars, duration, autoStart, delay, repeat, yoyo){
        return self.game.add.tween(target).to( tweenVars, duration, Phaser.Easing.Linear.None, autoStart, delay, repeat, yoyo);  
    },
    
    /*
     * Overloaded version of tween with fewer variables
     */
    tween : function (self, target, tweenVars, duration, delay){
        return self.game.add.tween(target).to( tweenVars, duration, Phaser.Easing.Linear.None, true, delay, 0, false);  
    },
    
    /**
     * Creates a UI element that changes alpha on hover and responds to input events.
     * @param (Context)     self        game context
     * @param (Object)      target      object to be made interactive
     * @param (float)       hoverAlpha  target alpha on hover (from 0 to 1)
     * @param (function)    onDown      function to execute on inputDown
     * @param (function)    onOver      function to execute on inputOver
     * @param (function)    onOut       function to execute on InputOut
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
        
        
        target.events.onInputOut.add(function(){
            target.alpha = 1;
            self.game.canvas.style.cursor = "default";
            if (onOut){
                onOut();
            }
        }, self);
        
        if (onDown){          
            target.events.onInputDown.add(onDown, self);
        }
        
    },
    
    /**
     * Adds a centered tooltip that appears on hover (web) or on toggle (mobile).
     * @param (Context) self        game context
     * @param (String)  text        tooltip text
     * @param (Object)  parent      object to attach the tooltip to
     * @param (Int)     offsetY     vertical offset from parent
     * @param (Bool)    isMoving    true if the parent moves
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
    
    /**
     * Sets css style for text objects. 
     * @param (Object)  target      text to style
     * @param (Int)     fontSize
     * @param (Int)     width
     * @param (String)  color       hex or color name
     * @param (Float)   alpha       alpha of text
     * @param (Bool)    centered    true if text is centered
     */
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
    },
    
        /**
     * Builds the game menu bar at the bottom of the game view, by injecting 
     * HTML into the document. This function should be called as early as possibly, preferably right after creating the Phaser game. 
     * @param (Scope)   self        game scope
     * @param (String)  attachID    ID of the game container
     * @param (Int)     height      height of the menu bar (including border)
     * @param (String)  fillColor   the hex code for the desired fill color
     * @param (String)  borderColor the hex code for the desired border color
     */
    buildMenuBar : function(self, attachID, height, fillColor, borderColor){
        var gameBox;
        if (typeof attachID == 'string'){
            gameBox = $('#'+attachID);
        } else{
            gameBox = attachID;
        }
        gameBox.append("<div id='menuBar'></div>");
        $('#menuBar').css({
            'height': (height-5) + 'px',
            'background': fillColor,
            'border-top': 'solid 5px ' + borderColor,
        })
        
        // MENU BUTTONS
        $('#menuBar').append("<div id='gameBtn' class='buttonContainer'><img src='../../img/game_icon.png' class='menuButton'></div>");
        $('#menuBar').append("<div id='rulesBtn' class='buttonContainer'><img src='../../img/history_icon.png' class='menuButton'></div>");
        $('#menuBar').append("<div id='historyBtn' class='buttonContainer'><img src='../../img/rules_icon.png' class='menuButton'></div>");
        $('.menuButton').css({
            'height': height - 21,
        });
        
        //Menu Button Functionality
        self.swapPage = this.swapPage.bind(this, self);
        $('#gameBtn').click(this, function(){
            self.swapPage('game');
        });
        $('#rulesBtn').click(this, function(){
            self.swapPage('rules');
        });
        $('#historyBtn').click(this, function(){
            self.swapPage('history');
        });
        
        //MENU TEXT
        $("#menuBar").append("<div id='roundText' class='menuText'></div>");
        $('#menuBar').append("<div id='timer' class='menuText'></div>");
        
        //MENU PAGES
        gameBox.append("<div id='rules' class='popup'></div>");
        gameBox.append("<div id='history' class='popup'></div>");
        $('.popup').css({
            height: self.game.height-height+'px',
            'margin-top': $('#phaserGame').height()-50,
            height:0,
            width:0
        });
        $('#rules').css({
            'display': 'none',
            'left': 50
        });
        $('#history').css({
            'display': 'none',
            'left': 100
        });
        $('.popup').click(function(){
            self.swapPage('game');
        })
    },
    
    /**
     * Updates the time and round indicators on the menu bar at the bottom of 
     * the game during Phaser's update section. (NOTE: may need to be inserted 
     * in the update section of each Phaser state with this implementation).
     * @param (context) self        game scope
     * @param (int)     maxMinutes  max game duration in minutes
     */ 
    updateMenuBar : function(self, maxMinutes){
        $('#roundText').text(self.round + '/5');
        var timeElapsed = Math.round((self.game.time.time-self.startTime)/1000);
        var timeLeft = maxMinutes*60-timeElapsed;
        var seconds = timeLeft % 60;
        if (seconds < 10){
            seconds = '0' + seconds;
        }
        var minutes = Math.floor(timeLeft/60);
        if (minutes < 10){
            minutes = '0' + minutes;
        }
        $('#timer').text(minutes + ':' + seconds);
    },
    
    /**
     * Sets up variables necessary for the menu control.
     * @param (Scope) self  game scope
     */ 
    preloadSetup : function(self){
        self.currentPage = '#game';
        $('#gameBtn').css('background', 'rgba(0,0,0,0.5)');
        self.game.canvas.id = 'game';
    },
    
    /**
     * Manages window animations when swapping between menu page tabs. Only the 
     * rules and history pages minimize. 
     * @param (Scope)   self    game scope
     * @param (String)  page    name of target page (as 'game' or 'rules' etc.)
     */ 
    swapPage : function(self, page){
        if (self.currentPage != ('#'+page)){
            var fromPage = self.currentPage;
            var toPage = '#' + page;
            var fromButton = fromPage + 'Btn';
            var toButton = '#' + page + 'Btn';
            self.currentPage = toPage;
            
            //unhighlight old tab, highlight current tab
            $(fromButton).css('background', '');
            $(toButton).css('background', 'rgba(0,0,0,0.5)');
            
            var buffer = 0;
            if (fromPage == '#rules'){
                buffer = 75;
            } else if(fromPage == '#history'){
                buffer = 125;
            }
            
            //Shrink old page into tab if it's not the game page
            if (fromPage != '#game'){
                $(fromPage).animate({
                    'margin-top': $('#phaserGame').height()-50,
                    height: 0,
                    width:50,
                    left: buffer
                }, 250, function() {
                    $(fromPage).hide();
                });
            }
            
            //Open new page if it's not the game page
            if (toPage != '#game'){
                $(toPage).show();
                $(toPage).animate({
                    'margin-top': 0,
                    height: $('#phaserGame').height()-50,
                    width:$('#phaserGame').width(),
                    left:0
                }, 500, function() {
                    
                });
            }   
                
        }
    }
}
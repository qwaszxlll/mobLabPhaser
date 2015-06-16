/*----------------------------------------------------------------------------*\
//*************************** MOBLAB GAME LIBRARY ****************************\\
//************************* for desktop and mobile ***************************\\
/*----------------------------------------------------------------------------*\
 * Requires preloading jquery (v1.7+)
 * This library was created to help streamline the building of MOBLAB games 
 * with dynamic content for desktop and mobile
\*----------------------------------------------------------------------------*/

var cometd = $.cometd;
var cometURL = "https:" + "//" + "test.moblab.com" + "/server/cometd";
cometd.configure({
    url : cometURL,
    logLevel : 'info',
    maxNetworkDelay: 10000,
    autoBatch: false
});
cometd.websocketEnabled = true;
cometd.ackEnabled = false;
/*
 * List of all parameters and functions built into gameController
 * 
 * @String      id              Game ID
 * @String      name            Game Nametag
 * @String      desc            ???
 * @Object      player          ???
 * @Int         startTime       current time in ms
 * @Int         currentRound    round number, 0 indexed
 * @Boolean     allowChat       allow chat if true
 * @Int         timeLeft        remaining time in round (if timed) in ms
 * @Int         groupSize       number of players in game
 * @Int         timerDur        elapsed time in ms
 * @Boolean     showTimer       show timer if true
 * @Boolean     isRunning       ??what is this for
 * @Boolean     isDemo          ??what is this for
 * @function    processGameStart(update)    initialize parameters according to 
 *                                              update message. 
 * @function    processGameStop()           pause game and timer
 * @function    processGameEnd(update)      pause game and update this.payoffs
 *                                              and this.earning from update
 * @function    processGameUpdate(update)   update the game state from update
 * @function    processPlayerUpdate(update) update chat messages from update
 * @function    processGameNotice(update)   ??
 * @function    processRoundEnd(update)     ??
 * @function    handleEvent(gameEvent)      game event listener with switch 
 *                                              block that calls the proper  
 *                                              event handler for each event
 * @function    receivePlayerMessage(msg)   passes a message from the server to
 *                                              the client's view
 * @function    updateGamestate(update)     updates the game state variables 
 *                                              based on a server update msg
 * @function    startTimer()                (re)set this.timerDur
 * @function    stopTimer()                 destroy this.timer
 * @function    clearTimer()                destroy this.timer and set 
 *                                              this.timeLeft = 0
 * @function    sendMove(move)              pass a move to the server
 * @function    sendPlayerMessage(chat)     pass a chat message to the server
 * @function    onGameStart(update)         process event on view and controller
 * @function    onGameStop()                process event on view and controller
 * @function    onGameUpdate(update)        process event on view and controller
 * @function    onPlayerUpdate(update)      process event on view and controller
 * @function    onPlayerMove(gameUpdate)    process event on view and controller
 * @function    onGameNotice(update)        process event on view and controller
 * @function    onGameEnd(update)           process event on view and controller
 * @function    onRoundEnd(update)          process event on view and controller
 * @function    onSessionEnd(update)        process event on view and controller
 * 
 */
var gameController = {
    id: "", //game id
    name: 'Game',
    desc: "",
    player: null,
    move: null,
    startTime: new Date().getTime(),
    currentRound: 0,
    allowChat: false,
    timeLeft: 0,
    groupSize: 0,
    timerDur: 1000,
    showTimer: true,
    isRunning: false,
    isDemo: false,
    init: function(view) {
        this.view = view;
    },
    processGameStart: function(update) {
        var params = update.data;
        for(var paramKey in params) {
            this[paramKey] = params[paramKey];
            console.log(paramKey);
        }
        console.log("Game start processing start...", update);
        this.player = update.player;
        this.allowChat = params.allow_chat;
        this.groupSize = params.group_size;
        this.startTime = params.start_time;
        this.showTimer = params.show_timer;
        this.isRunning = true;
        this.gameType = update.type;
        this.sessionInfo = {};
        this.updateGameState(params);
        console.log("Game finish processing start...");
    },
    processGameStop: function() {
        this.isRunning = false;
        this.clearTimer();
    },
    processGameEnd: function(update) {
        var playerNum = this.player.playerNumber;
        this.isRunning = false;
        this.clearTimer();
        this.payoffs = update.payoffs;
        this.earning = update.payoffs[playerNum];
    },
    processGameUpdate: function(update) {
        this.updateGameState(update);
    },
    processPlayerUpdate: function(update) {
        //Messages is mainly used for chat which we will have to re-implement
        this.messages = update.messages; 
    },
    processGameNotice: function(update) {
        
    },
    processRoundEnd: function(update) {
        
    },
    handleEvent: function(gameEvent) {
        if(gameEvent.gameId !== this.id) {
            return false;
        }

        if (!gameEvent.event) {
            return false;
        }
        console.log("GAME EVENT ["+gameEvent.event+"]", gameEvent);
        switch (gameEvent.event) {
            case 'GAME_STARTED':
                this.onGameStart(gameEvent);
                break;
            case 'PLAYER_MOVE':
                this.onPlayerMove(gameEvent);
                break;
            case 'PLAYER_UPDATED':
                this.onPlayerUpdate(gameEvent.data);
                break;
            case 'GAME_UPDATED':
                this.onGameUpdate(gameEvent.data);
                break;
            case 'GAME_ENDED':
                this.onGameEnd(gameEvent.data);
                break;
            case 'GAME_NOTICE':
                this.onGameNotice(gameEvent.data);
                break;
            case 'GAME_ROUND_ENDED':
                this.onRoundEnd(gameEvent.data);
                break;
            case 'PLAYER_REMOVED':
                //TODO
                break;
            case 'GAME_STOPPED':
                this.onGameStop();
                break;
            case 'PLAYER_MESSAGE':
                this.receivePlayerMessage(gameEvent.data.message);
                break;
            case 'SESSION_ENDED':
                this.onSessionEnd(gameEvent);
                break;
        }
    },
    receivePlayerMessage: function(msg) {
        this.view.onPlayerMessage(msg);
    },
    updateGameState: function(update) {
        console.log("UPDATE GAME STATE: ", update);
        if (update.round && this.currentRound !== update.round) {
            this.currentRound = update.round;
        }
        if (update.time_left) {
            this.timeLeft = update.time_left;
            if (this.isRunning) {
                this.startTimer();
            }
        }
        if (update.desc) {
            this.desc = update.desc;
        }
    },
    
    startTimer: function() {
        var _self = this;
        if (_self.timer) {
            clearInterval(_self.timer);
        }
        _self.timer = setInterval(function() {
            if (_self.timeLeft < 1000) {
                _self.clearTimer();
                return;
            }
            _self.set("timeLeft", _self.timeLeft - 1000);
            _self.processTimerUpdate();
            _self.emit("timerupdate", {});
        }, _self.timerDur);
    },

    stopTimer: function() {
        clearInterval(this.timer);
        this.timer = null;
    },

    clearTimer: function() {
        clearInterval(this.timer);
        this.timer = null;
        this.timeLeft = 0;
    },

    sendMove: function(/*Object*/move) {
        if (this.isDemo) {
            topic.publish("/demo/game/" + this.id, move);
        } else {
            var request = {
                action: "game",
                game: this.id,
                move: move
            };
            PubSub.publish("/gameservice/request", request);
        } 
   },

    sendPlayerMessage: function(chat) {
        if (!this.isDemo) {
            var request = {
                action: "game",
                game: this.id,
                move: chat
            };
            PubSub.publish("/gameservice/request", request);
        }
    },
    
    onGameStart: function(update) {
        this.processGameStart(update);
        this.view.onStart({});
    },

    onGameStop: function() {
        this.processGameStop();
        this.view.onStop({});
    },

    onGameUpdate: function(update) {
        this.processGameUpdate(update);
        this.view.onGameUpdate({});
    },

    onPlayerUpdate: function(update) {
        this.processPlayerUpdate(update);
        this.view.onPlayerUpdate({});
    },

    onPlayerMove: function(gameUpdate) {
        this.processPlayerMove(gameUpdate);
        this.view.onPlayerMove({
            action: gameUpdate.action,
            data: gameUpdate.data
        });
    },

    onGameNotice: function(update) {
        this.processGameNotice(update);
        this.view.onPlayerNotice({
            code: update.code,
            message: update.message
        });
    },

    onGameEnd: function(update) {
        this.processGameEnd(update);
        this.view.onGameEnd({});
    },

    onRoundEnd: function(update) {
        this.processRoundEnd(update);
        this.view.onRoundEnd({});
    },

    onSessionEnd: function(update) {
        this.view.onSessionEnd({
            info: update
        });
    }
};

/*
 * List of all parameters and functions built into gameView
 * 
 * @Object      _controller     controller for this view
 * @Array       _eventHandlers  ??
 * @Boolean     isClosed        ??
 * @Boolean     gameInfoBar     ??
 * @function    init(controller)            link controller
 * @function    initGameUI()                build chat UI
 * @function    initGameInfobar()           build game info bar
 * @function    onStart()                   establish context and initiate 
 *                                              global UI
 * @function    onGameEnd()                 disable action
 * @function    onStop()                    pause and show message
 * @function    onGameUpdate()              extend
 * @function    onNotice(notice)            extend
 * @function    onPlayerUpdate()            update and show chat messages from 
 *                                              server
 * @function    onPlayerMove(move)          extend
 * @function    onTimerUpdate()             extend
 * @function    onPlayerMessage(msg)        display new chat message
 * @function    onSessionEnd(sessionInfo)   display end session UI
 * @function    onRoundEnd()                extend
 * @function    enableAction()              extend
 * @function    disableAction()             extend
 * @function    displayTime()               show time in infoBar
 * @function    showMessageDialog(msg)      stub
 * @function    closeMessageDialog()        stub
 * @function    showChatDialog()            stub
 * @function    showRankingDialog()         stub
 * @function    hideChatDialog()            stub
 * @function    closeChatDialog()           stub
 * @function    closeEndGameDialog()        stub
 * @function    closeEndSessionDialog()     stub
 * @function    closeStackedDialog()        close all dialogs
 * @function    removeEventHandlers()       remove all event handlers from 
 *                                              this._eventHandlers
 *                                              
 */
var gameView = {
    _controller: null,
    _eventHandlers: null,
    isClosed: false,
    gameInfoBar: false,
    init: function(controller) {
        this._controller = controller;
    },
    initGameUI: function () {
        console.log("start GameWidget initUI...");
        var ctrl = this._controller;

        this.gameInfoBar = false;
        /*
        if (this.chatBtn) {
            if (!this._controller.allowChat) {
                domStyle.set(this.chatBtn, 'display', 'none');
            } else {
                on(this.chatBtn, "click", lang.hitch(this, this.showChatDialog));
            }
        }

        this.watch('endGameDlg', function (name, oldValue, newValue) {
            if (newValue) { _endGameDialogs.push(newValue); }
        });

        this.watch('endSessionDlg', function(name, oldValue, newValue) {
            if(newValue) { _endSessionDialogs.push(newValue); }
        });*/
        console.log("finish GameWidget init UI...");
    },

    initGameInfoBar: function() {
        var ctrl = this._controller;
        
        /*Game Info Bar (bottom  bar) stuff that we have to configure
        this.gameInfoBar = new GameInfoBar({
            gameType: this._controller.gameType,
            showTimer: this._controller.showTimer,
            allowChat: this._controller.allowChat,
            timeLeft: this._controller.timeLeft,
            enableBack: false,
            showRanking: false
        }, this.gameInfoDiv);
        this.gameInfoBar.startup();
        */

        //on(this.gameInfoBar.chatBtn, "click", lang.hitch(this, this.showChatDialog));
        //on(this.gameInfoBar.rankingBtn, "click", lang.hitch(this, this.showRankingDialog));
        
        /* More Game Info Bar stuff
        if (ctrl.timeLeft < 0 || !ctrl.showTimer) {
            this.gameInfoBar.set("showTimer", false);
        } else {
            this.gameInfoBar.set("showTimer", true);
        }
        */
    },

    onStart: function () {
        console.log("GameWidget onStart...");
        this.closeStackedDialog();

        this.initGameUI();
        var _self = this;
        // this._controller.watch("timeLeft", function () {
        //     _self.displayTime();
        // });
        console.log("finish GameWidget onStart...");
    },

    onGameEnd: function () {
        this.disableAction();
    },

    onStop: function () {
        this.disableAction();
        this.showMessageDialog({
            type: "alert",
            title: "Game Stopped",
            message: "This game stopped by instructor, please wait for next game start."
        });

        this.gameInfoBar.set("enablePages", false);
    },

    onGameUpdate: function () {},
    onNotice: function (notice) {},
    onPlayerUpdate: function () {
        var ctrl = this._controller;
        var messages = ctrl.messages;
        if(messages) {
            /* Chat stuff that we took out
            if (!_chatDialog) {
                _chatDialog = this.createChatDialog();
            }
            domConstruct.empty(_chatDialog.msgPanel);
            */
            for(var i = 0; i < messages.length; i++) {
                this.displayPlayerMessage(messages[i]);
            }
        }
    },
    onPlayerMove: function (move) {},
    onTimerUpdate: function () {},

    onPlayerMessage: function (msg) {
        this.displayPlayerMessage(msg);
    },
    onSessionEnd: function(sessionInfo) {
        this.createEndSessionDlg(sessionInfo.info);
        this.gameInfoBar.set("showRanking", true);
    },
    onRoundEnd: function() {},

    createEndSessionDlg: function(sessionInfo) {
        var self = this;
        /* End of Session Dialog that we need to recreate
        console.log("SESSION INFO: ", sessionInfo);
        var top_ranked = sessionInfo["top_ranked"];
        var player = sessionInfo["player"];
        var result = {};
        result["top_ranked"] = top_ranked;
        this.set('endSessionDlg', new EndSessionDialog({
            top_ranked: top_ranked,
            player: player,
            role: self._controller.role
        }));
        */
    },

    enableAction: function () {},

    disableAction: function () {
        var ctrl = this._controller;
        /* Chat stuff that we're temporarily taking out
        if (ctrl.allowChat && _chatDialog) {
            _chatDialog.disableSend();
        }
        */
    },

    displayTime: function () {
        var controller = this._controller;
        var timeStr = this.formatTime(controller.timeLeft);

        if(this.gameInfoBar) {
            this.gameInfoBar.set("timeLeft", controller.timeLeft);
        } else {
            if (this.timeLabel) {
                //Set Time here
                //html.set(this.timeLabel, timeStr);
            }
        }
        /*if (_chatDialog) {
            html.set(_chatDialog.chatTimeLabel, timeStr);
        }*/
    },

    //A bunch of chat stuff below that we'll have to figure out
    showMessageDialog: function (msg) {
        //_msgDialogs.push(MsgBox.show(msg));
    },

    closeMessageDialog: function () {
        /*while (_msgDialogs.length > 0) {
            var dlg = _msgDialogs.pop();
            dlg.destroyRecursive();
        }*/
    },

    showChatDialog: function () {
        /*var ctrl = this._controller;
        if (!_chatDialog) {
            _chatDialog = this.createChatDialog();
        }
        if (!ctrl.isRunning) {
            _chatDialog.disableSend();
        }
        _chatDialog.show();*/
    },

    showRankingDialog: function() {
        this.endSessionDlg.show();
    },

    hideChatDialog: function () {
        this.chatDialog.hide();
    },

    closeChatDialog: function () {
        /*if (_chatDialog) {
            _chatDialog.destroyRecursive();
            _chatDialog = null;
        }*/
    },

    closeEndGameDialog: function () {
        /*while (_endGameDialogs.length > 0) {
            var dlg = _endGameDialogs.pop();
            dlg.destroyRecursive();
        }*/
    },

    closeEndSessionDialog: function() {
        /*while(_endSessionDialogs.length > 0) {
            var dlg = _endSessionDialogs.pop();
            dlg.destroyRecursive();
        }*/
    },

    closeStackedDialog: function () {
        this.closeMessageDialog();
        this.closeChatDialog();
        this.closeEndGameDialog();
        this.closeEndSessionDialog();
    },

    /*createChatDialog: function () {
        var controller = this._controller;
        var playerNumber = controller.player.playerNumber;
        var chatDlg = new ChatDlg({
            playerNumber: playerNumber,
            groupSize: controller.group_size
        });

        var _self = this;
        on(chatDlg, 'send', function (message) {
            controller.sendPlayerMessage(message);
        });
        on(chatDlg, 'unread', function (unreads) {
            if (unreads > 0 && unreads <= 99) {
                html.set(_self.gameInfoBar.chatBtn, String(_chatDialog.unreadCount));
            }else if (unreads > 99) {
                html.set(_self.gameInfoBar.chatBtn, '99+');
            }else {
                html.set(_self.gameInfoBar.chatBtn, '&nbsp;');
            }
        });
        domConstruct.place(chatDlg.domNode, this.domNode, 'last');
        return chatDlg;
    },

    displayPlayerMessage: function (msg) {
        if (!_chatDialog) {
            _chatDialog = this.createChatDialog();
        }
        _chatDialog.displayMessage(msg);
    },*/

    removeEventHandlers: function () {
        var eventHandlers = this._eventHandlers;
        while (eventHandlers.length > 0) {
            var handler = eventHandlers.pop();
            handler.remove();
        }
    },
    
    fix2Number: function(num) {
        return num >= 10 ? num : "0" + num;
    },
    
    formatTime: function(time) {
        var second = parseInt(time / 1000 % 60, 10);
        var minute = parseInt(time / 1000 / 60 % 60, 10);
        var hour = parseInt(time / 1000 / 3600 % 24, 10);
        second = this.fix2Number(second);
        minute = this.fix2Number(minute);
        hour = this.fix2Number(hour);
        return minute + ":" + second;
    }
};
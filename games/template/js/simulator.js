if (this.isMobile){
    $('#phaserGame').css('display', 'none');
} else{
    $('#mobileMenu').css('display', 'none');
}

gameView.init(gameController);
gameView.onStart();
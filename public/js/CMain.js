function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);       
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", this._update);
		
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
    
    this.preloaderReady = function(){
        this._loadImages();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        _bUpdate = true;
    };

    this.soundLoaded = function(){
         _iCurResource++;
         var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'win',loop:true,volume:1, ingamename: 'win'});
        aSoundsInfo.push({path: './sounds/',filename:'press_but',loop:false,volume:1, ingamename: 'press_but'});
        aSoundsInfo.push({path: './sounds/',filename:'reel_stop',loop:false,volume:1, ingamename: 'reel_stop'});
        aSoundsInfo.push({path: './sounds/',filename:'reels',loop:false,volume:1, ingamename: 'reels'});
        aSoundsInfo.push({path: './sounds/',filename:'choose_chicken',loop:false,volume:1, ingamename: 'choose_chicken'});
        aSoundsInfo.push({path: './sounds/',filename:'start_reel',loop:false,volume:1, ingamename: 'start_reel'});
        aSoundsInfo.push({path: './sounds/',filename:'press_hold',loop:false,volume:1, ingamename: 'press_hold'});
        aSoundsInfo.push({path: './sounds/',filename:'reveal_egg',loop:false,volume:1, ingamename: 'reveal_egg'});
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack_bonus',loop:true,volume:1, ingamename: 'soundtrack_bonus'});
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded
                                                        });
        }
        
    };  

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_approve","./sprites/but_approve.png");
        s_oSpriteLibrary.addSprite("but_deposit","./sprites/but_deposit.png");
        s_oSpriteLibrary.addSprite("but_withdraw","./sprites/but_withdraw.png");
        s_oSpriteLibrary.addSprite("but_freespin","./sprites/but_freespin.png");

        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("paytable","./sprites/paytable.jpg");
		//TEST BELOW add credit
		s_oSpriteLibrary.addSprite("addcredit","./sprites/addcredit_bg.jpg");
		s_oSpriteLibrary.addSprite("add_but","./sprites/but_add_bg.png");
        s_oSpriteLibrary.addSprite("but_play_bg","./sprites/but_play_bg.png");
        s_oSpriteLibrary.addSprite("mask_slot","./sprites/mask_slot.png");
        s_oSpriteLibrary.addSprite("spin_but","./sprites/but_spin_bg.png");
        s_oSpriteLibrary.addSprite("coin_but","./sprites/but_coin_bg.png");
        s_oSpriteLibrary.addSprite("info_but","./sprites/but_info_bg.png");
        s_oSpriteLibrary.addSprite("bet_but","./sprites/bet_but.png");
        s_oSpriteLibrary.addSprite("win_frame_anim","./sprites/win_frame_anim.png");
        s_oSpriteLibrary.addSprite("but_lines_bg","./sprites/but_lines_bg.png");
        s_oSpriteLibrary.addSprite("but_maxbet_bg","./sprites/but_maxbet_bg.png");
        s_oSpriteLibrary.addSprite("but_bet_inc_bg","./sprites/but_bet_inc.png");
        s_oSpriteLibrary.addSprite("but_bet_dec_bg","./sprites/but_bet_dec.png");
        s_oSpriteLibrary.addSprite("but_bet_inc_green_bg","./sprites/but_bet_inc_green.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("hit_area_col","./sprites/hit_area_col.png");
        s_oSpriteLibrary.addSprite("hold_col","./sprites/hold_col.png");
        s_oSpriteLibrary.addSprite("bonus_bg","./sprites/bonus_bg.jpg");
        s_oSpriteLibrary.addSprite("chicken","./sprites/chicken.png");
        s_oSpriteLibrary.addSprite("hit_area_chicken","./sprites/hit_area_chicken.png");
        s_oSpriteLibrary.addSprite("egg","./sprites/egg.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("logo_ctl","./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");

        s_oSpriteLibrary.addSprite("sunflower_1","./sprites/sunflower_1.png");
        s_oSpriteLibrary.addSprite("sunflower_2","./sprites/sunflower_2.png");
        s_oSpriteLibrary.addSprite("sunflower_3","./sprites/sunflower_3.png");
        s_oSpriteLibrary.addSprite("sunflower_4","./sprites/sunflower_4.png");
        s_oSpriteLibrary.addSprite("sunflower_5","./sprites/sunflower_5.png");
        
        for(var i=1;i<NUM_SYMBOLS+1;i++){
            s_oSpriteLibrary.addSprite("symbol_"+i,"./sprites/symbol_"+i+".png");
            s_oSpriteLibrary.addSprite("symbol_"+i+"_anim","./sprites/symbol_"+i+"_anim.png");
        }
        
        for(var j=1;j<NUM_PAYLINES+1;j++){
            s_oSpriteLibrary.addSprite("payline_"+j,"./sprites/payline_"+j+".png");
        }

        //!!2021.6.2
        // for(var k=1;k<2+1;k++){
        //     s_oSpriteLibrary.addSprite("xbig_anim_"+k,"./sprites/xbig_anim_"+k+".png");
        //     //s_oSpriteLibrary.addSprite("xbig_anim_"+k,"./sprites/xbig_anim_"+k+".gif");
        // }

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();

        s_oSoundTrack = playSound("soundtrack",1,true);

        this.gotoMenu();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        // G_FREE_MODE
        console.log("!!! CMain.js :: gotoGame");
        console.log(_oData);
        // _oData.money = 100;
        _oGame = new CGame(_oData);   
							
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    _oData = oData;
    
    PAYTABLE_VALUES = new Array();
    for(var i=0;i<8;i++){
        PAYTABLE_VALUES[i] = oData["paytable_symbol_"+(i+1)];
    }
    ENABLE_FULLSCREEN = _oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = _oData.check_orientation;
    SHOW_CREDITS = _oData.show_credits;
    
    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
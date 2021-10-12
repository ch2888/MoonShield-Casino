function CInterface(iCurBet,iTotBet,iMoney){
    
    var _aBigWinAnim;//!!B
    // var _aLinesBut;
    var _aPayline;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _oBtnApprove;
    var _oBtnDeposit;
    var _oBtnWithdraw;
    var _oButExit;
    var _oSpinBut;
    var _oAutoSpinBut;
    var _oInfoBut;
    var _oAddLineBut;
    var _oAudioToggle;
    var _oBetCoinBut;
    var _oMaxBetBut;
    var _oButBetInc;//!!2021.6.3
    var _oButBetDec;//!!2021.6.3
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _autoSpin = false;
    var _autoSpinInterval;

    var _oCoinText;
    var _oMoneyText;
    var _oTotalBetText;
    var _oNumLinesText;
    var _oStatusText;//!!2021.6.2

    var bFreeMode = true;
    var _oBtnConnect;
    /*
    var web3Provider = null;
    //var web3 = null;    // should be disabled 
    var contracts = {};
    var contract_v2 = {};
    var balance = 0;
    var account = null;
    var instance = null;
    var machine1 = null;
    var machine2 = null;
    var machine3 = null;
    var started = 0;
    var roll1 = 1;
    var roll2 = -1;
    var roll3 = -1;
    var rolled = false;
    */
    this._init = function(iCurBet,iTotBet,iMoney){
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) - 10,y:(oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSpriteAudio = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _oButExit.getX() - oSpriteAudio.width/2, y: (oSprite.height/2) + 10};  
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSpriteAudio,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSpriteAudio.width/2,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x: _oButExit.getX() - oSprite.width, y: (oSprite.height/2) + 10};  
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        oSprite = s_oSpriteLibrary.getSprite('spin_but');
        _oSpinBut = new CTextButton( 1130 /*1190*/  + (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#ffde00",22,s_oStage);  
        _oSpinBut.addEventListener(ON_MOUSE_UP, this._onSpin, this);

        oSprite = s_oSpriteLibrary.getSprite('but_freespin');
        _oAutoSpinBut = new CTextButton(/*990*/180 + (oSprite.width),CANVAS_HEIGHT/2 /*_oButExit.getY()+ oSprite.height/2+30*/,oSprite,"\n"+"5 GEN",FONT_GAME,"#ffffff",15,s_oStage);//TEXT_AUTO_SPIN
        // _oAutoSpinBut.addEventListener(ON_MOUSE_UP, this._onAutoSpin, this);
        _oAutoSpinBut.addEventListener(ON_MOUSE_UP, this._onFreeSpin, this);
        
        
        oSprite = s_oSpriteLibrary.getSprite('info_but');
        _oInfoBut = new CTextButton(328 + (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#ffffff",30,s_oStage);//TEXT_INFO
        _oInfoBut.addEventListener(ON_MOUSE_UP, this._onInfo, this);
        
		// TEST BELOW add credit position x and y
		oSprite = s_oSpriteLibrary.getSprite('add_but');

        var nXOfAddFundBtn = 735;
        if(G_FREE_MODE==true)
        {
            nXOfAddFundBtn = nXOfAddFundBtn * -1;// hidden the button
        }
        _oAddBut = new CTextButton(nXOfAddFundBtn + (oSprite.width/2),60/*CANVAS_HEIGHT - (oSprite.height/2)- 545*/,oSprite,"",FONT_GAME,"#ffffff",30,s_oStage);        
        _oAddBut.addEventListener(ON_MOUSE_UP, this._onAddCredit, this);
        
        
        //!!2021.6.3 Lines Button hide.
        oSprite = s_oSpriteLibrary.getSprite('but_lines_bg');
        _oAddLineBut = new CTextButton(494+10000  /*   hide button*/ + (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#ffffff",30,s_oStage);//TEXT_LINES
        _oAddLineBut.addEventListener(ON_MOUSE_UP, this._onAddLine, this);
        
        //!!2021.6.3 Coin Button hide.
        oSprite = s_oSpriteLibrary.getSprite('coin_but');
        _oBetCoinBut = new CTextButton(680+10000/*hide button*/  + (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#ffffff",30,s_oStage);//TEXT_COIN
        _oBetCoinBut.addEventListener(ON_MOUSE_UP, this._onBet, this);
        
        //!!2021.6.3 MaxBetButton hide.
        oSprite = s_oSpriteLibrary.getSprite('but_maxbet_bg');
        _oMaxBetBut = new CTextButton(866+10000/*hide button*/ + (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#ffffff",30,s_oStage);//"" ->TEXT_MAX_BET
        _oMaxBetBut.addEventListener(ON_MOUSE_UP, this._onMaxBet, this);

        oSprite = s_oSpriteLibrary.getSprite('but_bet_inc_bg');
        _oButBetInc = new CTextButton(_oSpinBut.getX() + 50 + (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#000000",40,s_oStage);//"" ->TEXT_MAX_BET
        _oButBetInc.addEventListener(ON_MOUSE_UP, this._onBetInc, this);

        oSprite = s_oSpriteLibrary.getSprite('but_bet_dec_bg');
        _oButBetDec = new CTextButton(_oSpinBut.getX() - 50  - (oSprite.width/2),CANVAS_HEIGHT - (oSprite.height/2),oSprite,"",FONT_GAME,"#000000",40,s_oStage);//"" ->TEXT_MAX_BET
        _oButBetDec.addEventListener(ON_MOUSE_UP, this._onBetDec, this);

        
         
        
        var nHeightOfPays = 100;
        // oSprite = s_oSpriteLibrary.getSprite('but_withdraw');
        // _oBtnApprove =  new CTextButton(394 + (oSprite.width/2),nHeightOfPays,oSprite,TEXT_APPROVE,FONT_GAME,"#ffffff",20,s_oStage);
        // // _oBtnApprove =  new CGfxButton(394 + (oSprite.width/2),(oSprite.height),oSprite,true);
        // _oBtnApprove.addEventListener(ON_MOUSE_UP, this._onApprove, this);

        // oSprite = s_oSpriteLibrary.getSprite('but_withdraw');//but_deposit
        // //_oBtnDeposit =  new CGfxButton(580 + (oSprite.width/2),(oSprite.height),oSprite,true);;
        // _oBtnDeposit =  new CTextButton(580 + (oSprite.width/2),nHeightOfPays,oSprite,"Deposit 100",FONT_GAME,"#ffffff",15,s_oStage);
        // _oBtnDeposit.addEventListener(ON_MOUSE_UP, this._onDeposit, this);

        // oSprite = s_oSpriteLibrary.getSprite('but_withdraw');//but_withdraw
        // //_oBtnWithdraw =  new CGfxButton(766 + (oSprite.width/2),(oSprite.height),oSprite,true);
        // _oBtnWithdraw =  new CTextButton(766 + (oSprite.width/2),nHeightOfPays,oSprite,"WithdrawAll",FONT_GAME,"#ffffff",15,s_oStage);
        // _oBtnWithdraw.addEventListener(ON_MOUSE_UP, this._onWithdraw, this);
		
        // oSprite = s_oSpriteLibrary.getSprite('but_withdraw');//but_deposit
        // var txtModeBtn = "Free Mode";
        // if(bFreeMode == false)
        // {
        //     txtModeBtn = "Paid Mode";
        // }
        // _oBtnMode =  new CTextButton(530 + (oSprite.width/2),nHeightOfPays-40,oSprite,txtModeBtn,FONT_GAME,"#ffffff",15,s_oStage);
        // _oBtnMode.addEventListener(ON_MOUSE_UP, this._onChangeGameMode, this);

        oSprite = s_oSpriteLibrary.getSprite('but_withdraw');//but_deposit
        var txtModeBtn = "Connect";
        // -530 for hide, +530 for show
        _oBtnConnect =  new CTextButton(-530 + (oSprite.width),nHeightOfPays-40,oSprite,txtModeBtn,FONT_GAME,"#ffffff",15,s_oStage);
        _oBtnConnect.addEventListener(ON_MOUSE_UP, this._onConnectClicked, this);


        // oSprite = s_oSpriteLibrary.getSprite('but_withdraw');//but_withdraw
        // _oBtnWithdraw =  new CTextButton(550 + (oSprite.width/2),nHeightOfPays/2,oSprite,"Refresh GEN",FONT_GAME,"#ffffff",15,s_oStage);
        // _oBtnWithdraw.addEventListener(ON_MOUSE_UP, this._onGetBalanceOfToken, this);


        _oMoneyText = new createjs.Text(TEXT_MONEY +"\n"+iMoney.toFixed(2)+ TEXT_CURRENCY,"30px "+FONT_GAME, "#ffde00");
        _oMoneyText.x = 650;
        _oMoneyText.y = 46;
        _oMoneyText.textBaseline = "alphabetic";
        _oMoneyText.lineHeight = 28;
        _oMoneyText.textAlign = "center";
        s_oStage.addChild(_oMoneyText);
        
        _oNumLinesText = new createjs.Text(NUM_PAYLINES ,"26px "+FONT_GAME, "#ffffff");
        _oNumLinesText.x =  584;
        _oNumLinesText.y = CANVAS_HEIGHT - 55;
        _oNumLinesText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oNumLinesText.textAlign = "center";
        _oNumLinesText.textBaseline = "alphabetic";
        s_oStage.addChild(_oNumLinesText);
        
        _oCoinText = new createjs.Text(iCurBet.toFixed(2) ,"26px "+FONT_GAME, "#ffffff");
        _oCoinText.x =  776;
        _oCoinText.y = CANVAS_HEIGHT - 55;
        _oCoinText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oCoinText.textAlign = "center";
        _oCoinText.textBaseline = "alphabetic";
        
        s_oStage.addChild(_oCoinText);

        _oTotalBetText = new createjs.Text(TEXT_BET +": "+iTotBet.toFixed(2),"26px "+FONT_GAME, "#ffffff");
        _oTotalBetText.x = 980;
        _oTotalBetText.y = CANVAS_HEIGHT - 55;
        _oTotalBetText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oTotalBetText.textAlign = "center";
        _oTotalBetText.textBaseline = "alphabetic";
        s_oStage.addChild(_oTotalBetText);

        
        _oStatusText = new createjs.Text("Place your bet","26px "+FONT_GAME, "#ffffff");
        _oStatusText.x = 734;
        _oStatusText.y = CANVAS_HEIGHT - (oSprite.height/2);//_oButExit.getY()+ oSprite.height;//2021.6.3
        _oStatusText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oStatusText.textAlign = "center";
        _oStatusText.textBaseline = "alphabetic";
        s_oStage.addChild(_oStatusText);

        oSprite = s_oSpriteLibrary.getSprite('bet_but');
        // _aLinesBut = new Array();
        
        // //LINE 1
        // oSprite = s_oSpriteLibrary.getSprite('sunflower_1');
        // var oBut = new CBetBut( 334 + oSprite.width/2, 282 + oSprite.height/2,oSprite);
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this,1);
        // _aLinesBut[0] = oBut;
        
        // //LINE 2
        // oSprite = s_oSpriteLibrary.getSprite('sunflower_2');
        // oBut = new CBetBut( 334 + oSprite.width/2, 180 + oSprite.height/2,oSprite);
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this,2);
        // _aLinesBut[1] = oBut;
        
        // //LINE 3
        // oSprite = s_oSpriteLibrary.getSprite('sunflower_3');
        // oBut = new CBetBut( 334 + oSprite.width/2, 432 + oSprite.height/2,oSprite);
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this,3);
        // _aLinesBut[2] = oBut;
        
        // //LINE 4
        // oSprite = s_oSpriteLibrary.getSprite('sunflower_4');
        // oBut = new CBetBut( 334 + oSprite.width/2, 114 + oSprite.height/2,oSprite);
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this,4);
        // _aLinesBut[3] = oBut;

        // //LINE 5
        // oSprite = s_oSpriteLibrary.getSprite('sunflower_5');
        // oBut = new CBetBut( 334 + oSprite.width/2, 502 + oSprite.height/2,oSprite);
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this,5);
        // _aLinesBut[4] = oBut;

        _aPayline = new Array();
        for(var k = 0;k<NUM_PAYLINES;k++){
            var oBmp = new createjs.Bitmap(s_oSpriteLibrary.getSprite('payline_'+(k+1) ));
            oBmp.visible = false;
            s_oStage.addChild(oBmp);
            _aPayline[k] = oBmp;
        }
        
        //!!2021.6.2
        // _aBigWinAnim = new Array();
        // for(var i = 0;i<2;i++){
        //     var oBmp = new createjs.Bitmap(s_oSpriteLibrary.getSprite('xbig_anim_'+(i+1) ));
        //     oBmp.x = 0;
        //     oBmp.y = 0;
        //     oBmp.visible = false;
        //     s_oStage.addChild(oBmp);
        //     _aBigWinAnim[i] = oBmp;
        // }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        /*
        this.initWeb3();
        */
    };
/*
    this.initWeb3 = function() {
        toastr.warning('##!!??d1b initweb3');
        console.log('##!!??d1b initweb3');
        if (typeof web3 !== 'undefined') {
            web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            console.log('##!!??d1b initweb3-new web3');
        } else {
            web3Provider = new Web3.providers.HttpProvider();
            web3 = new Web3(web3Provider);
            console.log('##!!??d1b initweb3-new You need MetaMask extension');
        }

        this.initContract();
    }

    this.initContract = function() {

        $.getJSON('../build/contracts/erc20.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var SlotMachine2Artifact = data;
        console.log('SlotMachine2Artifact');
        console.log(data);
        console.log('##!!??d1b initContract');

        var MyContract = web3.eth.contract(data);
        console.log("MyContract : ");
        console.log(MyContract);
        myContractInstance = MyContract.at("0xb083Bb3EC96fABd018F7FfB3122Ab3c1501a68a6");
        console.log("myContractInstance1 : ");
        console.log(myContractInstance);
        var myContractInstance2 = MyContract.at("0x0000000000000000000000000000000000001004");
        console.log("myContractInstance2 : ");
        console.log(myContractInstance2);


        console.log("Next Check Acc...");
        checkAccount();

        });

          //return App.bindEvents();
    }

    function checkAccount() {
        web3.eth.getAccounts(function(error, accounts) {
            console.log("check Account:"+JSON.stringify(accounts));
            account = accounts[0];// account : '0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81'
            
            console.log("Next balanceOf");
            checkBalance();


        });
    }

    function checkBalance() {
        console.log("checkBalance Func start");
        try{
            myContractInstance.balanceOf(account,{
                // from:   web3.eth.accounts[0],
                //  value: 1000000000000000
             },function(error, result){
                console.log("bal2 start");
                 if(!error)
                 {
                    console.log("bal2 ok");
                    console.log(result);
                    balance = result.valueOf();
                    console.log(balance);
                    balance = result.c[0] / 10000;
                    console.log(balance);
                    console.log(result.c[0]);
                    iMoney = balance;
                    TOTAL_MONEY = balance;
                    _oMoneyText.text = TEXT_MONEY +"\n"+iMoney.toFixed(2) + TEXT_CURRENCY;
                    // this.refreshMoney(balance);
                    
                    /// balance = result.valueOf();
                    ///var balanceInEther = web3.fromWei(balance, "ether");
                    
                 }
                 else
                 {
                    console.log("bal2 err");
                    console.errlogor(error);
                 }
            });
        }catch(err) {
            console.log("bal2 catch");
            console.log(err);
        }        
    }
    */
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        _oSpinBut.unload();
        _oSpinBut = null;
        _oInfoBut.unload();
        _oInfoBut = null;
        _oAddLineBut.unload();
        _oAddLineBut = null;
        _oBetCoinBut.unload();
        _oBetCoinBut = null;
        _oMaxBetBut.unload();
        _oMaxBetBut = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        for(var i=0;i<NUM_PAYLINES;i++){
            if(i>4)
            {
                break;
            }
            // _aLinesBut[i].unload();
        }
        
        s_oStage.removeAllChildren();
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
    };

    this.refreshMoney = function(iMoney){
        var strText = iMoney.toFixed(2);// iMoney
        _oMoneyText.text = TEXT_MONEY +"\n"+strText + TEXT_CURRENCY;
    };
    
    this.refreshBet = function(iBet){
        _oCoinText.text = iBet.toFixed(2);
    };
    
    this.refreshTotalBet = function(iTotBet){
        _oTotalBetText.text = TEXT_BET +": "+iTotBet.toFixed(2);
    };
    
    this.refreshNumLines = function(iLines){
        _oNumLinesText.text = iLines;
        
        for(var i=0;i<NUM_PAYLINES;i++){
            if(i<iLines){
                //_aLinesBut[i].setOn();
                // _aPayline[i].visible = true;
            }else{
                // _aLinesBut[i].setOff();
            }
            _aPayline[i].visible = false;//!!B for test
        }
        _aPayline[iLines-1].visible = true;//!!B for test

        

        setTimeout(function(){for(var i=0;i<NUM_PAYLINES;i++){
            // _aPayline[i].visible = false;
        }},1000);
    };
    
    this.resetWin = function(){
        // _oSpinBut.changeText("");//!!2021.6.2
        if(G_bFreeSpinMode==false)
        {
            _oStatusText.text = "Good Luck";
        } else 
        {
            if(G_FREE_MODE == true)
            {
                _oStatusText.text = G_nCntFreeSpin + " Free Spins Left";
            } else 
            {
                // call setStatusText instead.
            }

            
        }       
    };

    this.setStatusText = function(strStatus){
        // _oSpinBut.changeText(TEXT_WIN + "\n"+iWin.toFixed(2));//!!2021.6.2
        _oStatusText.text = strStatus;
    };
    
    this.refreshWinText = function(iWin){
        // _oSpinBut.changeText(TEXT_WIN + "\n"+iWin.toFixed(2));//!!2021.6.2
        _oStatusText.text = TEXT_WIN +" " + iWin.toFixed(2);
    };
    
    this.showLine = function(iLine){
        _aPayline[iLine-1].visible = true;
    };
    
    this.hideLine = function(iLine){
        _aPayline[iLine-1].visible = false;
    };
    
    this.hideAllLines = function(){
        for(var i=0;i<NUM_PAYLINES;i++){
            _aPayline[i].visible = false;
        }
    };

    this.showBigWinAnim = function(iIdx){
        // _aBigWinAnim[iIdx-1].visible = true;//!!2021.6.2
    };
    
    this.hideBigWinAnim = function(iIdx){
        // _aBigWinAnim[iIdx-1].visible = false;//!!2021.6.2
    };
    
    this.disableBetBut = function(bDisable){
        for(var i=0;i<NUM_PAYLINES;i++){
            if(i<5)
            {
                // _aLinesBut[i].disable(bDisable);//!!B//~~~~~~~~~
            }
        }
    };
    
    this.enableGuiButtons = function(){
        _oAutoSpinBut.enable();
        _oSpinBut.enable();
        _oMaxBetBut.enable();
        _oBetCoinBut.enable();
        _oAddLineBut.enable();
        _oInfoBut.enable();          
    };
	
    this.enableSpin = function(){
        console.log("Enable Spin..");
            _oSpinBut.enable();
            _oMaxBetBut.enable();
    };

    this.disableSpin = function(){
            _oSpinBut.disable();
            _oMaxBetBut.disable();
            _oStatusText.text = "Not Enough Coins!";
    };
    
    this.enableMaxBet = function(){
        _oMaxBetBut.enable();
    };
    
    this.disableMaxBet = function(){
        _oMaxBetBut.disable();
    };
    
    this.disableGuiButtons = function(){
        _oAutoSpinBut.disable();
        _oSpinBut.disable();
        _oMaxBetBut.disable();
        _oBetCoinBut.disable();
        _oAddLineBut.disable();
        _oInfoBut.disable();
    };
    
    this._onBetLineClicked = function(iLine){
        this.refreshNumLines(iLine);
        
        s_oGame.activateLines(iLine);
    };
    
    this._onExit = function(){
        s_oGame.onExit();  
    };
    
    this._onSpin = function(){
        G_bFreeSpinMode=false;
        console.log("on Spin");
        s_oGame.onSpin();
        this.startRoll();
    };

    this.startRoll = function() {
        console.log("start Roll");

        event.preventDefault();

        // if(started != 0) {
        //     return;
        // }

        /*
        contracts.SlotMachine.deployed().then(function(instance) {
            console.log("startRoll acc");
            console.log(JSON.stringify(account) + ":" + JSON.stringify(instance));


            instance.oneRoll.sendTransaction({from: account, value: web3.toWei('0.0001', 'ether')});
    
        }).then(function() {
            console.log("startRoll .then");
            //App.startShuffle();
        })
        .catch(function(err) {
            console.log("startRoll .catch");
            toastr.warning('Make sure you are connected to Ropsten network');
        });
        */
    }

    this.onNextFreeSpinOfFreeGame = function() {
        G_nCntFreeSpin --;
        if(G_nCntFreeSpin>0)
        {
            s_oGame.onSpin();                        
            console.log("CInterface.onSpin:Current Left G_nCntFreeSpin:"+G_nCntFreeSpin)
        } else 
        {
            _autoSpin = !_autoSpin;
            s_oInterface.enableGuiButtons();
            console.log("CInterface.onSpin:FreeSpin Finished");
            clearInterval( _autoSpinInterval );
        }
        
    };
    
    
    this._onAutoSpin = function(){
        // if(G_nCntFreeSpin>0 && G_nCntFreeSpin!=M_CNT4FreeSpin)
        // {
        //     // if FreeSpin is not finished, please wait.
        //     console.log("!!Please wait");
        //     return;
        // }
        G_bFreeSpinMode = true;
        G_nCntFreeSpin = M_CNT4FreeSpin;
        _autoSpin = true;// _autoSpin = !_autoSpin;//!!
        if(_autoSpin) {
            if(G_FREE_MODE == true)
            {
                s_oGame.onSpin();
                _autoSpinInterval = setInterval(this.onNextFreeSpinOfFreeGame, 6000);
            } else 
            {
                s_oGame.onSpin();
                this.startRoll();                    
            }
            
       } else {
            clearInterval( _autoSpinInterval );
       }
    };
    
    this._onAddLine = function(){
        s_oGame.addLine();
    };
    
    this._onInfo = function(){
        s_oGame.onInfoClicked();
    };
	// TEST BELOW add credit
	this._onAddCredit = function(){
        console.log("onclicked Add Credit");
        s_oGame.onAddCreditClicked();
    };
    
	this._onFreeSpin = function(){
   
        s_oGame.onFreeSpinClicked();
    };


    this._onBet = function(){
        s_oGame.changeCoinBet();
    };

    this._onBetInc = function(){
        s_oGame.incCoinBet();
        s_oGame.onBetClicked();
    };
    
    this._onBetDec = function(){
        s_oGame.decCoinBet();
        s_oGame.onBetClicked();
    };
    
    this._onMaxBet = function(){
        s_oGame.onMaxBet();
    };
    
    this._onApprove = function(){
        s_oGame.approve_metaMast();
    };
    
    this._onDeposit = function(){
        s_oGame.depositGen();
        
    };
    
    this._onWithdraw = function(){
        s_oGame.withdrawGen();
    };

    this._onGetBalanceOfToken = function(){
        s_oGame.getSlotBalance_Test();
    }

    this._onConnectClicked = function(){
        s_oGame.connectToMetamask();        
    }
    
    this.hideConnectBtn = function(){
        console.log("Connect button - hide ");
        _oBtnConnect.visible = false;
        _oBtnConnect.disable();
        // _oBtnConnect.hide();
    }

    this.showConnectBtn = function(){
        console.log("Connect button - show ");
        _oBtnConnect.visible = true;
        _oBtnConnect.enable();
        // _oBtnConnect.show();
    }

    this._onConnectMetamask = function(){
        _oBtnConnect.visible = false;
        if(s_oGame.m_bMetamaskActivated==true)
        {
            console.log("Connect button - hide ");
            _oBtnConnect.disable();
            _oBtnConnect.visible = true;
        }else {
            console.log("Connect button - show ");
            _oBtnConnect.enable();
            _oBtnConnect.visible = false;
        }
    }

    this._onChangeGameMode = function(){
        bFreeMode = !bFreeMode;
        if(bFreeMode==false)
        {
            _oBtnMode.changeText("Paid Mode");
            iMoney = s_oGame.balance;
        }
        else 
        {
            _oBtnMode.changeText("Free Mode");
            iMoney = 100;
        }
        this.refreshMoney(iMoney);
        
    }
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };


    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    s_oInterface = this;
    
    this._init(iCurBet,iTotBet,iMoney);
    
    return this;
}

var s_oInterface = null;
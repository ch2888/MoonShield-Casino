function CGame(oData){
    var _bUpdate = false;
    var _bBonus;
    var _bFirstPlay = true;
    var _bFirstSpin;
    var _iCurState;
    var _iCurReelLoops;
    var _iNextColToStop;
    var _iNumReelsStopped;
    var _iLastLineActive;
    var _iTimeElaps;
    var _iCurWinShown;
    var _iCurBet;
    // var _iTotBet;
    var _iMoney;
    var _iNumIndexHold;
    var _iNumChickenInBonus = 0;
    var _iTotWin;
    var _iAdsShowingCont;
    var _iNumSpinCont;
    var _aMovingColumns;
    var _aStaticSymbols;
    var _aWinningLine;
    var _aReelSequence;
    var _aFinalSymbolCombo;
    var _aHoldText;
    var _aHitAreaColumn;
    var _aSelectCol;
    var _aIndexColumnHold;
    var _oBg;
    var _oFrontSkin;
    var _oInterface;
    var _oPayTable = null;
	// TEST BELOW add credit
	var _oAddCredit = null;
    var _oDlgFreeSpinAsk = null;
    var _oDlgBet = null;
    var _oBonusPanel;
    
    //~~~ for web3 lib
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
    var nSlotBalanceBeforeRoll;
    var m_bStopReelNow = false;
    var m_bFreeMode = true;
    var m_iEarning = 0.0;
    var m_bMetamaskActivated = false;

    var m_arrnCodes4FreeSpin;
    var m_nMode4FreeSpin;
    //________
    
    this.getSlotBalance_Test = function()
    {
        $.getJSON('../build/contracts/slot.json', function(data) {
            slotContract_addr = ADDR_SLOT;
            slotContract = web3.eth.contract(data);
            hslotContract= slotContract.at(slotContract_addr);
            console.log("hslotContract");
            console.log(hslotContract);
            console.log("slotContract : ");
            console.log(slotContract);
            console.log("slotContract_addr:");
            console.log(slotContract_addr);
            console.log("account : ");
            console.log(account);
            console.log("takenContact:");
            console.log(tokenContract);
            maxvalue_approve = 100000000000000;
            // return;
            hslotContract.userInfo.call( 
                account,
                {
                    from:account,//"0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81",
                    // from:   web3.eth.accounts[0],
                    //  value: 1000000000000000
                 },function(error, result ){
                    console.log("userInfo.call start");
                     if(!error)
                     {
                        console.log("userInfo.call ok");
                        console.log(result);
                        getSlotAllowance();
                     }
                     else
                     {
                        console.log("userInfo.call err");
                        console.errlogor(error);
                     }
                });


            showSlotBalance();
            
            // tokenContract.approve(slotContract_addr,ethers.constants.MaxUint256).send(account);
        });
    }
    
    function waitForConnectMetamask(){
        if(m_bMetamaskActivated == true ){
        }
        else{
            s_oGame.initWeb3();
            setTimeout(waitForConnectMetamask, 2500);
        }
    }


    this._init = function(){        
        //!!2021.5.25
        m_arrnCodes4FreeSpin = new Array();
        _iCurState = GAME_STATE_IDLE;
        _bFirstSpin = true;
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iNumIndexHold = 0;
        _iNumSpinCont = 0;
        
        _aReelSequence = new Array(0,1,2,3,4,5);
        _iNextColToStop = _aReelSequence[0];
        _iLastLineActive = NUM_PAYLINES;
        _iMoney = TOTAL_MONEY;
        _iCurBet = MIN_BET;
        _iTotBet = _iCurBet * _iLastLineActive;
        
        _aFinalSymbolCombo = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aFinalSymbolCombo[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                _aFinalSymbolCombo[i][j] = 0;
            }
        }
        
        s_oTweenController = new CTweenController();
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);

        this._initReels();

        _oFrontSkin = createBitmap(s_oSpriteLibrary.getSprite('mask_slot'));
        s_oStage.addChild(_oFrontSkin);

        
        this._initStaticSymbols();
        
        this._initHitAreaColumn();
        _oInterface = new CInterface(_iCurBet,_iTotBet,_iMoney);
        
        _oBonusPanel = new CBonusPanel();
        _oPayTable = new CPayTablePanel();
		//TEST BELOW add credit
		//_oAddCredit = new CAddCreditPanel();
		_oAddCredit = new addCreditsModal();
        _oDlgFreeSpinAsk = new dlgFreeSpinAskModal();
        _oDlgBet = new dlgBetModal();

		if (_iMoney < _iTotBet) {
                _oInterface.disableSpin();
                _oInterface.setStatusText("Not Enough Coins!");
        }
        
        _bUpdate = true;

        //~~~~~~~~~~~~~~~~~~~
        
        m_bFreeMode = G_FREE_MODE;
        if(m_bFreeMode == false)
        {
            _oAddCredit.showReactBanner();
            // this.connectToMetamask();
            // waitForConnectMetamask();
        } else 
        {
            _oAddCredit.hideReactBanner();
            // this.initWeb3();
        }

    };
    function waitForPending1Roll(){
        try{
            hslotContract.balanceOf.call( 
                account,
                {
                    from:account,//"0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81",
                    // from:   web3.eth.accounts[0],
                    //  value: 1000000000000000
                 },function(error, result ){
                    console.log("showSlotBalance start");
                     if(!error)
                     {
                        console.log("showSlotBalance ok");
                        console.log(result);
                        if(m_bFreeMode == true)
                        {
                            return;
                        }
                        tokenBalance = result.valueOf();
                        tokenBalance = result.c[0] / 10000;
                        _iMoney = tokenBalance;
                        TOTAL_MONEY = tokenBalance;
                        oData.money = tokenBalance;
                        TOTAL_BALANCE_SLOT = tokenBalance;
                        // _oInterface.refreshMoney(_iMoney);//!!this is just the defference with showSlotBalance func
                     }
                     else
                     {
                        console.log("showSlotBalance err");
                        // console.errlogor(error);
                     }
                });
            
            // approveSlot();
            
        }catch(err) {
            console.log("getSlotBalance_Test catch");
            console.log(err);
        }  
    }

    function nextSpin4FreeSpin(){
        console.log("nextSpin4FreeSpin:G_nCntFreeSpin");
        console.log(G_nCntFreeSpin);
        G_nCntFreeSpin --;
        if(G_nCntFreeSpin>0)
        {
            _oInterface.setStatusText(G_nCntFreeSpin + " Free Spins Left!");
            s_oGame.onSpin();
            console.log("CGame.onSpin:Current Left G_nCntFreeSpin:"+G_nCntFreeSpin)
        } else 
        {
            _oInterface._autoSpin = !_oInterface._autoSpin;
            console.log("CGame.onSpin:FreeSpin Finished")
            _oInterface.enableGuiButtons();
            _oInterface.setStatusText("Free Spins is finished.");
        }
    }

    function waitForPendingOneRoll(){
        //!! very important. 
        //!! never same as before new balance
        //!! nSlotBalanceBeforeRoll <> TOTAL_BALANCE_SLOT
        if(nSlotBalanceBeforeRoll != TOTAL_BALANCE_SLOT ){
            var nEarning = TOTAL_BALANCE_SLOT - nSlotBalanceBeforeRoll;
            _iTotWin = TOTAL_BALANCE_SLOT + _iTotBet - nSlotBalanceBeforeRoll ;
            m_iEarning = _iTotWin/_iCurBet;
            console.log("!!Result: bal_now:"+TOTAL_BALANCE_SLOT+ 
                " bal_b4:"+nSlotBalanceBeforeRoll 
                +" _iTotBet:"+_iTotBet 
                +" m_iEarning:"+m_iEarning 
                +" _iTotWin:"+_iTotWin );
            

            if(_iTotWin > 0)
            {
                // _oInterface.refreshMoney(_iMoney);//!!2021.4.26
                // _oInterface.refreshWinText(_iTotWin);//!!2021.4.26    
                console.log("earning:"+_iTotWin+ " betTotal:"+_iTotBet);
            } else {
                _iTotWin = 0;//!!????
                console.log("no earning: "+TOTAL_BALANCE_SLOT + ":"+nSlotBalanceBeforeRoll+":"+_iTotBet);
            }
            
            m_bStopReelNow = true;
            do{
                s_oGame.generateFinalSymbols();
            } while((_iTotWin <= m_iEarning-0.2) || (_iTotWin >= m_iEarning+0.2)) ;
            _iTotWin = TOTAL_BALANCE_SLOT + _iTotBet - nSlotBalanceBeforeRoll ;

            //while(_iTotWin != 0.1) ;
            //while((_iTotWin <= m_iEarning-0.001) || (_iTotWin >= m_iEarning+0.001)) ;
            // while((_iTotWin <= m_iEarning-2) || (_iTotWin >= m_iEarning+2));
            console.log("Total earning by waitForPendingOneRoll:"+_iTotWin);
            
            nSlotBalanceBeforeRoll = TOTAL_BALANCE_SLOT;
            s_oInterface.enableGuiButtons();
            // _oInterface.refreshMoney(nSlotBalanceBeforeRoll);            
        }
        else{
            
            getTotalSlotBalance_v2();
            setTimeout(waitForPendingOneRoll, 500);
        }
    }

    this.oneRollOnSpin = function(){        
        m_bStopReelNow = false;
        var amountBet = _iTotBet*100+"0000000000000000";//!! until v4
        var amountBetPerLine = _iTotBet/_iLastLineActive * 100+"0000000000000000";
        console.log("Total Bet:"+_iTotBet + ":"+amountBet+" Lines:"+_iLastLineActive);
        try{
            nSlotBalanceBeforeRoll = TOTAL_BALANCE_SLOT;
            hslotContract.oneRoll( _iLastLineActive, amountBetPerLine, {
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("oneRoll start");
                console.log(account)
                if(!error)
                {
                    console.log("oneRoll ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    waitForPendingOneRoll();
                }
                else
                {
                    console.log("oneRoll err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("oneRoll catch");
            console.log(err);
        } 

    }


    function waitForPendingFreeSpin(){
        //!! very important. 
        //!! never same as before new balance
        //!! nSlotBalanceBeforeRoll <> TOTAL_BALANCE_SLOT
        if(nSlotBalanceBeforeRoll != TOTAL_BALANCE_SLOT ){
            // var nEarning = TOTAL_BALANCE_SLOT - nSlotBalanceBeforeRoll;
            _iTotWin = m_arrnCodes4FreeSpin[0] * _iCurBet ;
            m_iEarning = m_arrnCodes4FreeSpin[0];;
            console.log("!!ResultFreeSpin: bal_now:"+TOTAL_BALANCE_SLOT+ 
                " bal_b4:"+nSlotBalanceBeforeRoll 
                +" _iTotBet:"+_iTotBet 
                +" m_iEarning:"+m_iEarning 
                +" _iTotWin:"+_iTotWin );
            
            if(_iTotWin > 0)
            {
                _iMoney += _iTotWin;
                console.log("waitForPendingFree_Spin:ShowWinText is ok");
                // _oInterface.refreshMoney(_iMoney);//!!2021.4.26
                // _oInterface.refreshWinText(_iTotWin);//!!2021.4.26    
                console.log("earning:"+_iTotWin+ " betTotal:"+_iTotBet);
            } else {
                _iTotWin = 0;//!!????
                console.log("no earning: "+TOTAL_BALANCE_SLOT + ":"+nSlotBalanceBeforeRoll+":"+_iTotBet);
            }
    
            do{
                s_oGame.generateFinalSymbols();
            } while((_iTotWin <= m_iEarning-0.2) || (_iTotWin >= m_iEarning+0.2)) ;
            //while(_iTotWin != 0.1) ;
            //while((_iTotWin <= m_iEarning-0.001) || (_iTotWin >= m_iEarning+0.001)) ;
            // while((_iTotWin <= m_iEarning-2) || (_iTotWin >= m_iEarning+2));

            
            m_bStopReelNow = true;
            _iTotWin = m_arrnCodes4FreeSpin[0] * _iCurBet ;


            console.log("Total earning by waitForPendingFree Spin:"+_iTotWin);
            
            nSlotBalanceBeforeRoll = _iMoney;
            nSlotBalanceBeforeRoll = TOTAL_BALANCE_SLOT;
            // _oInterface.refreshMoney(_iMoney);

            console.log("nextSpin for FreeSpin is called on waitForPendingFree Spin");
            setTimeout(nextSpin4FreeSpin, 9500);
        }
        else
        {
            
            getTotalSlotBalance_v2();            
            setTimeout(waitForPendingFreeSpin, 500);
        }
    }


    this.freeSpinOnSpin = function(){        
        m_bStopReelNow = false;
        nSlotBalanceBeforeRoll = TOTAL_BALANCE_SLOT;
        console.log("!!check nSlotBalanceBeforeRoll:");
        console.log(nSlotBalanceBeforeRoll);
        if(G_nCntFreeSpin != M_CNT4FreeSpin)
        {
            console.log( "freeSpin OnSpin->nextSpin's earning:" );
            console.log("iCurBet,TotWin, iEarning,M_CNT4FreeSpin,G_nCntFreeSpin:");
            _iTotWin = m_arrnCodes4FreeSpin[M_CNT4FreeSpin-G_nCntFreeSpin] * _iCurBet ;
            m_iEarning = m_arrnCodes4FreeSpin[M_CNT4FreeSpin-G_nCntFreeSpin];
            console.log(_iCurBet);
            console.log(_iTotWin);
            console.log(m_iEarning);
            console.log( M_CNT4FreeSpin );
            console.log( G_nCntFreeSpin );
            _iMoney += _iTotWin;
            
            do{
                s_oGame.generateFinalSymbols();
            } while((_iTotWin <= m_iEarning-0.2) || (_iTotWin >= m_iEarning+0.2)) ;
            //while(_iTotWin != 0.1) ;
            //while((_iTotWin <= m_iEarning-0.001) || (_iTotWin >= m_iEarning+0.001)) ;
            // while((_iTotWin <= m_iEarning-2) || (_iTotWin >= m_iEarning+2));
            console.log("freeSpin OnSpin.TotalEarning by waitForPendingFree Spin:"+_iTotWin);
            nSlotBalanceBeforeRoll = _iMoney;
            nSlotBalanceBeforeRoll = TOTAL_BALANCE_SLOT;
            _iTotWin = m_arrnCodes4FreeSpin[M_CNT4FreeSpin-G_nCntFreeSpin] * _iCurBet ;
            if(_iTotWin > 0)
            {
             console.log("freeSpin OnSpin:why not work?!!ShowWinText");
            //  _oInterface.refreshMoney(_iMoney);
            //  _oInterface.refreshWinText(_iTotWin);
            }else {
                _iTotWin = 0;//!!????
                console.log("no earning: "+TOTAL_BALANCE_SLOT + ":"+nSlotBalanceBeforeRoll+":"+_iTotBet);
            }

            m_bStopReelNow = true;
            _iTotWin = m_arrnCodes4FreeSpin[M_CNT4FreeSpin-G_nCntFreeSpin] * _iCurBet ;

            // _oInterface.refreshMoney(_iMoney);
            // _oInterface.refreshWinText(m_arrnCodes4FreeSpin[M_CNT4FreeSpin-G_nCntFreeSpin] * _iCurBet);

            console.log("nextSpin for FreeSpin is called on freeSpin OnSpin");
            setTimeout(nextSpin4FreeSpin, 9500);
                        
        } else 
        {
            _oInterface.setStatusText("Good Luck!");
            try{                
                hslotContract.rollFreeSpin( {
                    from:   account,
                },function(error, result){
                    console.log("rollFreeSpin start");
                    console.log(account)
                    if(!error)
                    {
                        console.log("rollFreeSpin ok");
                        console.log("Tx Hash:");
                        console.log(result);
                        console.log("Return:nSpinCode:");
                        // console.log(result.c[0]);// only if hslotContract.rollFreeSpin.call
                        waitForPendingFreeSpin();
                    
                    }
                    else
                    {
                        console.log("rollFreeSpin err");
                        console.errlogor(error);
                    }
                });        
            }catch(err) {
                console.log("rollFreeSpin catch");
                console.log(err);
            } 

        }

    }


    this.withdrawGen = function(){
    // function withdrawGen(){
        try{
            // withdraw 100
            hslotContract.withdraw("10000000000000000000",{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("withdraw start");
                if(!error)
                {
                    console.log("withdraw ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    
                }
                else
                {
                    console.log("withdraw err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("withdraw catch");
            console.log(err);
        } 

        
        try{
            
            hslotContract.balanceOf(account,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("balanceOf start");
                console.log(account)
                if(!error)
                {
                    console.log("balanceOf ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    
                }
                else
                {
                    console.log("balanceOf err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("balanceOf catch");
            console.log(err);
        } 

        try{
            
            hslotContract.userInfo(account,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("userInfo start");
                console.log(account)
                console.log(error);
                if(!error)
                {
                    console.log("userInfo ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    
                }
                else
                {
                    console.log("userInfo err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("userInfo catch");
            console.log(err);
        } 



    }

    this.showSlotBalanceAndDisp = function (){        
        try{
            hslotContract.balanceOf.call( 
                account,
                {
                    from:account,//"0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81",
                    // from:   web3.eth.accounts[0],
                    //  value: 1000000000000000
                 },function(error, result ){
                    console.log("showSlotBalance start");
                     if(!error)
                     {
                        console.log("showSlotBalance ok");
                        console.log(result);
                        tokenBalance = result.valueOf();
                        tokenBalance = result.c[0] / 10000;
                        if(m_bFreeMode==true) 
                        {
                            return;
                        }
                        _iMoney = tokenBalance;
                        TOTAL_MONEY = tokenBalance;
                        oData.money = tokenBalance;
                        TOTAL_BALANCE_SLOT = tokenBalance;
                        _oInterface.refreshMoney(_iMoney);
                     }
                     else
                     {
                        console.log("showSlotBalance err");
                        // console.errlogor(error);
                     }
                });
            
            // approveSlot();
            
        }catch(err) {
            console.log("getSlotBalance_Test catch");
            console.log(err);
        }  
        
    }


    function getTotalSlotBalance_v1(){        
        try{
            hslotContract.balanceOf.call( 
                account,
                {
                    from:account,//"0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81",
                    // from:   web3.eth.accounts[0],
                    //  value: 1000000000000000
                 },function(error, result ){
                    console.log("showSlotBalance start");
                     if(!error)
                     {
                        console.log("showSlotBalance ok");
                        console.log(result);
                        if(m_bFreeMode == true)
                        {
                            return;
                        }
                        tokenBalance = result.valueOf();
                        tokenBalance = result.c[0] / 10000;
                        _iMoney = tokenBalance;
                        TOTAL_MONEY = tokenBalance;
                        oData.money = tokenBalance;
                        TOTAL_BALANCE_SLOT = tokenBalance;
                        // _oInterface.refreshMoney(_iMoney);//!!this is just the defference with showSlotBalance func
                     }
                     else
                     {
                        console.log("showSlotBalance err");
                        // console.errlogor(error);
                     }
                });
            
            // approveSlot();
            
        }catch(err) {
            console.log("getSlotBalance_Test catch");
            console.log(err);
        }  
        
    }


    function getTotalSlotBalance_v2(){        
        try{
            hslotContract.getSpinCode.call( 
                account,
                {
                    from:account,//"0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81",
                    // from:   web3.eth.accounts[0],
                    //  value: 1000000000000000
                 },function(error, result ){
                    var strCodes="";
                     if(!error)
                     {  
                        // console.log("getTotalSlotBalance_v2");       
                        // console.log(result);               
                        tokenBalance = result[1].c[0] / 10000;
                        var nCode1stLine;
                        var nCode2ndLine;
                        if(TOTAL_BALANCE_SLOT != tokenBalance && result[0].c.length>3)
                        {
                            nCode1stLine = result[0].c[0];
                            nCode2ndLine = result[0].c[1];
                            var i=0;
                            strCodes = result[0].c[0].toString();
                            for(i=1;i<5;i+=1)
                            {
                                if(result[0].c[i].toString().length!=14)
                                {
                                    strCodes +="0";
                                }
                                strCodes += result[0].c[i].toString();
                            }
                            //m_nMode4FreeSpin = Number(nCode1stLine.toString().substr(0,3));
                            m_nMode4FreeSpin = parseInt(strCodes.substr(0,3))-111;
                            G_nCntFreeSpin = m_nMode4FreeSpin;
                            M_CNT4FreeSpin = m_nMode4FreeSpin;
                            if(G_bFreeSpinMode==true) 
                            {
                                _oInterface.setStatusText("You've earned "+G_nCntFreeSpin + " Free Spins!");
                            }
                            
                            for( i=0;i<m_nMode4FreeSpin;i+=1)
                            {
                                m_arrnCodes4FreeSpin[i] = parseInt(strCodes.substr(i*3+3,3))-100;
                            }
                        }

                        // print log only if there is changes.
                        if(TOTAL_BALANCE_SLOT != tokenBalance && result[0].c.length>3)
                        {
                            console.log("StrCodes:"+strCodes);
                            console.log("getTotalSlotBalance v2 ok");
                            console.log(result);
                            console.log("getSpinCode ok");
                            console.log("getSpinCode freespincode array 69digits:");
                            console.log(result);
                            console.log(result[0].c.length);//5
                            console.log(result[0].c[0]);// number
    
                            console.log("nCode.toString()");
                            console.log(nCode1stLine.toString());
                            console.log("Length:"+nCode1stLine.toString().length);
                            console.log(nCode1stLine.toString().substr(0,3));
                            console.log(nCode1stLine.toString().substr(3,3));
                            console.log(nCode1stLine.toString().substr(6,3));

                            console.log("m_arrnCodes4FreeSpin:");
                            console.log(m_arrnCodes4FreeSpin);

                        }
                        
                        TOTAL_BALANCE_SLOT = tokenBalance;
                        if(G_bFreeSpinMode == true) 
                        {
                            if(G_nCntFreeSpin == M_CNT4FreeSpin)
                            {
                            }
                        } else 
                        {
                            _iMoney = tokenBalance;
                            TOTAL_MONEY = tokenBalance;
                            oData.money = tokenBalance;
                        }



                        // _oInterface.refreshMoney(_iMoney);//!!this is just the defference with showSlotBalance func
                     }
                     else
                     {
                        console.log("showSlotBalance err");
                        // console.errlogor(error);
                     }
                });
            
            // approveSlot();
            
        }catch(err) {
            console.log("getSlotBalance_Test catch");
            console.log(err);
        }  
        
    }

    function showSlotBalance(){        
        try{
            hslotContract.balanceOf.call( 
                account,
                {
                    from:account,//"0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81",
                    // from:   web3.eth.accounts[0],
                    //  value: 1000000000000000
                 },function(error, result ){
                    console.log("showSlotBalance start");
                     if(!error)
                     {
                        console.log("showSlotBalance ok");
                        console.log(result);
                        if(m_bFreeMode == true)
                        {
                            return;
                        }
                        tokenBalance = result.valueOf();
                        tokenBalance = result.c[0] / 10000;
                        _iMoney = tokenBalance;
                        TOTAL_MONEY = tokenBalance;
                        oData.money = tokenBalance;
                        TOTAL_BALANCE_SLOT = tokenBalance;
                        _oInterface.refreshMoney(_iMoney);
                     }
                     else
                     {
                        console.log("showSlotBalance err");
                        // console.errlogor(error);
                     }
                });
            
            // approveSlot();
            
        }catch(err) {
            console.log("getSlotBalance_Test catch");
            console.log(err);
        }  
        
    }

    this.withdrawGenAndDisp = function(amount){
        // called by addCreditsModal.js, 
        // amount : 11.25 GEN => 1125.
        var strAmount = amount+"0000000000000000"; // 10^16
        console.log("Deposit Amount:")
        console.log(amount)
        console.log(strAmount)
        try{
            hslotContract.withdraw(strAmount,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("withdraw start");
                if(!error)
                {
                    console.log("withdraw ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    showSlotBalance();
                }
                else
                {
                    console.log("withdraw err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("withdraw catch");
            console.log(err);
        } 
    
    }
        
    this.depositGenAndDisp = function(amount){

        var amountDeposit = amount+"0000000000000000";// 10 ^ 16, 
        console.log("Deposit Amount:")
        console.log(amount)
        console.log(amountDeposit)
        try{
            hslotContract.deposit(amountDeposit,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("deposit start");
                if(!error)
                {
                    console.log("deposit ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    setTimeout(function(){
                        showSlotBalance();
                    },5000);
                    setTimeout(function(){
                        showSlotBalance();
                    },25000);
                    setTimeout(function(){
                        showSlotBalance();
                    },10000);
                    showSlotBalance();
                }
                else
                {
                    console.log("deposit err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("deposit catch");
            console.log(err);
        } 
    }
    

    this.depositGen = function(){
    // function depositGen(){
        try{
            // deposit 100 GEN
            hslotContract.deposit("100000000000000000000",{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("deposit start");
                if(!error)
                {
                    console.log("deposit ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    
                }
                else
                {
                    console.log("deposit err");
                    console.errlogor(error);
                }
            });        
        }catch(err) {
            console.log("deposit catch");
            console.log(err);
        } 
    }

    function getSlotBalance()
    {
        try{
            tokenContract.balanceOf(slotContract_addr,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("slot balance start");
                if(!error)
                {
                    console.log("slot balance ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    
                    
                }
                else
                {
                    console.log("slot balance err");
                    console.errlogor(error);
                }
            });

        }catch(err) {
            console.log("slot balance catch");
            console.log(err);
        }         
    }

    
    function getSlotAllowance(){
        try{
            tokenContract.allowance(account, slotContract_addr,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("allowance start");
                if(!error)
                {
                    console.log("allowance ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    if(m_bFreeMode==true) 
                    {
                        return;
                    }
                    TOTAL_ALLOWANCE = result.c[0] / 10000;
                    _oInterface.refreshMoney(_iMoney);
                
                }
                else
                {
                    console.log("allowance err");
                    console.errlogor(error);
                }
            });

        }catch(err) {
            console.log("allowance catch");
            console.log(err);
        } 
    }


    function approveSlot(){
        try{            
            tokenContract.approve(slotContract_addr,MAX_APPROVE_BALANCE,{
                from:   account,
                //  value: 1000000000000000
            },function(error, result){
                console.log("approve start");
                if(!error)
                {
                    console.log("approve ok");
                    console.log("Tx Hash:");
                    console.log(result);
                    getSlotBalance();
                    s_oGame.getSlotBalance_Test();           
                    getSlotAllowance();         
                }
                else
                {
                    console.log("approve err");
                    console.errlogor(error);
                }
            });

        }catch(err) {
            console.log("approve catch");
            console.log(err);
        } 
    }

    this.approve_metaMast = function() {
        $.getJSON('../build/contracts/slot.json', function(data) {
            slotContract_addr = ADDR_SLOT;            
            slotContract = web3.eth.contract(data);
            hslotContract= slotContract.at(slotContract_addr);
            console.log("hslotContract");
            console.log(hslotContract);
            console.log("slotContract : ");
            console.log(slotContract);
            console.log("slotContract_addr:");
            console.log(slotContract_addr);
            console.log("account : ");
            console.log(account);
            console.log("takenContact:");
            console.log(tokenContract);
            maxvalue_approve = 100000000000000;
            try{
                tokenContract.balanceOf( 
                    account,{
                        // from:   web3.eth.accounts[0],
                        //  value: 1000000000000000
                     },function(error, result){
                        console.log("balanceOf start");
                         if(!error)
                         {
                            console.log("balanceOf ok");
                            console.log(result);
                            getSlotAllowance();
                         }
                         else
                         {
                            console.log("balanceOf err");
                            console.errlogor(error);
                         }
                    });
                
                approveSlot();
                
            }catch(err) {
                console.log("approve catch");
                console.log(err);
            }  
            
            // tokenContract.approve(slotContract_addr,ethers.constants.MaxUint256).send(account);
        });
        tokenContract;
        account;

    }

    this.connectToMetamask = function() {
        try{
            ethereum.enable();
            console.log("ethereum.enable called.");
            this.initWeb3();
        }catch(error){

        }
        
    }


    this.initWeb3 = function() {
        
        // toastr.warning('##!!??d1b initweb3');
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

        this.initContractTest();
    }

    this.initContractTest = function() {
        
        $.getJSON('../build/contracts/erc20.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var SlotMachine2Artifact = data;
        console.log('SlotMachine2Artifact');
        console.log(data);
        console.log('##!!??d1b initContract');
        tokenAddress = ADDR_TOKEN;
        var MyContract = web3.eth.contract(data);
        console.log("MyContract : ");
        console.log(MyContract);

        tokenContract = MyContract.at(tokenAddress);
        // MyContract.defaults({
        //     gasLimit: "1000000"
        //   });
        console.log("tokenContract : ");
        console.log(tokenContract);


        console.log("Next Check Acc...");
        checkAccount_Test();

        });

          //return App.bindEvents();
    }


    function checkAccount_Test() {
        web3.eth.getAccounts(function(error, accounts) {
            console.log("check Account:"+JSON.stringify(accounts));
            account = accounts[0];// account : '0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81'
            
            console.log("Next balanceOf");
            checkBalance_Test();


        });
    }

    function checkBalance_Test() {
        console.log("checkBalance Func start");
        
        if(account == undefined)
        {
            console.log("my metamask account not connected");
            // m_bFreeMode = true;
            m_bMetamaskActivated = false;
            // if (typeof _oInterface !== 'undefined')
            {
                _oInterface.showConnectBtn();
            }
            
            return;
        } else {
            console.log("my metamask account address");
            console.log(account);
            // m_bFreeMode = false;
            m_bMetamaskActivated = true;
            // if (typeof _oInterface !== 'undefined')
            {
                _oInterface.hideConnectBtn();
            }
            
        }
        try{
            tokenContract.balanceOf( account,
            {
                // from:   web3.eth.accounts[0],
                //  value: 1000000000000000
             },function(error, result){
                console.log("bal2 start");
                 if(!error)
                 {
                    console.log("bal2 ok");
                    console.log(result);
                    tokenBalance = result.valueOf();
                    console.log(tokenBalance);
                    tokenBalance = result.c[0] / 10000;
                    console.log(tokenBalance);
                    console.log(result.c[0]);
                    if(m_bFreeMode == true)
                    {
                        return;
                    }
                    _iMoney = tokenBalance;
                    TOTAL_MONEY = tokenBalance;
                    oData.money = tokenBalance;

                    TOTAL_BALANCE_TOKEN = tokenBalance;
                    //_oMoneyText.text = TEXT_MONEY +"\n"+iMoney.toFixed(2) + TEXT_CURRENCY;
                    _oInterface.refreshMoney(_iMoney);
                    s_oGame.getSlotBalance_Test();
                    // showSlotBalance();
                    // this.refreshMoney(tokenBalance);
                    /*
                    tokenBalance = result.valueOf();
                    var balanceInEther = web3.fromWei(tokenBalance, "ether");
*/                    
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
    
    this.initContract_Real = function() {
        
        $.getJSON('../build/contracts/erc20.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var SlotMachine2Artifact = data;
        console.log('SlotMachine2Artifact');
        console.log(data);
        console.log('##!!??d1b initContract');

        var MyContract = web3.eth.contract(data);
        console.log("MyContract : ");
        console.log(MyContract);

        myContractInstance = MyContract.at(ADDR_TOKEN);
        console.log("myContractInstance1 : ");
        console.log(myContractInstance);
        var myContractInstance2 = MyContract.at("0x0000000000000000000000000000000000001004");
        console.log("myContractInstance2 : ");
        console.log(myContractInstance2);


        console.log("Next Check Acc...");
        checkAccount_Real();

        });

          //return App.bindEvents();
    }

    function checkAccount_Real() {
        web3.eth.getAccounts(function(error, accounts) {
            console.log("check Account:"+JSON.stringify(accounts));
            account = accounts[0];// account : '0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81'
            
            console.log("Next balanceOf");
            checkBalance_Real();


        });
    }

    function checkBalance_Real() {
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
                    if(m_bFreeMode==true) 
                    {
                        return;
                    }
                    _iMoney = balance;
                    TOTAL_MONEY = balance;
                    oData.money = balance;
                    //_oMoneyText.text = TEXT_MONEY +"\n"+iMoney.toFixed(2) + TEXT_CURRENCY;
                    _oInterface.refreshMoney(_iMoney);
                    // this.refreshMoney(balance);
                    /*
                    balance = result.valueOf();
                    var balanceInEther = web3.fromWei(balance, "ether");
*/                    
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
    


    this.unload = function(){
        stopSound("reels");
        
        
        s_oStage.removeChild(_oBg);
        s_oStage.removeChild(_oFrontSkin);
        _oInterface.unload();
        _oPayTable.unload();
		//TEST BELOW add credit
		_oAddCredit.unload();
        _oDlgFreeSpinAsk.unload();
        _oDlgBet.unload();

		for (var k = 0; k < _aMovingColumns.length; k++) {
            _aMovingColumns[k].unload();
        }
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aStaticSymbols[i][j].unload();
            }
        } 
        
        _oBonusPanel.unload();
    };
    
    this._initReels = function(){  
        var iXPos = REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y;
        
        var iCurDelay = 0;
        _aMovingColumns = new Array();
        //!!2021.6.4 : +((i+1)%2)*SPACE4ZIGZAG
        for(var i=0;i<NUM_REELS;i++){ 
            _aMovingColumns[i] = new CReelColumn(i,iXPos,iYPos+((i+1)%2)*SPACE4ZIGZAG,iCurDelay);
            _aMovingColumns[i+NUM_REELS] = new CReelColumn(i+NUM_REELS,iXPos,iYPos+((i+1)%2)*SPACE4ZIGZAG + (SYMBOL_SIZE*NUM_ROWS),iCurDelay );
            iXPos += SYMBOL_SIZE + SPACE_BETWEEN_SYMBOLS;
            iCurDelay += REEL_DELAY;
        }
        
    };
    
    this._initStaticSymbols = function(){
        var iXPos = REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y;
        _aStaticSymbols = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            iYPos = REEL_OFFSET_Y + SYMBOL_SIZE*i+SPACE_BETWEEN_SYMBOLS*i;//!!2021.6.5 +SPACE_BETWEEN_SYMBOLS;
            iXPos = REEL_OFFSET_X;
            _aStaticSymbols[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                //!!2021.6.4 : +((i+1)%2)*SPACE4ZIGZAG
                var oSymbol = new CStaticSymbolCell(i,j,iXPos,iYPos+((j+1)%2)*SPACE4ZIGZAG );
                _aStaticSymbols[i][j] = oSymbol;
                
                iXPos += SYMBOL_SIZE + SPACE_BETWEEN_SYMBOLS;

            }
            
            
            
        }
    };
    
    this._initHitAreaColumn = function(){
        _aIndexColumnHold = new Array();
        _aSelectCol = new Array();
        iX = 376;
        iY = 120;
        for(var j=0;j<NUM_REELS;j++){
            var oSelect = createBitmap( s_oSpriteLibrary.getSprite('hold_col'));
            oSelect.x = iX;
            oSelect.y = iY;
            oSelect.visible = false;
            s_oStage.addChild(oSelect);
            
            iX += 150;
            
            _aSelectCol.push(oSelect);
            _aIndexColumnHold[j] = false;
        }
        
        _aHoldText = new Array();
        _aHitAreaColumn = new Array();
        
        var iX = 381;
        var iY = 108;
        var oSprite = s_oSpriteLibrary.getSprite('hit_area_col');
        for(var i=0;i<NUM_REELS;i++){
            var oText = new createjs.Text(TEXT_HOLD,"22px "+FONT_GAME, "#ffffff");
            oText.visible = false;
            oText.x = iX + oSprite.width/2;
            oText.y = iY + oSprite.height - 20;
            oText.shadow = new createjs.Shadow("#000", 1, 1, 2);
            oText.textAlign = "center";
            s_oStage.addChild(oText);
            _aHoldText[i] = oText;
            
            var oHitArea = new CGfxButton(iX + (oSprite.width/2),iY +(oSprite.height/2),oSprite);
            oHitArea.setVisible(false);
            oHitArea.addEventListenerWithParams(ON_MOUSE_UP, this._onHitAreaCol, this,{index:i});
            
            iX += 150;
            
            _aHitAreaColumn.push(oHitArea);
        }
        
        
    };
    
    this.generateFinalSymbols = function(){
		for (var j = 0; j < NUM_REELS; j++) 
		{
			for (var i = 0; i < NUM_ROWS; i++) //## org
			{
				if (_aMovingColumns[j].isHold() === false) {
					var iRandIndex = Math.floor(Math.random() * s_aRandSymbols.length);
					var iRandSymbol = s_aRandSymbols[iRandIndex];//s_aRandSymbols[iRandIndex];
                    if(iRandSymbol==WILD_SYMBOL && j==0)
                    {
                        iRandSymbol = BONUS_SYMBOL-2-j;// No WildSymbol at first Reel.
                    }
                    if(iRandSymbol==BONUS_SYMBOL)
                    {
                        if((m_bFreeMode!=true) || (G_bFreeSpinMode==true))
                        {
                            iRandSymbol = BONUS_SYMBOL-2-j;// No Bonus Symbol
                        }
                    }
                    

					_aFinalSymbolCombo[i][j] = iRandSymbol;//## org code

					//~~~~~~~~~~~ 
					// var fRand = Math.random();
					// _aFinalSymbolCombo[0][j] = iRandSymbol;
					// if(fRand<0.3)
					// {
					// 	_aFinalSymbolCombo[1][j] = iRandSymbol;
					// 	_aFinalSymbolCombo[2][j] = iRandSymbol;	
					// } else if(fRand<0.6)
					// {
					// 	_aFinalSymbolCombo[1][j] = iRandSymbol;
					// 	_aFinalSymbolCombo[2][j] = s_aRandSymbols[Math.floor(Math.random() * s_aRandSymbols.length)];	
					// } else 
					// {
					// 	_aFinalSymbolCombo[1][j] = s_aRandSymbols[Math.floor(Math.random() * s_aRandSymbols.length)];	
					// 	_aFinalSymbolCombo[2][j] = _aFinalSymbolCombo[1][j];	
					// }
					//__________________
				}
			}
		}

        var bWin = this._checkForCombos();
        // bWin = this._checkFor4096();//!!2021.6.15
        this._checkForBonus();
        
        return bWin;
    };
    
    this._checkForCombos = function(){
        //CHECK IF THERE IS ANY COMBO
        _aWinningLine = new Array();
        _iTotWin = 0;
        for(var k=0;k<_iLastLineActive;k++){
            var aCombos = s_aPaylineCombo[k];
            
            var aCellList = new Array();
            var iValue = _aFinalSymbolCombo[aCombos[0].row][aCombos[0].col];
            if(iValue !== BONUS_SYMBOL){
                var iNumEqualSymbol = 1;
                var iStartIndex = 1;
                aCellList.push({row:aCombos[0].row,col:aCombos[0].col,value:_aFinalSymbolCombo[aCombos[0].row][aCombos[0].col]});

                while( iValue === WILD_SYMBOL && iStartIndex<NUM_REELS){
                    iNumEqualSymbol++;
                    iValue = _aFinalSymbolCombo[aCombos[iStartIndex].row][aCombos[iStartIndex].col];
                    aCellList.push({row:aCombos[iStartIndex].row,col:aCombos[iStartIndex].col,
                                                value:_aFinalSymbolCombo[aCombos[iStartIndex].row][aCombos[iStartIndex].col]});
                    iStartIndex++;
                }

                for(var t=iStartIndex;t<aCombos.length;t++){
                    if(_aFinalSymbolCombo[aCombos[t].row][aCombos[t].col] === iValue || _aFinalSymbolCombo[aCombos[t].row][aCombos[t].col] === WILD_SYMBOL){
                        if(_aFinalSymbolCombo[aCombos[t].row][aCombos[t].col] === BONUS_SYMBOL){
                            break;
                        }
                        iNumEqualSymbol++;

                        aCellList.push({row:aCombos[t].row,col:aCombos[t].col,value:_aFinalSymbolCombo[aCombos[t].row][aCombos[t].col]});
                    }else{
                        break;
                    }
                }

                try{
                    // if(iValue !== BONUS_SYMBOL && s_aSymbolWin[iValue-1][iNumEqualSymbol-1] > 0) //!!2021.6.1, if wild symbol is first symbol, then error
                    if(iValue < BONUS_SYMBOL && s_aSymbolWin[iValue-1][iNumEqualSymbol-1] > 0)
                    {
                        _iTotWin += s_aSymbolWin[iValue-1][iNumEqualSymbol-1];
                        _aWinningLine.push({line:k+1,amount:s_aSymbolWin[iValue-1][iNumEqualSymbol-1],
                                    num_win:iNumEqualSymbol,value:iValue,list:aCellList});
                    }    
                }catch(err){
                    console.log("!!crashed on _check For Combos,iValue:,iNumEqualSymbol,s_aSymbolWin:");
                    console.log(iValue);
                    console.log(iNumEqualSymbol);
                    console.log(s_aSymbolWin);
                }
            }
        }

        return _iTotWin>_iTotBet?true:false;
    };

    this._getSymbolDepthAndScore = function(iRow){
        var nDepth=0;
        var nSymbolScore=1;
        var nSymbol = _aFinalSymbolCombo[iRow][0];
        var j=0;
        var i=0;
        if(nSymbol==WILD_SYMBOL || nSymbol==BONUS_SYMBOL)
        {
            return {
                depth: 0,
                score: 0,
            };
        }
        for(j=0;j<NUM_REELS;j++){
            var nRowMatching=0;
            for( i=0;i<NUM_ROWS;i++){
                if(nSymbol == _aFinalSymbolCombo[i][j] || _aFinalSymbolCombo[i][j]==WILD_SYMBOL)
                {
                    if(i<iRow)
                    {
                        return {
                            depth: 0,
                            score: 0,
                        };
                    }
                    nRowMatching+=1;
                }
            }
            
            if(nRowMatching==0)
            {                
                break;
            }
            nDepth=j+1;
            nSymbolScore *= nRowMatching;
        }
        if(nDepth<3)
        {
            nDepth = 0;
            nSymbolScore = 0;
        }
        return {
            depth: nDepth,
            score: nSymbolScore,
        };
    }

    this._checkFor4096 = function(){        
        _iTotWin = 0;
        var i=0;
        for(i=0;i<NUM_ROWS;i++){
            var nDepth;
            var nSymbolScore;
            var values = this._getSymbolDepthAndScore(i);
            nDepth = values.depth;
            nSymbolScore = values.score;
            if(nSymbolScore>0)
            {
                var aTotMatchSymbols4k = new Array();
                var j=0;
                var k=0;

                //_add MatchingSymbols to wining line
                for(j=0;j<NUM_REELS;j++){
                    var nRowMatching=0;
                    for( k=0;k<NUM_ROWS;k++){
                        if(_aFinalSymbolCombo[i][0] == _aFinalSymbolCombo[k][j] || 
                            _aFinalSymbolCombo[k][j]==WILD_SYMBOL)
                        {
                            aTotMatchSymbols4k.push({row:k,col:j,value:_aFinalSymbolCombo[k][j]});
                            nRowMatching+=1;
                        }
                    }
                    
                    if(nRowMatching==0)
                    {                
                        break;
                    }
                }       
                _aWinningLine.push({line:-2,amount:0,num_win:_iNumChickenInBonus,value:WILD_SYMBOL,list:aTotMatchSymbols4k});
                try {
                    _iTotWin += nSymbolScore*s_aSymbolWin[_aFinalSymbolCombo[i][0]-1][nDepth-1];
                }catch(err) {
                    console.log( "Symbol,nDepth" );
                    console.log( _aFinalSymbolCombo[i][0] );
                    console.log( nDepth );
                }
            }
            
        }        
        return _iTotWin>_iTotBet?true:false;
    };

    
    this._checkForBonus = function(){
        if(m_bFreeMode!=true)
        {
            return;
        }
        if(G_bFreeSpinMode==true)
        {
            return;
        }
        //CHECK IF THERE IS BONUS
        _bBonus = false;
        _iNumChickenInBonus = 0;
        var aBonusSymbols = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                if( _aFinalSymbolCombo[i][j] === BONUS_SYMBOL){
                    aBonusSymbols.push({row:i,col:j,value:_aFinalSymbolCombo[i][j]});
                    _iNumChickenInBonus++;
                }
            }
        }
        
        if(_iNumChickenInBonus >= NUM_SYMBOLS_FOR_BONUS){
            _aWinningLine.push({line:-1,amount:0,num_win:_iNumChickenInBonus,value:BONUS_SYMBOL,list:aBonusSymbols});
            
            if(_iNumChickenInBonus>5){
                _iNumChickenInBonus = 5; 
            }
            
//!!//??//##org   _bBonus = true;
            _bBonus = true;//!!2021.6.10 true again.
        }
    };
    
    this._generateRandSymbols = function() {
        var aRandSymbols = new Array();
        for (var i = 0; i < NUM_ROWS; i++) {
                var iRandIndex = Math.floor(Math.random()* s_aRandSymbols.length);
                aRandSymbols[i] = s_aRandSymbols[iRandIndex];
        }

        return aRandSymbols;
    };
    
    this.reelArrived = function(iReelIndex,iCol) {
        if(_iCurReelLoops>MIN_REEL_LOOPS ){
            if (m_bStopReelNow === true && _iNextColToStop === iCol) {//!!!!!
                if (_aMovingColumns[iReelIndex].isReadyToStop() === false) {
                    var iNewReelInd = iReelIndex;
                    if (iReelIndex < NUM_REELS) {
                            iNewReelInd += NUM_REELS;
                            
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iReelIndex],
                                                                          _aFinalSymbolCombo[1][iReelIndex],
                                                                          _aFinalSymbolCombo[2][iReelIndex],
                                                                        //   _aFinalSymbolCombo[3][iReelIndex],//!!2021.6.15 disabled
                                                                          ), true);
                            
                    }else {
                            iNewReelInd -= NUM_REELS;
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iNewReelInd],
                                                                          _aFinalSymbolCombo[1][iNewReelInd],
                                                                          _aFinalSymbolCombo[2][iNewReelInd],
                                                                        //   _aFinalSymbolCombo[3][iNewReelInd],//!!2021.6.15 disabled
                                                                          ), true);    
                    }
                    
                }
            }else
             {
                    _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(),false);
            }   
        }else {    
            _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(), false);
            if(iReelIndex === 0){
                _iCurReelLoops++;
            }
            
        }
    };
    
    this.increaseReelLoops = function(){
        _iCurReelLoops += 2;
    };
    
    
    this.stopNextReel = function() {
        _iNumReelsStopped++;
        if(_iNumReelsStopped%2 === 0){
            
            
            playSound("reel_stop",0.3,false);
            
            
            _iNextColToStop = _aReelSequence[_iNumReelsStopped/2];
            
            if (_iNumReelsStopped === (NUM_REELS*2) ) {
                this._endReelAnimation();
            }
        }    
    };
    
    this._endReelAnimation = function(){
        stopSound("reels");

        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iNextColToStop = _aReelSequence[0];
        
        for(var k=0;k<NUM_REELS;k++){
            _aIndexColumnHold[k] =  false;
            _aSelectCol[k].visible = false;
            _aMovingColumns[k].setHold(false);
            _aMovingColumns[k+NUM_REELS].setHold(false);
        }
        
        _iNumIndexHold = 0;

        //INCREASE MONEY IF THERE ARE COMBOS
        if(_aWinningLine.length > 0){
            //HIGHLIGHT WIN COMBOS IN PAYTABLE
            for(var i=0;i<_aWinningLine.length;i++){
                _oPayTable.highlightCombo(_aWinningLine[i].value,_aWinningLine[i].num_win);
                
                if(_aWinningLine[i].line !== -1){
                    // _oInterface.showLine(_aWinningLine[i].line);//!!2021.4.22 enable/disable payline //!!2021.6.15
                }
                var aList = _aWinningLine[i].list;
                for(var k=0;k<aList.length;k++){
                    _aStaticSymbols[aList[k].row][aList[k].col].show(aList[k].value);
                }

            }
            
            if(_iTotWin>0){
                if(m_bFreeMode == true) //!!2021.5.27
                {
                    _iTotWin *=_iCurBet;
                    _iMoney += _iTotWin;                    
                } else 
                {
                    // _iTotWin & _iMoney are setted already
                }
                SLOT_CASH -= _iTotWin;
                _oInterface.refreshMoney(_iMoney);//!!2021.4.26
                _oInterface.refreshWinText(_iTotWin);//!!2021.4.26

            }
            _iTimeElaps = 0;
            _iCurState = GAME_STATE_SHOW_ALL_WIN;
            
            
            playSound("win",1,false);
            
            _bFirstSpin = true;
            if(_bBonus === false){
                _oInterface.disableBetBut(false);
                _oInterface.enableGuiButtons();
            }
            
        }else{
            if(_bFirstSpin){
                this.enableColumnHitArea();
                _bFirstSpin = false;
                _oInterface.enableSpin();
                _oInterface.disableMaxBet();
            }else{
                _oInterface.disableBetBut(false);
                _oInterface.enableGuiButtons();
                _bFirstSpin = true;
            }
            _iCurState = GAME_STATE_IDLE;
        }
        
        if(_iMoney < _iTotBet){
            _oInterface.disableSpin();
            _oInterface.setStatusText("Not Enough Coins!");
        }

        _iNumSpinCont++;
        if(_iNumSpinCont === _iAdsShowingCont){
            _iNumSpinCont = 0;
            
            $(s_oMain).trigger("show_interlevel_ad");
        }

        $(s_oMain).trigger("save_score",_iMoney);
    };

    this.hidePayTable = function(){
        _oPayTable.hide();
    };
	//TEST BELOW add credit
	this.hideAddCredit = function () {
		_oAddCredit.hide();
	};

	this._showWin = function () {
        var iLineIndex;
        if(_iCurWinShown>0)
        { 
            stopSound("win");
            
            if(_aWinningLine[_iCurWinShown-1].line !== -1){
                iLineIndex = _aWinningLine[_iCurWinShown-1].line;
                _oInterface.hideLine(iLineIndex);
            }
            var aList = _aWinningLine[_iCurWinShown-1].list;
            for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].stopAnim();
            }
        }
        
        if(_iCurWinShown === _aWinningLine.length){
            _iCurWinShown = 0;
        }
        
        if(_aWinningLine[_iCurWinShown].line !== -1){
            iLineIndex = _aWinningLine[_iCurWinShown].line;
            // if(G_bFreeSpinMode!=true)
                _oInterface.showLine(iLineIndex);//!!2021.4.21 disable payline //!!2021.6.15 enabled
        }

        var aList = _aWinningLine[_iCurWinShown].list;
        for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].show(aList[k].value);//!!2021.6.10 show individual win matchings //!!2021.6.15 show payline
        }
            

        _iCurWinShown++;
        
    };
    
    this._hideAllWins = function(){
        for(var i=0;i<_aWinningLine.length;i++){
            var aList = _aWinningLine[i].list;
            for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].stopAnim();
            }
        }
        
        _oInterface.hideAllLines();

        _iTimeElaps = 0;
        _iCurWinShown = 0;
        _iTimeElaps = TIME_SHOW_WIN;
        _iCurState = GAME_STATE_SHOW_WIN;
        
        if(_bBonus){
            if(m_bFreeMode==true)
            {
                _oBonusPanel.show(_iNumChickenInBonus,_iCurBet);
            }
        }
    };
    
    this.enableColumnHitArea = function(){
        for(var i=0;i<NUM_REELS;i++){
            _aHoldText[i].visible = true;
            _aHitAreaColumn[i].setVisible(true);
        }
    };

    this.disableColumnHitArea = function(){
        for(var i=0;i<NUM_REELS;i++){
            _aHoldText[i].visible = false;
            _aHitAreaColumn[i].setVisible(false);
        }
    };
    
    this.activateLines = function(iLine){
        _iLastLineActive = iLine;
        this.removeWinShowing();
		
		var iNewTotalBet = _iCurBet * _iLastLineActive;

		_iTotBet = iNewTotalBet;
		_oInterface.refreshTotalBet(_iTotBet);
		_oInterface.refreshNumLines(_iLastLineActive);
		
		
		if(iNewTotalBet>_iMoney){
			_oInterface.disableSpin();
            _oInterface.setStatusText("Not Enough Coins!");
		}else{
			_oInterface.enableSpin();
		}
    };
	
    this.addLine = function(){
        if(_iLastLineActive === NUM_PAYLINES){
            _iLastLineActive = 1;  
        }else{
            _iLastLineActive++;    
        }
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _iTotBet = Math.floor(_iTotBet * 100)/100;
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);


        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin();
                _oInterface.setStatusText("Not Enough Coins!");
        }else{
                _oInterface.enableSpin();
        }
    };
    
    this.changeCoinBet = function(){
        var iNewBet = Math.floor((_iCurBet+0.05) * 100)/100;
		var iNewTotalBet;
		
        if(iNewBet>MAX_BET){
            _iCurBet = MIN_BET;
            _iTotBet = _iCurBet * _iLastLineActive;
            _iTotBet = Math.floor(_iTotBet * 100)/100;
            
            _oInterface.refreshBet(_iCurBet);
            _oInterface.refreshTotalBet(_iTotBet);
            iNewTotalBet = _iTotBet;
        }else{
            iNewTotalBet = iNewBet * _iLastLineActive;

            _iCurBet += 0.05;
            _iCurBet = Math.floor(_iCurBet * 100)/100;
            _iTotBet = iNewTotalBet;
            _iTotBet = Math.floor(_iTotBet * 100)/100;
            
            _oInterface.refreshBet(_iCurBet);
            _oInterface.refreshTotalBet(_iTotBet);       
        }
        
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin();
                _oInterface.setStatusText("Not Enough Coins!");
        }else{
                _oInterface.enableSpin();
        }
		
    };
	
    
    this.incCoinBet = function(){
        var iNewBet = Math.floor((_iCurBet+0.05) * 100)/100;
		var iNewTotalBet;
		
        if(iNewBet>MAX_BET){
            _iCurBet = MAX_BET;
            _iTotBet = _iCurBet * _iLastLineActive;
            _iTotBet = Math.floor(_iTotBet * 100)/100;
            
            _oInterface.refreshBet(_iCurBet);
            _oInterface.refreshTotalBet(_iTotBet);
            iNewTotalBet = _iTotBet;
        }else{
            iNewTotalBet = iNewBet * _iLastLineActive;

            _iCurBet += 0.05;
            _iCurBet = Math.floor(_iCurBet * 100)/100;
            _iTotBet = iNewTotalBet;
            _iTotBet = Math.floor(_iTotBet * 100)/100;
            
            _oInterface.refreshBet(_iCurBet);
            _oInterface.refreshTotalBet(_iTotBet);       
        }
        
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin();
        }else{
                _oInterface.enableSpin();
        }
		
    };

    
    this.decCoinBet = function(){
        if(_iCurBet<0.06)
        {
            return ;            
        }
        var iNewBet = Math.floor((_iCurBet-0.05) * 100)/100;
		var iNewTotalBet;
		
        if(iNewBet>MAX_BET){
            _iCurBet = MIN_BET;
            _iTotBet = _iCurBet * _iLastLineActive;
            _iTotBet = Math.floor(_iTotBet * 100)/100;
            
            _oInterface.refreshBet(_iCurBet);
            _oInterface.refreshTotalBet(_iTotBet);
            iNewTotalBet = _iTotBet;
        }else{
            iNewTotalBet = iNewBet * _iLastLineActive;

            _iCurBet -= 0.05;
            _iCurBet = Math.floor(_iCurBet * 100)/100;
            _iTotBet = iNewTotalBet;
            _iTotBet = Math.floor(_iTotBet * 100)/100;
            
            _oInterface.refreshBet(_iCurBet);
            _oInterface.refreshTotalBet(_iTotBet);       
        }
        
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin();
        }else{
                _oInterface.enableSpin();
        }
		
    };


    this.onMaxBet = function(){
        console.log("onMaxBet");
        // this.getSlotBalance_Test();
        // this.approve_metaMast();
        var iNewBet = MAX_BET;
		_iLastLineActive = NUM_PAYLINES;
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

		_iCurBet = MAX_BET;
		_iTotBet = iNewTotalBet;
		_oInterface.refreshBet(_iCurBet);
		_oInterface.refreshTotalBet(_iTotBet);
		_oInterface.refreshNumLines(_iLastLineActive);
        
		if(iNewTotalBet>_iMoney){
			_oInterface.disableSpin();
		}else{
			_oInterface.enableSpin();
			this.onSpin();
		}
    };
    
    this._onHitAreaCol = function(oParam){
        var iIndexCol = oParam.index;
        if(_aIndexColumnHold[iIndexCol] === true){
            _aIndexColumnHold[iIndexCol] =  false;
            _aSelectCol[iIndexCol].visible = false;
            _aHoldText[iIndexCol].visible = true;
            
            _iNumIndexHold--;
            
            _aMovingColumns[iIndexCol].setHold(false);
            _aMovingColumns[iIndexCol+NUM_REELS].setHold(false);
            
        }else if(_iNumIndexHold < MAX_NUM_HOLD){
            _aIndexColumnHold[iIndexCol] =  true;
            _iNumIndexHold++; 
            _aSelectCol[iIndexCol].visible = true;
            _aHoldText[iIndexCol].visible = false;
            _aMovingColumns[iIndexCol].setHold(true);
            _aMovingColumns[iIndexCol+NUM_REELS].setHold(true);
            
            
            playSound("press_hold",1,false);
            
        }
    };
    
    this.removeWinShowing = function(){
        _oPayTable.resetHighlightCombo();
        
        _oInterface.resetWin();
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aStaticSymbols[i][j].hide();
            }
        }
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].activate();
        }
        
        _iCurState = GAME_STATE_IDLE;
    };
    
    this.endBonus = function(iBonus){
        iBonus *= _iCurBet;
        _iMoney += iBonus;
        _oInterface.refreshMoney(_iMoney);
        SLOT_CASH -= iBonus;

        _oInterface.disableBetBut(false);
        _oInterface.enableGuiButtons();
        
        $(s_oMain).trigger("bonus_end",_iMoney);
	    $(s_oMain).trigger("save_score",_iMoney);
    };
    
    this.onSpin = function(){
        if(m_bFreeMode==false)
        {
            try{
                console.log(TOTAL_BALANCE_SLOT);
                console.log(tokenBalance);
                console.log(_iTotBet);
                if(tokenBalance<_iTotBet)
                {
                    console.log("Not enough fund!");
                    _oInterface.setStatusText("Not Enough Coins!");
                    return;
                }                
            }catch {
                if(TOTAL_BALANCE_SLOT<_iTotBet)
                {
                    _oInterface.setStatusText("Not Enough coins or disconnected wallet!");
                    return;
                }                
            }
        } else {
            console.log(_iMoney);
            console.log(_iTotBet);
            if(_iMoney<_iTotBet)
            {
                console.log("Not enough fund!");
                _oInterface.setStatusText("Not Enough Coins!");
                return;
            }
        }


        // return;//!! disable for test
        

        stopSound("win");
        playSound("reels",0.3,false);
        
        
        this.disableColumnHitArea();
        _oInterface.disableBetBut(true);
        this.removeWinShowing();
        
        //FIND MIN WIN
        MIN_WIN = s_aSymbolWin[0][s_aSymbolWin[0].length-1];
        for(var i=0;i<s_aSymbolWin.length;i++){
            var aTmp = s_aSymbolWin[i];
            for(var j=0;j<aTmp.length;j++){
                if(aTmp[j] !== 0 && aTmp[j] < MIN_WIN){
                    MIN_WIN = aTmp[j];
                }
            }
        }
		
        MIN_WIN *= _iCurBet;
        // if(_bFirstSpin) //!!2021.5.26
        {
            console.log("!!First Spin");
            
            if(G_bFreeSpinMode==false)//!!2021.5.13
            {
                _iMoney -= _iTotBet;//!!2021.5.13                
            } else 
            {
                _iTotBet = 5;
                if(G_nCntFreeSpin==M_CNT4FreeSpin)
                {
                    _iMoney -= _iTotBet;//!!2021.5.13
                }                
            }
            
            _oInterface.refreshMoney(_iMoney);//!!2021.4.26
            SLOT_CASH += _iTotBet;
            $(s_oMain).trigger("bet_placed",{bet:_iCurBet,tot_bet:_iTotBet});
        } 
        
        
        if( !_bFirstPlay && (_aMovingColumns[0].visible && _aMovingColumns[1].visible) && this._checkForCombos() ){
            //THERE IS ALREADY A WINNING COMBO WITH HOLD COLUMNS
            this._assignWin();
        }else if(SLOT_CASH < MIN_WIN){
            //CHECK IF THERE IS MINIMUM AMOUNT FOR AT LEAST WORST WINNING
            //PLAYER MUST LOSE
            do{
                var bRet = this.generateFinalSymbols();
            }while(bRet === true || _bBonus);
        }else{
            //RANDOM TO ASSIGN A WIN OR NOT
            var iRandSpin = Math.floor(Math.random() * 100);
            if(iRandSpin > WIN_OCCURRENCE){
                //PLAYER LOSES
                do{
                    var bRet = this.generateFinalSymbols();
                }while(bRet === true || _bBonus);
            }else{
                //PLAYER WINS
                this._assignWin();
            }
        }

        //!!test code // disabled by 2021.05.27
        // if(m_bFreeMode==false)
        // {
        //     do{
        //         this.generateFinalSymbols();
        //     }while((_iTotWin < 5) || (_iTotWin > 8));
        //     console.log("Total earning by func:"+_iTotWin);    
        // }
        
        if(m_bFreeMode == false)
        {
            if(G_bFreeSpinMode == true) 
            {                
                this.freeSpinOnSpin();   
                
                
            } else 
            {
                this.oneRollOnSpin();
            }            
        } else 
        {
            m_bStopReelNow = true;
        }

        _oInterface.hideAllLines();
        _oInterface.disableGuiButtons();
        
        _bFirstPlay = false;
        _iCurState = GAME_STATE_SPINNING;
    };
    
    this._printFinalSymbols = function(){
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                trace("_aFinalSymbolCombo["+i+"]["+j+"]: "+_aFinalSymbolCombo[i][j]   );
            }
        }
    };
    
    this._assignWin = function(){
        if(SLOT_CASH < ((BONUS_PRIZE[0][0]*_iCurBet))){
                //NO BONUS
                var iCont = 0;
                do{
                        var bRet = this.generateFinalSymbols();
                        iCont++;
                }while( (bRet === false || (_iTotWin*_iCurBet) > SLOT_CASH || _bBonus) && iCont <= 10000 );
                
                if(iCont > 10000){
                    //PLAYER MUST LOSE
                    do{
                        var bRet = this.generateFinalSymbols();
                    }while(bRet === true || _bBonus);
                }
        }else{
                var iRandBonus = Math.floor(Math.random() * 100);
                if(iRandBonus >= BONUS_OCCURRENCE){
                        //NO BONUS
						
                        var iCont = 0;
                        do{
                                var bRet = this.generateFinalSymbols();
                                iCont++;
                        }while( (bRet === false || (_iTotWin*_iCurBet) > SLOT_CASH || _bBonus) && iCont <= 10000 );
                        
                        if(iCont > 10000){
                            //PLAYER MUST LOSE
                            do{
                                var bRet = this.generateFinalSymbols();
                            }while(bRet === true || _bBonus);
							
                        }
                }else{
                        //GET A BONUS
                        var iCont = 0;
                        do{
                                var bRet = this.generateFinalSymbols();
                                var iIndex = 0;
                                if(_bBonus){
                                        iIndex = _iNumChickenInBonus - 3;
                                }
                                iCont++;
                                
                        }while( (bRet === false || ((_iTotWin*_iCurBet)+(BONUS_PRIZE[iIndex][0]* _iCurBet)) > SLOT_CASH || _bBonus === false) && iCont <= 10000 );
                
                        if(iCont > 10000){
                            //PLAYER MUST LOSE
                            do{
                                var bRet = this.generateFinalSymbols();
                            }while(bRet === true || _bBonus);
                        }
                }
        }
    };
    
    this.onInfoClicked = function(){
        // depositGen();
        if(_iCurState === GAME_STATE_SPINNING){
            return;
        }
        
        if(_oPayTable.isVisible()){
            _oPayTable.hide();
        }else{
            _oPayTable.show();
        }
    };

	//TEST BELOW add credit
	this.onAddCreditClicked = function () {
		if (_iCurState === GAME_STATE_SPINNING) {
			return;
		}
        console.log(" before visible of Credit ");
		if (_oAddCredit.isVisible()) {
            console.log("hide CreditWin ");
			_oAddCredit.hide();
		} else {
            console.log("show CreditWin ");
			_oAddCredit.show();            
		}
	};

	this.onFreeSpinClicked = function () {
        if(m_bFreeMode==false)
        {
            console.log("onclicked Free Spin");
            console.log(TOTAL_BALANCE_SLOT);
            console.log(tokenBalance);
            console.log(_iTotBet);
            if(tokenBalance<_iTotBet)
            {
                console.log("Not enough fund");
                return;
            }                 
        } else 
        {
            G_nCntFreeSpin = Math.floor(Math.random() * 3) + 7;
            M_CNT4FreeSpin = G_nCntFreeSpin;
        }
		if (_iCurState === GAME_STATE_SPINNING) {
			return;
		}
        console.log(" before visible of Credit ");
		if (_oDlgFreeSpinAsk.isVisible()) {
            console.log("hide CreditWin ");
			_oDlgFreeSpinAsk.hide();
		} else {
            console.log("show CreditWin ");
			_oDlgFreeSpinAsk.show();            
		}
	};

	this.onBetClicked = function () {
		if (_iCurState === GAME_STATE_SPINNING) {
			return;
		}
        console.log(" before visible of Credit ");
		if (_oDlgBet.isVisible()) {
            console.log("hide CreditWin ");
			_oDlgBet.hide();
		} else {
            console.log("show CreditWin ");
			_oDlgBet.show();            
		}
	};


    this.onExit = function () {
        _oAddCredit.hideReactBanner();
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event", {
                img: "200x200.jpg",
                title: TEXT_CONGRATULATIONS,
                msg:  TEXT_MSG_SHARE1+ _iMoney + TEXT_MSG_SHARE2,
                msg_share: TEXT_MSG_SHARING1 + _iMoney + TEXT_MSG_SHARING2
            });
    };
    
    this.getState = function(){
        return _iCurState;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        switch(_iCurState){
            case GAME_STATE_SPINNING:{
                for(var i=0;i<_aMovingColumns.length;i++){
                    _aMovingColumns[i].update(_iNextColToStop);
                }
                break;
            }
            case GAME_STATE_SHOW_ALL_WIN:{
                    _iTimeElaps += s_iTimeElaps;
                    if(_iTimeElaps> TIME_SHOW_ALL_WINS){  
                        this._hideAllWins();
                    }
                    break;
            }
            case GAME_STATE_SHOW_WIN:{
                _iTimeElaps += s_iTimeElaps;
                if(_iTimeElaps > TIME_SHOW_WIN){
                    _iTimeElaps = 0;

                    this._showWin();//!!2021.6.14 don't show individual wins //!!2021.6.15 show
                }
                break;
            }
        }
        
	
    };
    
    s_oGame = this;
    
    WIN_OCCURRENCE = oData.win_occurrence;
    SLOT_CASH = oData.slot_cash;
    BONUS_OCCURRENCE = oData.bonus_occurrence;
    MIN_REEL_LOOPS = oData.min_reel_loop;
    REEL_DELAY = oData.reel_delay;
    TIME_SHOW_WIN = oData.time_show_win;
    TIME_SHOW_ALL_WINS = oData.time_show_all_wins;
    TOTAL_MONEY = oData.money;
    MIN_BET = oData.min_bet;
    MAX_BET = oData.max_bet;
    MAX_NUM_HOLD = oData.max_hold;
    PERC_WIN_EGG_1 = oData.perc_win_egg_1;
    PERC_WIN_EGG_2= oData.perc_win_egg_2;
    PERC_WIN_EGG_3= oData.perc_win_egg_3;
    _iAdsShowingCont = oData.num_spin_ads_showing;
    
    new CSlotSettings();
    
    this._init();
}

var s_oGame;
var s_oTweenController;
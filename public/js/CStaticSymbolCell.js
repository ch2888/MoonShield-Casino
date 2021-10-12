function CStaticSymbolCell(iRow,iCol,iXPos,iYPos){
    
    var _iRow;
    var _iCol;
    var _iCurSpriteAnimating = -1;
    var _iLastAnimFrame;
    var _aSprites;
    var _oWinningFrame;
    var _oContainer;
    var _oBigWinFrame;//!!B
    
    this._init = function(iRow,iCol,iXPos,iYPos){
        _iRow = iRow;
        _iCol = iCol;
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        
        var oParent= this;
        _aSprites = new Array();
        for(var i=0;i<NUM_SYMBOLS;i++){
            var oSprite = createSprite(s_aSymbolAnims[i], "static", 0,0,SYMBOL_SIZE, SYMBOL_SIZE);
            oSprite.stop();
            oSprite.x = iXPos;
            oSprite.y = iYPos+SPACE_BETWEEN_ROWS*_iRow;;//!!2021.6.4 : +((i+1)%2)*SPACE4ZIGZAG
            oSprite.on("animationend", oParent._onAnimEnded, null, false, {index:i});
            _oContainer.addChild(oSprite);
            
            _aSprites[i] = oSprite;
            _aSprites[i].visible = false;
        }
        
        var oData = {   // image to use
                        framerate: 60,
                        images: [s_oSpriteLibrary.getSprite('win_frame_anim')], 
                        // width, height & registration point of each sprite
                        frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE, regX: 0, regY: 0}, 
                        animations: {  static: [0, 1],anim:[1,19] }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oWinningFrame = new createSprite(oSpriteSheet, "static",0,0,SYMBOL_SIZE,SYMBOL_SIZE);
        _oWinningFrame.stop();
        _oWinningFrame.x = iXPos;
        _oWinningFrame.y = iYPos+SPACE_BETWEEN_ROWS*_iRow;
        _oContainer.addChild(_oWinningFrame);
        
        //!!B//~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //!!2021.6.2 disabled
        // var oData = {   // image to use
        //     framerate: 60,
        //     images: [s_oSpriteLibrary.getSprite('xbig_anim_1')], 
        //     // width, height & registration point of each sprite
        //     frames: {width: SYMBOL_SIZE, height: SYMBOL_SIZE*3, regX: 0, regY: 0}, 
        //     animations: {  static: [0, 1],anim:[1,19] }
        // };

        // var oSpriteSheet = new createjs.SpriteSheet(oData);

        // _oBigWinFrame = new createSprite(oSpriteSheet, "static",0,0,SYMBOL_SIZE,SYMBOL_SIZE);
        // _oBigWinFrame.stop();
        // _oBigWinFrame.x = iXPos;
        // _oBigWinFrame.y = iYPos;
        // _oContainer.addChild(_oBigWinFrame);
        //_________________________

        s_oStage.addChild(_oContainer);
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oContainer);
    };
    
    this.hide = function(){
         if(_iCurSpriteAnimating > -1){
            //!!2021.6.2
            // _oBigWinFrame.gotoAndStop("static");
            // _oBigWinFrame.visible = false;

            _oWinningFrame.gotoAndStop("static"); 
            _oWinningFrame.visible = false;
            _aSprites[_iCurSpriteAnimating].gotoAndPlay("static");
            _oContainer.visible = false;
        }
    };
    
    this.show = function(iValue){
        //!!2021.6.2
        // _oBigWinFrame.gotoAndPlay("anim");
        // _oBigWinFrame.visible = false;// false for now. should be true//!!B

        _oWinningFrame.gotoAndPlay("anim");
        _oWinningFrame.visible = true;//!!B2021.4.29 , true
        // _oWinningFrame.visible = false;//!!B2021.6.2 , false
        for(var i=0;i<NUM_SYMBOLS;i++){
            if( (i+1) === iValue){
                _aSprites[i].visible = true;
            }else{
                _aSprites[i].visible = false;
            }
        }

        _aSprites[iValue-1].gotoAndPlay("anim");
        _iCurSpriteAnimating = iValue-1;
        _iLastAnimFrame = _aSprites[iValue-1].spriteSheet.getNumFrames();
        
        _oContainer.visible = true;
    };
    
    this._onAnimEnded = function(evt,oData){
        if(_aSprites[oData.index].currentFrame === _iLastAnimFrame){
            return;
        }
        _aSprites[oData.index].stop();
        setTimeout(function(){_aSprites[oData.index].gotoAndPlay(1);},100);
    };
    
    this.stopAnim = function(){
       _aSprites[_iCurSpriteAnimating].gotoAndStop("static");
       _aSprites[_iCurSpriteAnimating].visible = false;
       
       _oWinningFrame.gotoAndStop("static");
       _oWinningFrame.visible = false;

    //!!2021.6.2
    //    _oBigWinFrame.gotoAndPlay("static");
    //    _oBigWinFrame.visible = false;
    };
    
    this._init(iRow,iCol,iXPos,iYPos);
}
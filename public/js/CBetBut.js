function CBetBut(iXPos,iYPos,oSprite){
    var _bDisable;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oButton;
    
    var _oButtonBg;

    this._init = function(iXPos,iYPos,oSprite){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oSprite = oSprite;
        
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: 0, regY: 0}, 
                        animations: {  on: [0, 1],off:[1,2] }
       };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oButton = createSprite(oSpriteSheet, "off",0,0,oSprite.width/2,oSprite.height);
        _oButton.stop();
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
                                   
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
       
        s_oStage.addChild(_oButton);
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease); 
       _oButton.off("mouseOver" , this.buttonOver); 
       _oButton.off("mouseOut" , this.buttonOut); 
       
       s_oStage.removeChild(_oButton);
    };
    
    this.disable = function(bDisable){
        _bDisable = bDisable;
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setOn = function(){
        _oButton.gotoAndStop("on");
    };
    
    this.setOff = function(){
        _oButton.gotoAndStop("off");
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);
       _oButton.on("mouseover" , this.buttonOver);   
       _oButton.on("mouseout" , this.buttonOut);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_aCbCompleted[ON_MOUSE_UP] && _bDisable === false){
            

            playSound("press_but",1,false);
            
            
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
       if(_aCbCompleted[ON_MOUSE_DOWN] && _bDisable === false){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };

    this.buttonOver = function(){
        _oButton.scaleX = 1.1;
        _oButton.scaleY = 1.1;
    };

    this.buttonOut = function(){
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    this._init(iXPos,iYPos,oSprite);
}
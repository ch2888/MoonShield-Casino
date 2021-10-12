$(document).ready(function () {
    
    $('#ui1_close').click(function() {
        $('#dlg_freespin_UI1_ask').hide();
    });
    
    $('#ui1_confirm').click(function() {
        
        s_oInterface._onAutoSpin();
        $('#dlg_freespin_UI1_ask').hide();
        
    });
    
    
    $('#close').click(function() {
        $('#dlg_freespin_UI1_ask').hide();
    });

});

function dlgFreeSpinAskModal() {
	var _iMoney;
    function waitForConnect(){
        console.log("!!!!!waitForConnect");
        if(document.getElementById('connect_btn') == null ){
            console.log("!!!!!waitForConnect DONE");
            s_oGame.initWeb3();
        }
        else{     
            $('.bRsmLA').css('background', 'white');       
            setTimeout(waitForConnect, 500);
        }
    }

    this.showReactBanner = function () {
        $('#root').show();
        $('.jndIql').css('min-height', '50px');  
        $('.jndIql').css('min-height', '50px');
        $('.cYCrGw').css('padding-top', '0px');
        $('.cYCrGw').css('padding-bottom', '0px');
        $('.cYCrGw').css('padding-left', '0px');
        $('.cYCrGw').css('padding-right', '0px');
        $('.cYCrGw').css('padding-right', '0px');
        $('.ljZnsq').css('padding-right', '15px');
        $('.ljZnsq').css('padding-left', '15px');
        $('.ljZnsq').css('background-color', '#ff8400');
        const btnConnect = document.getElementById('connect_btn');
        if(btnConnect!=null)
        {
            console.log("!!!!!!! Connect not null.");
            btnConnect.addEventListener('click', function (event) {
                waitForConnect();
                setTimeout(function () {
                    $('.bRsmLA').css('background', 'white');     
                    $('.jndIql').css('min-height', '50px');     
                    
                }, 100);
                console.log("!!!!!!! Connect clicked.");
              });
    
        }

        const btnAccount = document.getElementById('account_btn');
        if(btnAccount!=null)
        {
            s_oGame.initWeb3();
            console.log("!!!!!!! btnAccount is not null.");
            btnAccount.addEventListener('click', function (event) {
                console.log("!!!!!!! btnAccount clicked.");
                setTimeout(function () {
                    $('.bRsmLA').css('background', 'white');     
                    $('.jndIql').css('min-height', '50px');  
                }, 100);
              });            
        }
    }

    this.hideReactBanner = function () {
        $('#root').hide();
    }

	this.show = function () {
        prev_balance = TOTAL_BALANCE_SLOT;
		_iMoney = TOTAL_BALANCE_SLOT;//TOTAL_MONEY;
		$('#fund4FreeSpin').text("5 GEN");
        $('#direction').text("Max Deposit:"+TOTAL_BALANCE_TOKEN+", Max Withdraw:"+ TOTAL_BALANCE_SLOT);

        $('#dlg_freespin_UI1_ask').show();
        
        $('#credits_to_add').text("Please input amount.");
	};

	this.hide = function () {
		$('#dlg_freespin_UI1_ask').hide();
		console.log("hiding");
	};

	this.isVisible = function () {
		return false;
	};

	this.unload = function () {
		return true;
	};
}
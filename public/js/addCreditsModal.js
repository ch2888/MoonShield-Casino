
// export function add(x, y) {
//     return x + y
// }

// export function mutiply(x, y) {
//     return x * y
// }



$(document).ready(function () {
    
    //set to new api
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    
    //below is all good

    function waitForApproving(){
        if(TOTAL_ALLOWANCE > 0 ){
            $('#add_credits').hide();
        }
        else{
            s_oGame.showSlotBalanceAndDisp();
            setTimeout(waitForApproving, 500);
        }
    }

    function waitForPending(){
        if(TOTAL_BALANCE_SLOT != prev_balance ){
            $('#add_credits').hide();
        }
        else{
            s_oGame.showSlotBalanceAndDisp();
            setTimeout(waitForPending, 500);
        }
    }
        

    function randHash() {
        var text = "";
	    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        var length = 7;
    
	    for (var i = 0; i < length; i++) {
		   text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return text;
    }
    $('#wallet_approve').click(function() {
        // approve
        // var credits = parseInt($('#credits_to_add').text());
        // $('#credits_to_add').text(credits + 1);
        $('#credits_to_add').text("Approve is pending.");
        s_oGame.approve_metaMast();
        waitForApproving();
    });
    
    $('#wallet_withdraw').click(function() {
        // withdraw
        var price2 = document.getElementById('credits_add_val').value;
        price2 = $('#credits_add_val').val();
        price2 = price2 * 100;// remove float value. 11.25 GEN => 1125
        $('#credits_to_add').text("Withdraw is pending.");
        s_oGame.withdrawGenAndDisp(price2);
        
        waitForPending();
		// setTimeout(function(){
        //     $('#add_credits').hide();
        // },15000);
    });
    
    $('#wallet_deposit').click(function() {
        // deposit
        isActive = true;
        var price2 = document.getElementById('credits_add_val').value;
        price2 = $('#credits_add_val').val();
        price2 = price2 * 100;// remove float value. 11.25 GEN => 1125
        $('#credits_to_add').text("Deposit is pending.");
        // _iMoney =  parseInt(price2);
        // TOTAL_MONEY = _iMoney;
        // s_oGame._iMoney = price2;
        s_oGame.depositGenAndDisp(price2);
        // s_oInterface.refreshMoney(s_oGame._iMoney);
        waitForPending();
        // setTimeout(function(){
        //     $('#add_credits').hide();
        // },15000);
		
    });
    
    $('#close').click(function() {
        $('#add_credits').hide();
    });

    $('#steemconnect').click(function() {
        isActive = true;
        var price2 = document.getElementById('credits_add_val').value;
        price2 = $('#credits_add_val').val();
        $('#credits_to_add').text(price2);
        _iMoney =  parseInt(price2);
        TOTAL_MONEY = _iMoney;
        s_oGame._iMoney = price2;
        s_oGame.depositGenAndDisp(price2);
        s_oInterface.refreshMoney(s_oGame._iMoney);
		$('#add_credits').hide();
        // this.hide();
        return;
        var account = "kodaxx",
            price = parseInt($('#credits_to_add').text()) / 100,
            memo = randHash();
        
        var location = "https://v2.steemconnect.com/sign/transfer?&to=" + account + "&amount=" + price + "%20STEEM&memo=" + memo;
            
        window.open(location, '_blank');
        
        console.log("-----------------------------------");
        console.log("To Account: " + account);
        console.log("Amount: " + price);
        console.log("Memo: " + memo);
        console.log("-----------------------------------");
        
        pollServer(account, price, memo);
    });
});

function addCreditsModal() {
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
		//TEST BELOW add credits
		_iMoney = TOTAL_BALANCE_SLOT;//TOTAL_MONEY;
		$('#money').text(TOTAL_BALANCE_SLOT<0?0:TOTAL_BALANCE_SLOT);
        // $('#direction').text("Please input  amount.(Max:10)");
        $('#direction').text("Max Deposit:"+TOTAL_BALANCE_TOKEN+", Max Withdraw:"+ (TOTAL_BALANCE_SLOT<0?0:TOTAL_BALANCE_SLOT));
        console.log("before show");
        console.log($('#add_credits'));
        // console.log($('#add_credits1'));
		// $('#add_credits1').show();
        console.log("Tot allowance:");
        console.log(TOTAL_ALLOWANCE);
        if(TOTAL_ALLOWANCE>0)
        {
            $('#wallet_approve').hide();
            $('#wallet_withdraw').show();
            $('#wallet_deposit').show();
            $('#direction').show();
            $('#credits_add_val').show();
            $('#credits_to_add').text("Please input amount.");
        } else 
        {
            $('#wallet_approve').show();
            $('#wallet_withdraw').hide();
            $('#wallet_deposit').hide();
            $('#direction').hide();
            $('#credits_add_val').hide();
            $('#credits_to_add').text("Please connect your wallet and Approve.");
        }
        $('#add_credits').show();
        
        // $('#add_credits').modal('show');

		//clear previous sale
        
	};

	this.hide = function () {
		TOTAL_MONEY = _iMoney;
		$('#add_credits').hide();
		console.log("hiding");
	};

	this.isVisible = function () {
		return false;
	};

	this.unload = function () {
		return true;
	};
}
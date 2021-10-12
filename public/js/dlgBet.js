$(document).ready(function () {
    
    $('#bet_dec').click(function() {
        s_oInterface._onBetDec();
    });
    
    $('#bet_inc').click(function() {        
        s_oInterface._onBetInc();
    });
    
    
    $('#close_bet').click(function() {
        $('#dlg_bet').hide();
    });

});

function dlgBetModal() {
	var _iMoney;

	this.show = function () {
        prev_balance = TOTAL_BALANCE_SLOT;
		_iMoney = TOTAL_BALANCE_SLOT;//TOTAL_MONEY;
		$('#betAmount').text(_iTotBet+"");
        // $('#direction').text("Max Deposit:"+TOTAL_BALANCE_TOKEN+", Max Withdraw:"+ TOTAL_BALANCE_SLOT);

        $('#dlg_bet').show();
	};

	this.hide = function () {
		$('#dlg_bet').hide();
	};

	this.isVisible = function () {
		return false;
	};

	this.unload = function () {
		return true;
	};
}
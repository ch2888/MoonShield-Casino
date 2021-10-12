import React from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, useModal, useWalletModal } from '@pizzafinance/ui-sdk'
// import { add, mutiply } from '../../../../public/js/addCreditsModal.js';

const ConnectButton = (props) => {
  const { connect, reset } = useWallet()
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(connect, reset)
  const {account} = props;
  const accountEllipsis = account ? `${account.substring(0, 4)  }...${  account.substring(account.length - 4)}` : null;
  if(account === null){
    // //!!2021.5.25 disabled console.log
    // console.log("!!!!!!!!!Account null");// +add(5+7)
    return (
        <Button id="connect_btn" onClick={onPresentConnectModal} style={{marginRight:'0px'}}>
          Connect
        </Button>
    )
  }
  // //!!2021.5.25 disabled console.log
  // console.log("!!!!!!!!!Account not null");// +mutiply(5,7)
  return (
    <Button id="account_btn" onClick={onPresentAccountModal} title={account} style={{marginRight:'30px'}}>
      {accountEllipsis}
    </Button>
  )
}

export default ConnectButton

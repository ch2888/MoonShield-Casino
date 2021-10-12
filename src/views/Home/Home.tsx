import React, { useEffect, useState, useCallback } from 'react'
import { Button, useModal } from '@pizzafinance/ui-sdk'
import Page from 'components/layout/Page'
import BigNumber from 'bignumber.js'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {useTokenBalance, useTokenAllowance} from 'hooks/useTokenBalance'
import addresses from 'config/constants/contracts'
import { useERC20, useSlot } from 'hooks/useContract'
import useSlotBalance from 'hooks/useSlotBalance'
import { useApprove } from 'hooks/useApprove'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import ConnectButton from './components/ConnectButton'


const Home: React.FC = () => {
  const chainId = process.env.REACT_APP_CHAIN_ID // "97"
  const { account } = useWallet() 
  const { onStake } = useStake()
  const { onUnstake } = useUnstake()
  const tokenAddress = addresses.pizza[chainId]
  const tokenContract = useERC20(tokenAddress)
  const { onApprove } = useApprove(tokenContract)
  const [requestedApproval, setRequestedApproval] = useState(false)
  
  const tokenBalance = useTokenBalance(tokenAddress)
  const tokenName = 'GEN'
  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} />)
  const stakedBalance = useSlotBalance(account)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )
  const slot = useSlot();
  const allowance = useTokenAllowance(tokenContract, addresses.slot[chainId])
  const needApproval = allowance.toNumber() === 0 

  // //!!2021.5.25 disabled console.log
  // console.log(allowance.toNumber())

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Page>
      {/* <div>      
      <Cards>
        <FarmStakingCard />
      </Cards>
      <Cards>
        <PizzaStats />
      </Cards>     
      </div> */}
      <ConnectButton account = {account} />
      {/* {account && needApproval && <Button onClick={handleApprove} style={{marginRight:'30px'}}>Approve</Button>}
      {account && !needApproval && <Button onClick={onPresentDeposit} style={{marginRight:'30px'}}>Deposit</Button>}
      {account && !needApproval && <Button onClick={onPresentWithdraw} style={{marginRight:'30px'}}>Withdraw</Button>} */}
    </Page>
  )
}

export default Home

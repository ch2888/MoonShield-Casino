import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useMasterchef, usePizza, useSlot} from './useContract'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const slotContract = useSlot()

  // //!!2021.5.25 disabled console.log
  // console.log("UseApproveFunc: lpContract,slotContract,slotContractAddr,AccAddr ");
  // console.log(lpContract);
  // console.log(slotContract);

  // _address: "0x9EB0692bAaA7B70C324413c5A826a84E356907Cc"
  // jsonInterface : same of slot.json
  // methods, options, ...
  // console.log("- slotContract address:");

  // //!!2021.5.25 disabled console.log
  // console.log(slotContract.options.address);// 0x9EB0692bAaA7B70C324413c5A826a84E356907Cc

  // console.log("- account:");

  // //!!2021.5.25 disabled console.log
  // console.log(account);// 0x2d8D6e61CB20aC0dad5E254AE77F6F028BaB9c81

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, slotContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, slotContract])

  return { onApprove: handleApprove }
}

const p = 1000
export default p

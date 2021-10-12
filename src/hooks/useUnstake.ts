import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { withdraw } from 'utils/callHelpers'
import { useSlot} from './useContract'

const useUnstake = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  // const masterChefContract = useMasterchef()
  const slot = useSlot()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await withdraw(slot, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, slot],
  )

  return { onUnstake: handleUnstake }
}


export default useUnstake

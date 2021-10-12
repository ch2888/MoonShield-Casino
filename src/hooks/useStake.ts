import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync} from 'state/actions'
import { deposit } from 'utils/callHelpers'
import { useSlot} from './useContract'

const useStake = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  // const masterChefContract = useMasterchef()
  const slot = useSlot()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await deposit(slot, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, slot],
  )

  return { onStake: handleStake }
}


export default useStake

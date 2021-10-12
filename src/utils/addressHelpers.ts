import addresses from 'config/constants/contracts'

const chainId = process.env.REACT_APP_CHAIN_ID

export const getPizzaAddress = () => {
  return addresses.pizza[chainId]
}
export const getPastaAddress = () => {
  return addresses.pasta[chainId]
}
export const getMasterChefAddress = () => {
  return addresses.masterChef[chainId]
}
export const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId]
}
export const getWbnbAddress = () => {
  return addresses.wbnb[chainId]
}
export const getSlotAddress = () => {
  return addresses.slot[chainId]
}


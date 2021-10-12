import React from 'react'
import { Card, CardBody, Heading, Text } from '@pizzafinance/ui-sdk'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getPizzaAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const StyledPizzaStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const PizzaStats = () => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getPizzaAddress())
  const pizzaSupply = totalSupply ? getBalanceNumber(totalSupply) - getBalanceNumber(burnedBalance) : 0

  return (
    <StyledPizzaStats>
      <CardBody>
        <Heading size="xl" mb="24px" color="#a000e6">
          {TranslateString(534, 'DEGG Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{TranslateString(536, 'Total DEGG Supply')}</Text>
          {pizzaSupply && <CardValue fontSize="14px" value={pizzaSupply} />}
        </Row>
          <Row>
          <Text fontSize="14px">{TranslateString(538, 'Total DEGG Burned')}</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} />
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(540, 'New DEGG/block')}</Text>
          <CardValue fontSize="14px" decimals={4} value={0.12} />
        </Row>
      </CardBody>
    </StyledPizzaStats>
  )
}

export default PizzaStats

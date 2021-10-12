import React from 'react'
import styled from 'styled-components'
import { Spinner } from '@pizzafinance/ui-sdk'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <div/>
  )
}

export default PageLoader

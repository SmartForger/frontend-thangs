import apiForChain from './apiForChain'

export default props =>
  apiForChain(props).catch(e => {
    return Promise.resolve({ data: {}, error: e })
  })

export default new Promise(resolve => {
  if (window.document.readyState !== 'complete') {
    const onLoad = () => {
      window.removeEventListener('load', onLoad, false)
      window.setTimeout(resolve)
    }
    window.addEventListener('load', onLoad, false)
  } else {
    resolve()
  }
})

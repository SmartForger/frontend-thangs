/**
 * We have a global promise here to make sure we only load the hoops script into
 * the page once.
 */
let scriptLoadingPromises /*: Map<string, Promise<void> | undefined>*/ = new Map()

/**
 * If it hasn't been added yet, asynchronously add the hoops_web_viewer <script>
 * to the DOM. If it has, then just return the promise indicating load/error
 * state.
 * @param path
 * @param options
 */
export function ensureScriptIsLoaded(
  path /*: string*/,
  { log = (_str /*: string*/, ..._rest /*: any*/) => {} } = {}
) {
  // Only add the <script> if it hasn't already been added.
  if (!scriptLoadingPromises.has(path)) {
    const promise = new Promise((resolve, reject) => {
      log('<script> not present, adding to document')
      const e = document.createElement('script')
      e.onload = () => {
        log('<script> loaded')
        resolve()
      }
      e.type = 'text/javascript'
      e.async = true
      e.src = `/${path}`
      e.onerror = reject
      // Finally, add <script> to the document.
      const t = document.getElementsByTagName('script')[0]
      t.parentNode.insertBefore(e, t)
    })
    scriptLoadingPromises.set(path, promise)
  }
  // This promise reflects the loading state of the <script>.
  return scriptLoadingPromises.get(path)
}

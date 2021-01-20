
let targetURL = ''
let timesaleURI = ''
let brandStoreURI = ''
let marketPreviewURL = ''

function settingTargetURL() {
  targetURL = ''
  console.log(`${process.env.VUE_APP_STAGE} stage`)
  if (process.env.VUE_APP_STAGE === 'DEV' || process.env.VUE_APP_STAGE === 'dev') {
    targetURL = `${process.env.VUE_APP_API_URI_DEV}:${process.env.VUE_APP_API_PORT_DEV}`
    marketPreviewURL = 'http://localhost:3000/preview'
    timesaleURI = `https://alpha.7rend.com/t`
    brandStoreURI = `https://alpha.7rend.com/b`
  } else if (process.env.VUE_APP_STAGE === 'ALPHA' || process.env.VUE_APP_STAGE === 'alpha') {
    targetURL = `${process.env.VUE_APP_API_URI_ALPHA}`
    marketPreviewURL = 'https://alpha.7rend.com/preview'
    timesaleURI = `https://alpha.7rend.com/t`
    brandStoreURI = `https://alpha.7rend.com/b`
  } else if (process.env.VUE_APP_STAGE === 'BETA' || process.env.VUE_APP_STAGE === 'beta') {
    targetURL = `${process.env.VUE_APP_API_URI_BETA}`
    marketPreviewURL = 'https://beta.7rend.com/preview'
    timesaleURI = `https://beta.7rend.com/t`
    brandStoreURI = `https://beta.7rend.com/b`
  } else if (process.env.VUE_APP_STAGE === 'PROD' || process.env.VUE_APP_STAGE === 'prod') {
    targetURL = `${process.env.VUE_APP_API_URI_PROD}`
    marketPreviewURL = 'https://7rend.com/preview'
    timesaleURI = `https://7rend.com/t`
    brandStoreURI = `https://7rend.com/b`
  } else {
    console.log('There is no env setting(el-upload targetURL) - cannot load')
    targetURL = `${process.env.VUE_APP_API_URI_DEV}:${process.env.VUE_APP_API_PORT_DEV}`
  }
}

function init() {
  settingTargetURL()
}

init()

const processEnv = {
  targetURL,
  marketPreviewURL,
  timesaleURI,
  brandStoreURI
}

export { processEnv }

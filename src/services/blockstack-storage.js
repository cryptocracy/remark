const storageService = {
  // method for creation/updation of file in GAIA storage
  putFile: (dataObj) => {
    const { fileName, data, options } = dataObj
    return window.blockstack.putFile(fileName, JSON.stringify(data), options).then(res => {
      return res
    })
  },
  // method for fetching data from GAIA storage
  getFile: (dataObj) => {
    const { fileName, options } = dataObj
    return window.blockstack.getFile(fileName, options).then(res => {
      return JSON.parse(res)
    })
  },
  updateIndex: (jsonName, data, slice = false) => window.blockstack.getFile(jsonName, { decrypt: false }).then((currentContent) => {
    let [key, value] = data
    if (!currentContent) {
      window.blockstack.putFile(jsonName, JSON.stringify({ [key]: value }), { encrypt: false })
    } else {
      const parsedCurrentContent = JSON.parse(currentContent)
      if (slice) {
        delete parsedCurrentContent[key]
      } else {
        parsedCurrentContent[key] = value
      }
      window.blockstack.putFile(jsonName, JSON.stringify(parsedCurrentContent), { encrypt: false })
    }
  }),

  isResourceOwned: (resourceAddress) => {
    if (localStorage['blockstack-gaia-hub-config']) {
      return JSON.parse(localStorage['blockstack-gaia-hub-config']).address === resourceAddress
    } else return false
  },
  updateTagIndex: (key, value) => storageService.updateIndex('my_tags.json', [key, value]),
  updateTaskIndex: (key, value) => storageService.updateIndex('my_tasks.json', [key, value]),
  updateImageIndex: (key, value) => storageService.updateIndex('my_images.json', [key, value]),
  updateEventIndex: (key, value) => storageService.updateIndex('my_events.json', [key, value]),
  updateMarkerIndex: (key, value) => storageService.updateIndex('my_markers.json', [key, value]),
  updateWalletIndex: (key, value) => storageService.updateIndex('my_wallet.json', [key, value]),
  updateFavoriteTagIndex: (name, title) => storageService.updateIndex('my_fav_tags.json', [name, title]),
  reduceFavoriteTagIndex: (name, title) => storageService.updateIndex('my_fav_tags.json', [name, title], true),
  updateFavoriteTaskIndex: (name, title) => storageService.updateIndex('my_fav_tasks.json', [name, title]),
  reduceFavoriteTaskIndex: (name, title) => storageService.updateIndex('my_fav_tasks.json', [name, title], true),
  updateFavoriteImageIndex: (name, title) => storageService.updateIndex('my_fav_images.json', [name, title]),
  reduceFavoriteImageIndex: (name, title) => storageService.updateIndex('my_fav_images.json', [name, title], true),
  updateFavoriteMarkerIndex: (name, title) => storageService.updateIndex('my_fav_markers.json', [name, title]),
  reduceFavoriteMarkerIndex: (name, title) => storageService.updateIndex('my_fav_markers.json', [name, title], true),
  updateFavoriteEventIndex: (name, title) => storageService.updateIndex('my_fav_events.json', [name, title]),
  reduceFavoriteEventIndex: (name, title) => storageService.updateIndex('my_fav_events.json', [name, title], true)
}
export default storageService

const imageCompressor = {
  compress: (sourceImgFile, loadedImage, quality, limit) => {
    const origImage = new Image()
    origImage.src = loadedImage.src
    const oldWidth = loadedImage.naturalWidth
    const oldHeight = loadedImage.naturalHeight
    const canvas = document.createElement('canvas')
    const newWidth = oldWidth * Math.sqrt(limit / (sourceImgFile.size * quality))
    const newHeight = oldHeight * Math.sqrt(limit / (sourceImgFile.size * quality))
    canvas.width = newWidth
    canvas.height = newHeight
    canvas.getContext('2d').drawImage(origImage, 0, 0, oldWidth, oldHeight, 0, 0, newWidth, newHeight)
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], sourceImgFile.name, {
          type: sourceImgFile.type,
          lastModified: Date.now()
        })
        resolve(file)
      }, sourceImgFile.type, quality ** (1 / 5)) // 1/5 is hardcode
    })
  }

}

export default imageCompressor

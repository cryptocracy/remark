const validationService = {
  validateTags: (v) => {
    let result
    let regex = /([a-zA-Z0-9_]*)/
    if (!v || v.length < 1) {
      return 'Input is required'
    } else if (v.length > 0) {
      for (let i = 0; i < v.length; i++) {
        if (v[i].length < 2) {
          return 'Tag name must be 2 characters or greater in length'
        }
        let res = String(v[i]).match(regex)
        if (res[0] === res['input']) result = true
        else result = 'Only letters, numbers and underscores are allowed'
      }
      return result
    }
  }
}
export default validationService

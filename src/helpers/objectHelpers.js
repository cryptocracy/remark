export default class ObjectHelpers {
  static toArray (object) {
    let array = []
    Object.entries(object).map(item => array.push(item[1]))
    return array
  }
}

export const getLabelByValue = function(value, list) {
  for (const item of list) {
    if (+item.value === +value) {
      return item.label
    }
  }
  return value
}
export const getValueByLabel = function(label, list) {
  for (const item of list) {
    if (item.label === label) {
      return item.value
    }
  }
  return label
}

export const getLabelsByValues = function(values, list) {
  if (values) {
    const valueList = values.split(',')
    let result = ''
    for (let i = 0, length = valueList.length; i < length; i++) {
      result = result + getLabelByValue(valueList[i], list)
      if (i !== length - 1) {
        result += '、'
      }
    }
    return result
  }
}

import Vue from 'vue'

/**
 * @method formatJson
 * @param {Array} filterVal 导出表头的中文表头对应的英文名称
 * 例:['name', 'age']
 * @param {Array} jsonData 导出的数据
 * 例:[{
 *      name: '张三',
 *      age: 14
 *    }]
 * @return {Array} 组装成需要导出的excel数据
 */
const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
/**
 * @method dateTransition
 * @param {Array} outdata excel表导入的数据
 * 例:[{
 *      姓名: '张三',
        年龄: 14
 *    }]
 * @param {Array} importModel excel表头中文名称和其对应的英文名称
 * 例:[{
 *      label: '姓名',
 *      value: 'name'
 *    },{
 *      label: '年龄',
 *      value: 'age'
 *    }]
 * @return {Array} 组装成需要导入的excel数据
 */
const dateTransition = (outdata, importModel) => {
  // console.log('outdata', outdata);
  // console.log('importModel', importModel);
  const importData = []
  for (const item of outdata) {
    const obj = {}
    for (const key in item) {
      for (const childItem of importModel) {
        if (key === childItem.label) {
          obj[childItem.value] = item[key]
          break
        }
      }
    }
    importData.push(obj)
  }
  return importData
}

/**
 * @method $exportExcel
 * @param {Array} tHeader 导出表格的中文表头
 * 例:['姓名', '年龄']
 * @param {Array} filterVal 导出表头的中文表头对应的英文名称
 * 例:['name', 'age']
 * @param {Array} exportList 导出的数据
 * 例:[{
 *      name: '张三',
 *      age: 14
 *    }]
 * @param {String} excelName 导出的excel表格名称
 * @return {null} 无返回值
 */
Vue.prototype.$exportExcel = (tHeader, filterVal, exportList, excelName) => {
  require.ensure([], () => {
    const { export_json_to_excel } = require('@/vendor/Export2Excel') // 引入文件
    tHeader.unshift('序号')
    filterVal.unshift('index')
    for (let i = 0; i < exportList.length; i++) {
      exportList[i].index = i + 1 + ''
    }
    const data = formatJson(filterVal, exportList)
    // console.log('data', data);
    export_json_to_excel(tHeader, data, excelName)
  })
}

/**
 * @method $importExcel
 * @param {Object} event 文件表单触发change事件的event对象
 * @param {Array} importModel excel表头中文名称和其对应的英文名称
 * 例:[{
 *      label: '姓名',
 *      value: 'name'
 *    },{
 *      label: '年龄',
 *      value: 'age'
 *    }]
 * @return {null} 无返回值
 */
// 导入
Vue.prototype.$importExcel = (event, importModel) => {
  return new Promise((resolve, reject) => {
    var f = event.currentTarget.files[0]
    var rABS = false // 是否将文件读取为二进制字符串

    var reader = new FileReader()
    FileReader.prototype.readAsBinaryString = function(f) {
      var binary = ''
      var rABS = false // 是否将文件读取为二进制字符串
      var wb // 读取完成的数据
      var outdata
      var reader = new FileReader()
      reader.onload = function(e) {
        var bytes = new Uint8Array(reader.result)
        var length = bytes.byteLength
        for (var i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        var XLSX = require('xlsx')

        if (rABS) {
          wb = XLSX.read(btoa(fixdata(binary)), {
            // 手动转化
            type: 'base64'
          })
        } else {
          wb = XLSX.read(binary, {
            type: 'binary'
          })
        }
        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        const importList = dateTransition(outdata, importModel)
        resolve(importList)
      }
      reader.readAsArrayBuffer(f)
    }
    if (rABS) {
      reader.readAsArrayBuffer(f)
    } else {
      reader.readAsBinaryString(f)
    }
  })
}
// 通过label获取value
Vue.prototype.$getValueByLabel = (label, list) => {
  for (const item of list) {
    if (item.label === label) {
      return item.value
    }
  }
  return ''
}
// 通过value获取label
Vue.prototype.$getLabelByValue = (value, list) => {
  for (const item of list) {
    if (+item.value === +value) {
      return item.label
    }
  }
  return ''
}

// 为Date 构造函数添加格式化时间的方法。
Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
    // 常用格式"yyyy-MM-dd hh:mm:ss"
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

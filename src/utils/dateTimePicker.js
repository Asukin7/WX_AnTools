function withData (param) {
  return param < 10 ? '0' + param : '' + param
}
function getLoopArray (start, end) {
  var start0 = (start || 0)
  var end0 = (end || 1)
  var array = []
  for (var i = start0; i <= end0; i++) {
    array.push(withData(i))
  }
  return array
}
function getMonthDay (year, month) {
  var flag = (((year % 400) === 0) || (((year % 4) === 0) && ((year % 100) !== 0)))
  var array = null

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array
}
function getNewDateArry () {
  // 当前时间的处理
  var newDate = new Date()
  var year = withData(newDate.getFullYear())
  var mont = withData(newDate.getMonth() + 1)
  var date = withData(newDate.getDate())
  var hour = withData(newDate.getHours())
  var minu = withData(newDate.getMinutes())
  var seco = withData(newDate.getSeconds())

  return [year, mont, date, hour, minu, seco]
}
function dateTimePicker (startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = []
  var dateTimeArray = [[], [], [], [], [], []]
  var start = startYear || 1978
  var end = endYear || 2100
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry()
  // 处理联动列表数据
  /* 年月日 时分秒 */
  dateTimeArray[0] = getLoopArray(start, end)
  dateTimeArray[1] = getLoopArray(1, 12)
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1])
  dateTimeArray[3] = getLoopArray(0, 23)
  dateTimeArray[4] = getLoopArray(0, 59)
  dateTimeArray[5] = getLoopArray(0, 59)

  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]))
  })

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
// module.exports = {
//   dateTimePicker: dateTimePicker,
//   getMonthDay: getMonthDay
// }
export default {
  withData,
  getLoopArray,
  getMonthDay,
  getNewDateArry,
  dateTimePicker
}

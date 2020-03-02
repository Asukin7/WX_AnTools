const host = 'https://nnsststt.cn/AnTools/' // 写自己的域名

function request (url, method, data, header = {}) {
  // wx.showLoading({
  //   title: '加载中' // 数据请求前loading
  // })
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        // wx.hideLoading()
        if (res.data.code === 0) {
          resolve(res.data)
        } else {
          console.log('失败 ' + res.data.code)
          // wx.showToast({
          //   title: '失败 ' + res.data.code,
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      },
      fail: function () {
        // wx.hideLoading()
        wx.showToast({
          title: '请重新尝试',
          icon: 'none',
          duration: 2000
        })
      }
      // ,
      // complete: function () {
      //   wx.hideLoading()
      // }
    })
  })
}

function get (obj) {
  return request(obj.url, 'GET', obj.data, obj.header)
}

function post (obj) {
  return request(obj.url, 'POST', obj.data, obj.header)
}

export default {
  request,
  get,
  post,
  host
}

const host = 'http://192.168.2.93/AnTools/' // 写自己的域名

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
        resolve(res.data)
      },
      fail: function (res) {
        // wx.hideLoading()
        reject(res)
      },
      complete: function () {
        // wx.hideLoading()
      }
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

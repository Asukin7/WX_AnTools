<script>
export default {
  onLaunch: function () {
    this.getCode()
      .then((res) => {
        // 获取token
        console.log(res)
        return this.$wxRequest.post({
          url: 'user/login',
          data: res
        })
      })
      .then((res) => {
        this.globalData.isLogin = true
        this.globalData.token = res.data.token
        // 判断是否授权
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              this.getUserInfo()
                .then(() => {
                  return this.$wxRequest.post({
                    url: 'user/getUserInfo',
                    data: this.globalData.loginData,
                    header: {'Authorization': this.globalData.token}
                  })
                })
                .then((res) => {
                  this.globalData.isUserInfo = true
                  this.globalData.userInfo = res.data
                  console.log(this.globalData)
                })
              console.log('获取用户数据成功')
            } else {
              console.log('未授权')
            }
          }
        })
      })
  },

  methods: {
    getCode () {
      return new Promise((resolve, reject) => {
        wx.login({
          success (res) {
            resolve(res.code)
          }
        })
      })
    },
    getUserInfo () {
      var that = this
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success (res) {
            that.globalData.loginData = {
              encryptedData: res.encryptedData,
              iv: res.iv
            }
            resolve()
          }
        })
      })
    }
  }
}
</script>

<style>
@import "../static/colorui/main.wxss";
@import "../static/colorui/icon.wxss";
</style>

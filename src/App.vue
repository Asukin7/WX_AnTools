<script>
export default {
  data () {
    return {
      firstOnShow: true
    }
  },

  onLaunch: function () {
    // 获取code
    this.getCode()
      .then((res) => {
        // 发送code获取token
        return this.$wxRequest.post({
          url: 'user/login',
          data: res
        })
      })
      .then((res) => {
        // 设置登录状态并绑定token
        this.globalData.loginDate = new Date().getTime()
        this.globalData.token = res.data.token
        // 判断是否拥有获取用户信息的权限
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              // 发送用户信息并获取用户信息
              this.getUserInfo()
                .then(() => {
                  return this.$wxRequest.post({
                    url: 'user/getUserInfo',
                    data: this.globalData.loginData,
                    header: {'Authorization': this.globalData.token}
                  })
                })
                .then((res) => {
                  // 设置用户信息状态
                  this.globalData.isUserInfo = true
                  this.globalData.userInfo = res.data
                })
            }
          }
        })
      })
    this.refreshToken()
  },

  onShow: function () {
    if (this.firstOnShow) {
      this.firstOnShow = false
      return
    }
    if (new Date().getTime() - this.globalData.loginDate > 1000 * 60 * 26) {
      // 获取code
      this.getCode()
        .then((res) => {
          // 发送code获取token
          return this.$wxRequest.post({
            url: 'user/login',
            data: res
          })
        })
        .then((res) => {
          // 设置登录状态并绑定token
          this.globalData.loginDate = new Date().getTime()
          this.globalData.token = res.data.token
        })
    }
  },

  methods: {
    // 获取code
    getCode () {
      return new Promise((resolve, reject) => {
        wx.login({
          success (res) {
            resolve(res.code)
          }
        })
      })
    },
    // 发送用户信息并获取用户信息
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
    },
    // 每26分钟刷新token
    refreshToken () {
      var that = this
      setTimeout(() => {
        // 获取code
        that.getCode()
          .then((res) => {
            // 发送code获取token
            return that.$wxRequest.post({
              url: 'user/login',
              data: res
            })
          })
          .then((res) => {
            // 设置登录状态并绑定token
            that.globalData.loginDate = new Date().getTime()
            that.globalData.token = res.data.token
          })
        that.refreshToken()
      }, 1000 * 60 * 26)
    }
  }
}
</script>

<style>
@import "../static/colorui/main.wxss";
@import "../static/colorui/icon.wxss";
</style>

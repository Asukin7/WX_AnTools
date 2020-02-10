<template>
  <div>
    <div class="UserCenter-bg bg-black">
      <div v-if="isLogin" class="noLogin">
        <image class="cu-avatar xl round margin-bottom" :src="userInfo.avatarUrl" mode="cover"></image>
        <text class="text-xl">{{userInfo.nickName}}</text>
      </div>
      <div v-else class="noLogin">
        <div class="cu-avatar xl round margin-bottom">
          <text class="cuIcon-people text-white"></text>
        </div>
        <button type="default" size="mini" open-type="getUserInfo" @getuserinfo="getUserInfo">请登录</button>
      </div>
      <image src="../../static/images/wave.gif" mode="scaleToFill" class="gif-wave"></image>
    </div>

    <div class="padding flex text-center text-grey bg-white shadow shadow-lg">
      <div class="flex flex-sub flex-direction solid-right">
        <div class="text-xxl text-orange">￥{{monthExpendMoney==null?'--':monthExpendMoney}}</div>
        <div class="margin-top-sm">
          <text>本月支出</text>
        </div>
      </div>
      <div class="flex flex-sub flex-direction solid-right">
        <div class="text-xxl text-blue">￥{{monthIncomeMoney==null?'--':monthIncomeMoney}}</div>
        <div class="margin-top-sm">
          <text>本月收入</text>
        </div>
      </div>
      <div class="flex flex-sub flex-direction solid-right">
        <div class="text-xxl text-orange">￥{{allExpendMoney==null?'--':allExpendMoney}}</div>
        <div class="margin-top-sm">
          <text>全部支出</text>
        </div>
      </div>
      <div class="flex flex-sub flex-direction">
        <div class="text-xxl text-blue">￥{{allIncomeMoney==null?'--':allIncomeMoney}}</div>
        <div class="margin-top-sm">
          <text>全部收入</text>
        </div>
      </div>
    </div>

    <div class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <navigator class="content" url="" hover-class="none" bindtap = "">
          <text class="cuIcon-formfill text-green"></text>
          <text class="text-grey">启动日志</text>
        </navigator>
      </div>
      <div class="cu-item arrow">
        <div class="content" bindtap="">
          <text class="cuIcon-appreciatefill text-red"></text>
          <text class="text-grey">赞赏支持</text>
        </div>
      </div>
      <div class="cu-item arrow">
        <div class="content" bindtap="">
          <text class="cuIcon-writefill text-cyan"></text>
          <text class="text-grey">意见反馈</text>
        </div>
      </div>
      <div class="cu-item arrow">
        <navigator class="content" url="" hover-class="none" bindtap="">
          <text class="cuIcon-creativefill text-orange"></text>
          <text class="text-grey">关于我们</text>
        </navigator>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLogin: false,
      userInfo: {}
    }
  },

  onShow: function () {
    var that = this
    // 延迟，否则还未从后端获取到数据就已经写入
    setTimeout(function () {
      if (that.globalData.isLogin) {
        that.isLogin = that.globalData.isLogin
        that.userInfo = that.globalData.userInfo
      } else {
        console.log('用户未登录')
      }
    }, 2000)
  },

  methods: {
    // 用户登录操作
    getUserInfo (e) {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            this.globalData.loginData = {
              encryptedData: e.mp.detail.encryptedData,
              iv: e.mp.detail.iv
            }
            this.$wxRequest.post({
              url: 'user/getUserInfo',
              data: this.globalData.loginData,
              header: {'Authorization': this.globalData.token}
            })
              .then((res) => {
                this.globalData.isLogin = true
                this.globalData.userInfo = res.data
                this.isLogin = this.globalData.isLogin
                this.userInfo = this.globalData.userInfo
              })
            console.log('获取用户数据成功')
          } else {
            console.log('未授权')
          }
        }
      })
    }
  }
}
</script>

<style>
.UserCenter-bg {
  background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  color: #fff;
  padding-top: 40rpx;
  height: 450rpx;
  font-weight: 300;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.UserCenter-bg .gif-wave{
  position: absolute;
  mix-blend-mode: screen;
  z-index: 99;
  width: 100%;
  height: 100rpx;
  bottom: 0;
  left: 0;
}
.noLogin{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>

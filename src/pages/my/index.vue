<template>
  <div>
    <div class="UserCenter-bg bg-black">
      <div v-if="isUserInfo" class="noLogin">
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
        <div class="text-xxl text-orange">{{totalNumber==null?'--':totalNumber}}</div>
        <div>
          <text>记账条数</text>
        </div>
      </div>
      <div class="flex flex-sub flex-direction">
        <div class="text-xxl text-blue">{{totalDays==null?'--':totalDays}}</div>
        <div>
          <text>记账天数</text>
        </div>
      </div>
    </div>

    <div class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <navigator class="content" url="" hover-class="none" bindtap = "">
          <text class="cuIcon-formfill text-green"></text>
          <text class="text-grey">记账统计</text>
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
      isOnShow: false,
      isUserInfo: false,
      userInfo: {},
      totalNumber: null,
      totalDays: null
    }
  },

  onLoad: function () {
    var that = this
    setTimeout(function () {
      if (that.globalData.isUserInfo) {
        that.isUserInfo = that.globalData.isUserInfo
        that.userInfo = that.globalData.userInfo
      }
    }, 2000)
  },

  onShow: function () {
    if (this.isOnShow) {
      this.getAllTotalNumberAndDays()
    } else {
      var that = this
      setTimeout(function () {
        that.getAllTotalNumberAndDays()
      }, 2000)
    }
    this.isOnShow = true
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
                this.globalData.isUserInfo = true
                this.globalData.userInfo = res.data
                this.isUserInfo = this.globalData.isUserInfo
                this.userInfo = this.globalData.userInfo
              })
            console.log('获取用户数据成功')
          } else {
            console.log('用户未授权')
          }
        }
      })
    },
    getAllTotalNumberAndDays () {
      this.$wxRequest.post({
        url: 'bookkeeping/allTotalNumberAndDays',
        data: {},
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.totalNumber = res.data.totalNumber
          this.totalDays = res.data.totalDays
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

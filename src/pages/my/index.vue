<template>
  <div>
    
    <div class="container bg-black">
      <image class="container-bg" mode="scaleToFill" src="../../static/images/background.jpg"></image>
      <div class="contenter-main">
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
      </div>
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
      <div class="cu-item arrow" @click="openBookkeepingStatistics()">
        <div class="content">
          <text class="cuIcon-rankfill text-green"></text>
          <text class="text-grey">记账统计</text>
        </div>
      </div>
      <div class="cu-item arrow" @click="copyGitHubLink()">
        <div class="content">
          <text class="cuIcon-github text-grey"></text>
          <text class="text-grey">项目地址</text>
        </div>
      </div>
      <div class="cu-item arrow" @click="showAppreciationCode()">
        <div class="content">
          <text class="cuIcon-appreciatefill text-red"></text>
          <text class="text-grey">赞赏支持</text>
        </div>
      </div>
      <div class="cu-item arrow" @click="openAbout()">
        <div class="content">
          <text class="cuIcon-creativefill text-orange"></text>
          <text class="text-grey">关于软件</text>
        </div>
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
      // 若已获取用户信息则直接绑定用户信息
      if (that.globalData.isUserInfo) {
        that.isUserInfo = that.globalData.isUserInfo
        that.userInfo = that.globalData.userInfo
      }
    }, 2000)
  },

  onShow: function () {
    // 获取记账总条数与总天数
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
    // 获取授权与用户信息
    getUserInfo (e) {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
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
          }
        }
      })
    },
    // 获取记账总条数与总天数
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
    },
    // 打开记账统计页面
    openBookkeepingStatistics () {
      wx.navigateTo({
        url: '../bookkeepingStatistics/main'
      })
    },
    // 复制GitHub链接
    copyGitHubLink () {
      wx.setClipboardData({
        data: 'https://github.com/Asukin7/WX_AnTools',
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 2000
          })
        }
      })
    },
    // 显示赞赏码
    showAppreciationCode () {
      wx.previewImage({
        urls: ['/static/images/appreciationCode.jpg']
      })
    },
    // 打开关于软件页面
    openAbout () {
      wx.navigateTo({
        url: '../about/main'
      })
    }
  }
}
</script>

<style>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 500rpx;
    z-index: 1;
  }
  .container .container-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 2;
  }
  .container .contenter-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 50rpx;
    z-index: 6;
  }
  .noLogin{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
</style>

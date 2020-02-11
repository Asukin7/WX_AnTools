<template>
  <div>
    <div class="container bg-black">
      <text class="text-xl">{{month==null?'全部':month}}支出<text class="text-sl">{{sumExpendMoney==null?'0':sumExpendMoney}}</text>元</text>
      <text class="text-l">收入<text class="text-l">{{sumIncomeMoney==null?'0':sumIncomeMoney}}</text>元</text>
    </div>

    <view class="cu-bar search bg-white">
     <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input type="text" placeholder="搜索" confirm-type="search" :value="remarkText" bindinput="searchInput"/>
      </view>
      <view class="action">
        <picker mode="date" :value="date" fields="month" :start="date" :end="date" bindchange="DateChange">
          <view class="picker">
            {{bkDateStr}}<text class="cuIcon-triangledownfill"/>
          </view>
        </picker>
      </view>
    </view>

    <view class="bg-blue round shadow fixed-button" @click="openBookkeepingEdit()">
      <text class="cuIcon-add lg"/>
    </view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bookkeepingListAll: null,
      bookkeepingGroup: null,
      data: '2020-02',
      bkDateStr: '2020-02'
    }
  },

  onShow: function () {
    var that = this
    // 延迟，否则还未从后端获取到数据就已经写入
    setTimeout(function () {
      if (that.globalData.isLogin) {
        that.getBookkeepingData()
      } else {
        console.log('用户未登录')
      }
    }, 2000)
  },

  methods: {
    getBookkeepingData () {
      this.$wxRequest.post({
        url: 'bookkeeping/listAll',
        data: {},
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.bookkeepingListAll = res.data.bookkeepingListAll
          this.bookkeepingGrouping()
          console.log(this.bookkeepingGroup)
        })
    },
    bookkeepingGrouping () {
      var map = {}
      var dest = []
      for (var i = 0; i < this.bookkeepingListAll.length; i++) {
        var tempI = this.bookkeepingListAll[i]
        if (!map[tempI.bkDateDay]) { // 依赖分组字段可自行更改！
          dest.push({
            bkDateDay: tempI.bkDateDay, // 依赖分组字段可自行更改！
            data: [tempI]
          })
          map[tempI.bkDateDay] = tempI // 依赖分组字段可自行更改！
        } else {
          for (var j = 0; j < dest.length; j++) {
            var tempJ = dest[j]
            if (tempJ.bkDateDay === tempI.bkDateDay) { // 依赖分组字段可自行更改！
              tempJ.data.push(tempI)
              break
            }
          }
        }
      }
      this.bookkeepingGroup = dest
    },
    openBookkeepingEdit () {
      wx.navigateTo({
        url: '../bookkeepingEdit/main'
      })
    }
  }
}
</script>

<style>
  .fixed-button {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 150%;
    width: 100rpx;
    height: 100rpx;
    bottom: 50rpx;
    right: 50rpx;
  }
</style>

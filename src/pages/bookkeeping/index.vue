<template>
  <div>

    <div class="container bg-black" @click="openBookkeepingStatistics()">
      <image class="container-bg" mode="scaleToFill" src="https://nnsststt.cn/images/background.jpg"></image>
      <div class="contenter-main">
        <text class="text-xl">{{sumWhen==null?'全部':sumWhen}}支出<text class="text-sl">{{sumExpendMoneyComputed}}</text>元</text>
        <text class="text-df">收入<text class="text-xl">{{sumIncomeMoneyComputed}}</text>元</text>
      </div>
      <image src="https://nnsststt.cn/images/wave.gif" mode="scaleToFill" class="container-wave"></image>
    </div>

    <div class="cu-bar search bg-white">
     <div class="search-form round">
        <text class="cuIcon-search"></text>
        <input type="text" placeholder="搜索" confirm-type="search" :value="bkRemark" @confirm="searchConfirm($event)"/>
      </div>
      <div class="action">
        <picker mode="date" fields="month" :value="bkDateStr" :start="startDate" :end="endDate" @change="dateChange($event)">
          <div class="picker">
            {{bkDateStr==null?'全部时间':bkDateStr}}<text class="cuIcon-triangledownfill"/>
          </div>
        </picker>
      </div>
    </div>

    <div class="text-center text-grey" style="padding: 200rpx 0;" v-if="bookkeepingGroup==null||bookkeepingGroup.length==0">暂无数据</div>
    
    <div class="cu-list menu-avatar bg-white" style="margin:0rpx" v-for="(item,index) in bookkeepingGroup" :key="index">
      <!-- 头 -->
      <div class="flex justify-between padding text-black">
        <div>{{item.date}}</div>
        <div>支<text class="text-green">￥{{item.sumExpendMoney}}</text>　收<text class="text-orange">￥{{item.sumIncomeMoney}}</text></div>
      </div>
      <!-- 体 -->
      <div class="cu-item" :class="modalName=='move-box-'+index+'-'+indexData?'move-cur':''" v-for="(itemData,indexData) in item.bkData" :key="indexData" @touchstart="listTouchStartFun($event)" @touchmove="listTouchMoveFun($event)" @touchend="listTouchEndFun($event)" :data-target="'move-box-'+index+'-'+indexData">
        <div class="cu-avatar round lg" :class="itemData.incomeOrExpend=='income'?'bg-orange':'bg-green'" @click="openBookkeepingList(itemData)">
          <!-- 账单图标 -->
          <text :class="bkTypeTo[itemData.bkType].icon" style="font-size:x-large;"></text>
        </div>
        <div class="content flex-sub" @click="openBookkeepingEdit(itemData)">
          <div class="flex justify-between text-l">
            <div>
              <!-- 账单类型 -->
              <text>{{bkTypeTo[itemData.bkType].name}}</text>
            </div>
            <div>
              <!-- 账单金额 -->
              <text>{{itemData.incomeOrExpend=='income'?'+':'-'}} {{itemData.bkMoney}}</text>
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray">
            <!-- 账单备注 -->
            <text class="text-cut">{{itemData.bkRemark==null?'':itemData.bkRemark}}</text>
            <!-- 账单日期 -->
            <text>{{itemData.time}}</text>
          </div>
        </div>
        <div class="move">
          <view class="bg-red" @click="deleteBookkeeping(itemData)">删除</view>
        </div>
        <div :class="index==bookkeepingGroup.length-1&&indexData==item.bkData.length-1?'':'list_border'"/>
      </div>
    </div>

    <div class="bg-blue round shadow fixed-button" @click="openBookkeepingEdit(null)">
      <text class="cuIcon-add lg"/>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      isOnShow: false,
      // 发送的数据
      bkRemark: null,
      bkDateStr: null,
      // 接收的数据
      bookkeepingListAll: null,
      sumIncomeMoney: null,
      sumExpendMoney: null,
      // 接收处理后的数据
      bookkeepingGroup: null,
      // 工具数据
      sumWhen: null,
      startDate: '2019-01',
      endDate: null,
      bkTypeTo: null,
      modalName: null
    }
  },

  computed: {
    sumIncomeMoneyComputed () {
      return Number(this.sumIncomeMoney).toFixed(2)
    },
    sumExpendMoneyComputed () {
      return Number(this.sumExpendMoney).toFixed(2)
    }
  },

  onLoad: function () {
    this.bkTypeTo = this.$bkTypeTo.bkTypeTo
    var now = new Date()
    this.bkDateStr = this.endDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2)
    this.sumWhen = now.getMonth() + 1 + '月'
  },

  onShow: function () {
    if (this.isOnShow) {
      this.getBookkeepingData()
    } else {
      var that = this
      setTimeout(function () {
        that.getBookkeepingData()
      }, 2000)
    }
    this.isOnShow = true
  },

  methods: {
    // 获取账单数据
    getBookkeepingData () {
      if (this.bkRemark !== null) {
        this.bkDateStr = null
        this.sumWhen = null
      }
      this.$wxRequest.post({
        url: 'bookkeeping/listAll',
        data: {
          'bkRemark': this.bkRemark,
          'bkDateStr': this.bkDateStr
        },
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.bookkeepingListAll = res.data.bookkeepingListAll
          this.sumIncomeMoney = res.data.sumIncomeMoney
          this.sumExpendMoney = res.data.sumExpendMoney
          this.bookkeepingGrouping()
        })
    },
    // 搜索备注回车
    searchConfirm (e) {
      var value = e.mp.detail.value
      if (value.split(' ').join('').length === 0) {
        wx.showToast({
          title: '搜索内容不可为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.bkRemark = e.mp.detail.value
      this.getBookkeepingData()
    },
    // 搜索日期更改
    dateChange (e) {
      this.bkRemark = null
      this.bkDateStr = e.mp.detail.value
      this.sumWhen = Number(this.bkDateStr.split('-')[1]) + '月'
      this.getBookkeepingData()
    },
    // 删除账单数据
    deleteBookkeeping (data) {
      var that = this
      wx.showModal({
        title: '确认删除？',
        confirmColor: '#ff0000',
        success (res) {
          if (res.confirm) {
            that.$wxRequest.post({
              url: 'bookkeeping/delete',
              data: {
                'id': data.id
              },
              header: {'Authorization': that.globalData.token}
            })
              .then((res) => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                that.getBookkeepingData()
              })
          }
        }
      })
      this.modalName = null
    },
    // 打开账单统计页面
    openBookkeepingStatistics () {
      wx.navigateTo({
        url: '../bookkeepingStatistics/main'
      })
    },
    // 打开账单列表页面
    openBookkeepingList (data) {
      var str = null
      if (data !== null) {
        str = '?incomeOrExpend=' + data.incomeOrExpend + '&bkType=' + data.bkType + '&bkDateStr=' + this.bkDateStr
      }
      wx.navigateTo({
        url: '../bookkeepingList/main' + str
      })
    },
    // 打开编辑账单页面
    openBookkeepingEdit (data) {
      var str = '?id=0'
      if (data !== null) {
        str = '?id=' + data.id + '&incomeOrExpend=' + data.incomeOrExpend + '&bkMoney=' + data.bkMoney + '&bkType=' + data.bkType + '&bkRemark=' + (data.bkRemark === null ? '' : data.bkRemark) + '&bkDate=' + data.bkDate
      }
      wx.navigateTo({
        url: '../bookkeepingEdit/main' + str
      })
    },
    // 账单数据按日期分组
    bookkeepingGrouping () {
      var map = {}
      var dest = []
      for (var i = 0; i < this.bookkeepingListAll.length; i++) {
        var tempMap = this.bookkeepingListAll[i]
        var dateTimeArray = [...tempMap.bkDate.split(' ')[0].split('-'), ...tempMap.bkDate.split(' ')[1].split(':')]
        tempMap['time'] = dateTimeArray[3] + ':' + dateTimeArray[4]
        var id = tempMap.bkDate.substr(0, 10) // 依赖分组字段可自行更改！
        if (!map[id]) {
          var date = null
          if (this.bkRemark == null) date = dateTimeArray[1] + '月' + dateTimeArray[2] + '号 ' + this.getWeek(dateTimeArray[0], dateTimeArray[1], dateTimeArray[2])
          else date = dateTimeArray[0] + '年' + dateTimeArray[1] + '月' + dateTimeArray[2] + '号 ' + this.getWeek(dateTimeArray[0], dateTimeArray[1], dateTimeArray[2])
          var sumIncomeMoney = 0
          var sumExpendMoney = 0
          if (tempMap.incomeOrExpend === 'income') sumIncomeMoney = tempMap.bkMoney
          if (tempMap.incomeOrExpend === 'expend') sumExpendMoney = tempMap.bkMoney
          dest.push({
            id: id,
            date: date,
            sumIncomeMoney: sumIncomeMoney,
            sumExpendMoney: sumExpendMoney,
            bkData: [tempMap]
          })
          map[id] = true
        } else {
          for (var j = 0; j < dest.length; j++) {
            var tempDest = dest[j]
            if (tempDest.id === id) {
              if (tempMap.incomeOrExpend === 'income') tempDest.sumIncomeMoney += tempMap.bkMoney
              if (tempMap.incomeOrExpend === 'expend') tempDest.sumExpendMoney += tempMap.bkMoney
              tempDest.bkData.push(tempMap)
              break
            }
          }
        }
      }
      this.bookkeepingGroup = dest
    },
    // 获取星期数
    getWeek (year, month, day) {
      var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      var y = Number(year)
      var m = Number(month)
      var d = Number(day)
      if (m < 3) {
        m += 12
        --y
      }
      return weekday[(d + 2 * m + Math.floor(3 * (m + 1) / 5) + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1) % 7]
    },
    listTouchStartFun (e) {
      this.ListTouchStart = e.mp.changedTouches[0].pageX
    },
    listTouchMoveFun (e) {
      this.ListTouchDirection = e.mp.changedTouches[0].pageX - this.ListTouchStart > 0 ? 'right' : 'left'
      if (this.ListTouchDirection === 'left') {
        this.modalName = e.mp.currentTarget.dataset.target
      } else {
        this.modalName = null
      }
    },
    listTouchEndFun (e) {
      this.ListTouchDirection = null
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
  .container .container-wave{
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 3;
    mix-blend-mode: screen;  
    height: 100rpx;   
  }
  .container .contenter-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 50rpx;
    z-index: 6;
  }
  .list_border {
    position: fixed;
    width: 80%;
    border-bottom: 1px solid #f0f0f0;
    bottom: 1px;
  }
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

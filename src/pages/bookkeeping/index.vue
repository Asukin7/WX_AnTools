<template>
  <div>
    <div class="container bg-black">
      <text class="text-xl">{{sumWhen==null?'全部':sumWhen}}支出<text class="text-sl">{{sumExpendMoney==null?'0':sumExpendMoney}}</text>元</text>
      <text class="text-l">收入<text class="text-l">{{sumIncomeMoney==null?'0':sumIncomeMoney}}</text>元</text>
    </div>

    <div class="cu-bar search bg-white">
     <div class="search-form round">
        <text class="cuIcon-search"></text>
        <input type="text" placeholder="搜索" confirm-type="search" :value="bkRemark" @confirm="searchConfirm($event)"/>
      </div>
      <div class="action">
        <picker mode="date" fields="month" :value="bkDateStr" :start="startDate" :end="endDate" @change="dateChange($event)">
          <div class="picker">
            {{bkDateStr}}<text class="cuIcon-triangledownfill"/>
          </div>
        </picker>
      </div>
    </div>

    <div class="cu-list menu-avatar bg-white" style="margin:0rpx" v-for="(item,index) in bookkeepingGroup" :key="index">
      <!-- 头 -->
      <div class="flex justify-between padding text-black">
        <div>{{item.mdw}}</div>
        <div>支<text class="text-green">￥{{item.sumExpendMoney}}</text>　收<text class="text-orange">￥{{item.sumIncomeMoney}}</text></div>
      </div>
      <!-- 体 -->
      <div class="cu-item" :class="modalName=='move-box-'+index+'-'+indexData?'move-cur':''" v-for="(itemData,indexData) in item.bkData" :key="indexData" @touchstart="listTouchStartFun($event)" @touchmove="listTouchMoveFun($event)" @touchend="listTouchEndFun($event)" :data-target="'move-box-'+index+'-'+indexData">
        <div class="cu-avatar round lg" :class="itemData.incomeOrExpend=='income'?'bg-orange':'bg-green'">
          <!-- 账单图标 -->
          <text :class="bkTypeTo[itemData.bkType].icon" style="font-size:x-large;"></text>
        </div>
        <div class="content flex-sub">
          <div class="flex justify-between text-l">
            <div>
              <!-- 账单类型 -->
              <text>{{bkTypeTo[itemData.bkType].name}}</text>
              <!-- - -->
              <!-- 账单备注 -->
              <!-- <text class="text-cut">{{itemData.bkRemark}}</text> -->
            </div>
            <div>
              <!-- 账单金额 -->
              <text>{{itemData.incomeOrExpend=='income'?'+':'-'}} {{itemData.bkMoney}}</text>
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray">
            <!-- 账单备注 -->
            <text class="text-cut">{{itemData.bkRemark}}</text>
            <!-- 收入/支出 -->
            <!-- <text>{{itemData.incomeOrExpend=='income'?'收入':'支出'}}</text> -->
            <!-- 账单日期 -->
            <text>{{itemData.hhmm}}</text>
          </div>
        </div>
        <div class="move">
          <view class="bg-red">删除</view>
        </div>
        <div :class="index==bookkeepingGroup.length-1&&indexData==item.bkData.length-1?'':'list_border'"/>
      </div>

    </div>

    <div class="bg-blue round shadow fixed-button" @click="openBookkeepingEdit()">
      <text class="cuIcon-add lg"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bookkeepingListAll: null,
      sumIncomeMoney: null,
      sumExpendMoney: null,
      bookkeepingGroup: null,
      bkTypeTo: null,
      sumWhen: null,
      bkRemark: null,
      bkDateStr: null,
      startDate: '2019-01',
      endDate: null,
      modalName: null
    }
  },

  onLoad: function () {
    this.bkTypeTo = this.$bkTypeTo.bkTypeTo
    this.bkDateStr = this.endDate = this.getNowYearMonth()
    this.sumWhen = new Date().getMonth() + 1 + '月'
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
    bookkeepingGrouping () {
      var map = {}
      var dest = []
      for (var i = 0; i < this.bookkeepingListAll.length; i++) {
        var tempMap = this.bookkeepingListAll[i]
        tempMap['hhmm'] = tempMap.bkDate.substr(11, 5)
        var id = tempMap.bkDate.substr(0, 10) // 依赖分组字段可自行更改！
        if (!map[id]) {
          var year = tempMap.bkDate.substr(0, 4)
          var month = tempMap.bkDate.substr(5, 2)
          var day = tempMap.bkDate.substr(8, 2)
          var sumIncomeMoney = 0
          var sumExpendMoney = 0
          if (tempMap.incomeOrExpend === 'income') sumIncomeMoney = tempMap.bkMoney
          if (tempMap.incomeOrExpend === 'expend') sumExpendMoney = tempMap.bkMoney
          dest.push({
            id: id,
            mdw: month + '月' + day + '号 ' + this.getWeek(year, month, day),
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
    getWeek (year, month, day) {
      var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      var y = Number(year)
      var m = Number(month)
      var d = Number(day)
      if (m < 3) {
        m += 12
        --y
      }
      return weekday[(d + 2 * m + Math.floor(3 * (m + 1) / 5) + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7]
    },
    getNowYearMonth () {
      var now = new Date()
      return now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2)
    },
    searchConfirm (e) {
      var value = e.mp.detail.value
      if (value.split(' ').join('').length === 0) {
        return
      }
      this.bkRemark = e.mp.detail.value
      this.bkDateStr = null
      this.getBookkeepingData()
      this.sumWhen = null
      this.bkDateStr = '全部时间'
    },
    dateChange (e) {
      this.bkRemark = null
      this.bkDateStr = e.mp.detail.value
      this.getBookkeepingData()
      this.sumWhen = Number(this.bkDateStr.substr(5, 2)) + '月'
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
  .container {
    background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
    background-size: cover;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
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

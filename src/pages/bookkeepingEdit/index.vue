<template>
  <div>

    <div class="cu-card case margin-top">
      <div class="cu-item shadow">
        <scroll-view class="nav text-center margin-bottom">
          <div class="cu-item" :class="incomeOrExpend=='expend'?'text-green cur':''" @click="changeIncomeOrExpend('expend')">
            支出
          </div>
          <div class="cu-item" :class="incomeOrExpend=='income'?'text-orange cur':''" @click="changeIncomeOrExpend('income')">
            收入
          </div>
        </scroll-view>

        <div class="cu-form-group solid-bottom">
          <view class="text-price" style="font-size:80rpx;padding-left:30rpx;padding-right:30rpx;"></view>
          <input data-modal='2' type="digit" maxlength="7" style="font-size:60rpx;height:100%;" :value="bkMoney" @input="inputBkMoney($event)"/>
        </div>

        <div class="typeList margin">
          <div class="typeListItem" v-for="(item,index) in bkTypeArray" :key="index" @click="changeBkType(item)">
            <div class="cu-avatar round" :class="bkType==item?(incomeOrExpend=='income'?'bg-orange':'bg-green'):'bg-grey'">
              <text :class="bkTypeTo[item].icon"></text>
            </div>
            <div class="margin-top-xs text-xs" :class="bkType==item?(incomeOrExpend=='income'?'text-orange':'text-green'):'text-grey'">
              {{bkTypeTo[item].name}}
            </div>
          </div>
        </div>

        <div class="cu-form-group solid-top">
          <textarea data-modal='1' maxlength="512" placeholder="备注" :value="bkRemark" @input="inputBkRemark($event)"></textarea>
        </div>

        <picker class="bg-grey light text-right" mode="multiSelector" :value="dateTime" :range="dateTimeArray" @change="changeDateTime" @columnchange="changeDateTimeColumn">
          <div class="padding">{{bkDate}}<text class="cuIcon-triangledownfill"></text></div>
        </picker>
      </div>
    </div>
    
    <div class="padding" style="position:fixed;width:100%;bottom:30rpx;">
      <button class="cu-btn" :class="incomeOrExpend=='income'?'bg-orange':'bg-green'" style="width:100%;height:80rpx" @click="saveBookkeeping()">保存</button>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      incomeOrExpend: null,
      bkMoney: null,
      bkType: null,
      bkRemark: null,
      bkDate: null,

      bkTypeTo: null,
      bkTypeArray: null,
      dateTime: null,
      dateTimeArray: null
    }
  },

  onLoad: function (option) {
    this.bkTypeTo = this.$bkTypeTo.bkTypeTo
    // 获取完整的年月日时分秒，以及默认显示的数组
    var obj = this.$dateTimePicker.dateTimePicker('2019', new Date().getFullYear(), option.bkDate)
    // 精确到分的处理，将数组的秒去掉
    obj.dateTimeArray.pop()
    obj.dateTime.pop()
    this.dateTime = obj.dateTime
    this.dateTimeArray = obj.dateTimeArray

    if (Number(option.id) === 0) {
      this.id = null
      this.bkMoney = null
      this.bkRemark = null
      this.changeIncomeOrExpend('expend')
      this.changeBkDate()
    } else {
      this.id = Number(option.id)
      this.changeIncomeOrExpend(option.incomeOrExpend)
      this.bkMoney = option.bkMoney
      this.bkType = option.bkType
      this.bkRemark = option.bkRemark
      this.bkDate = option.bkDate
    }
  },

  methods: {
    // 更改收入或支出选择
    changeIncomeOrExpend (iOe) {
      if (iOe === 'income') {
        this.incomeOrExpend = 'income'
        this.bkTypeArray = this.$bkTypeTo.incomeArray
        this.bkType = this.bkTypeArray[0]
      } else {
        this.incomeOrExpend = 'expend'
        this.bkTypeArray = this.$bkTypeTo.expendArray
        this.bkType = this.bkTypeArray[0]
      }
    },
    // 输入金额
    inputBkMoney (e) {
      this.bkMoney = e.mp.detail.value
      if (this.bkMoney === '.') { // 金额首位不能为小数点
        this.bkMoney = null
        return
      }
      if (!(/^(\d?)+(\.\d{0,2})?$/.test(this.bkMoney))) { // 金额小数点后不能大于两位数字
        this.bkMoney = this.bkMoney.substr(0, this.bkMoney.length - 1)
      }
    },
    // 更改类型
    changeBkType (bt) {
      if (bt !== null) {
        this.bkType = bt
      } else {
        this.bkType = this.bkTypeArray[0]
      }
    },
    // 输入备注
    inputBkRemark (e) {
      this.bkRemark = e.mp.detail.value
    },
    // 更改日期
    changeBkDate () {
      var year = this.dateTimeArray[0][this.dateTime[0]]
      var month = this.dateTimeArray[1][this.dateTime[1]]
      var day = '01'
      if (this.dateTimeArray[2].length > this.dateTime[2]) {
        day = this.dateTimeArray[2][this.dateTime[2]]
      }
      var hour = this.dateTimeArray[3][this.dateTime[3]]
      var minute = this.dateTimeArray[4][this.dateTime[4]]
      this.bkDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    },
    // 保存账单
    saveBookkeeping () {
      if (this.bkMoney === null || this.bkMoney === '') {
        wx.showToast({
          title: '金额不可为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (Number(this.bkMoney) === 0 || this.bkMoney === '.' || !(/^(\d?)+(\.\d{0,2})?$/.test(this.bkMoney))) {
        wx.showToast({
          title: '金额有误',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.id === 0) this.id = null
      this.$wxRequest.post({
        url: 'bookkeeping/save',
        data: {
          'id': this.id,
          'incomeOrExpend': this.incomeOrExpend,
          'bkMoney': this.bkMoney,
          'bkType': this.bkType,
          'bkRemark': this.bkRemark,
          'bkDate': this.bkDate
        },
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          wx.navigateBack()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
        })
    },
    changeDateTime (e) {
      this.dateTime = e.mp.detail.value
      this.changeBkDate()
    },
    changeDateTimeColumn (e) {
      var arr = this.dateTime
      var dateArr = this.dateTimeArray
      arr[e.mp.detail.column] = e.mp.detail.value
      dateArr[2] = this.$dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])
      this.dateTime = arr
      this.dateTimeArray = dateArr
      this.changeBkDate()
    }
  }
}
</script>

<style>
  .typeList{
    display: flex;
    overflow-y: scroll;
    white-space: nowrap;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
  }
  .typeList .typeListItem{
    align-items: center;
    text-align: center;
    flex: 0 0 100rpx;
    height: 100%;
  }
</style>

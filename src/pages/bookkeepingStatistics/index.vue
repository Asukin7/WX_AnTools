<template>
  <div>

    <div class="cu-card case">
      <div class="cu-item shadow">
        <div class="statis">
          <div class="statis_head flex">
            <div class="flex flex-sub flex-direction solid-right">
              <picker mode="date" :fields="yearOrMonth" :value="bkDateStr" :start="startDate" :end="endDate" @change="dateChange($event)">
                <div class="picker">
                  {{bkDateStr}}<text class="cuIcon-triangledownfill"/>
                </div>
              </picker>
            </div>
            <div class="flex flex-sub flex-direction">
              <div>
                <div class="cu-btn round sm margin-left-sm" :class="yearOrMonth=='year'?'line-green':'line-grey'" @click="setYearOrMonth('year')">年</div>
                <div class="cu-btn round sm margin-left-sm" :class="yearOrMonth=='month'?'line-orange':'line-grey'" @click="setYearOrMonth('month')">月</div>
              </div>
            </div>
          </div>
          <div class="statis_body" v-if="yearOrMonth=='year'">
            <mpvue-echarts lazyLoad :echarts="echarts" :onInit="barInit" canvasId="bar" ref="barEcharts"/>
          </div>
          <div class="statis_body" v-if="yearOrMonth=='month'">
            <mpvue-echarts lazyLoad :echarts="echarts" :onInit="lineInit" canvasId="line" ref="lineEcharts"/>
          </div>
          <div class="statis_foot flex text-grey">
            <div class="flex flex-sub flex-direction solid-right">
              <text>共支出：<text class="text-green">￥{{expendSumMoneyComputed}}</text></text>
            </div>
            <div class="flex flex-sub flex-direction">
              <text>共收入：<text class="text-orange">￥{{incomeSumMoneyComputed}}</text></text>
            </div>
          </div>
        </div>
      </div>

      <div class="cu-item shadow">
        <div class="statis">
          <div class="statis_head flex">
            <div class="flex flex-sub flex-direction solid-right">
              分布情况
            </div>
            <div class="flex flex-sub flex-direction">
              <div>
                <div class="cu-btn round sm margin-left-sm" :class="incomeOrExpend=='expend'?'line-green':'line-grey'" @click="setIncomeOrExpend('expend')">支出</div>
                <div class="cu-btn round sm margin-left-sm" :class="incomeOrExpend=='income'?'line-orange':'line-grey'" @click="setIncomeOrExpend('income')">收入</div>
              </div>
            </div>
          </div>
          <div class="statis_body">
            <div class="text-center text-grey" style="padding: 160rpx 0;margin-bottom: 160rpx;" v-if="cnTypeList.length==0">暂无数据</div>
            <mpvue-echarts lazyLoad :echarts="echarts" :onInit="pieInit" canvasId="pie" ref="pieEcharts"/>
          </div>
        </div>
        <div class="cu-list menu-avatar">
          <div class="cu-item" v-for="(item,index) in enTypeList" :key="index" @click="openBookkeepingList(item)">
            <div class="cu-avatar round lg" :style="{'background-color':color[index%20]}">
              <text :class="bkTypeTo[item.name].icon" style="font-size:x-large;"></text>
            </div>
            <div class="content flex-sub">
              <div class="flex justify-between text-l">
                <div>
                  <text>{{bkTypeTo[item.name].name}}</text>
                </div>
                <div>
                  <text>￥{{item.value}}</text>
                </div>
              </div>
              <div class="flex">
                <div class="cu-progress round sm">
                  <div :style="{'background-color':color[index%20],width:((item.value/(incomeOrExpend=='income'?incomeSumMoney:expendSumMoney)*100)+'%')}"></div>
                </div>
              </div>
            </div>
            <div :class="index==enTypeList.length-1?'':'list_border'"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from 'mpvue-echarts'
let barChart, lineChart, pieChart

export default {
  data () {
    return {
      // 发送的数据
      bkDateStr: null,
      // 接收的数据
      monthsSumMoney: null,
      daysSumMoney: null,
      typeSumMoney: null,
      // 接收处理后的数据
      incomeSumMoney: null,
      expendSumMoney: null,
      enTypeList: [],
      cnTypeList: [],
      // 工具数据
      yearOrMonth: null,
      incomeOrExpend: null,
      startDate: '2019-01',
      endDate: null,
      monthDay: null,
      bkTypeTo: null,
      color: null,
      echarts,
      barOption: null,
      lineOption: null,
      pieOption: null
    }
  },

  components: {
    mpvueEcharts
  },

  computed: {
    expendSumMoneyComputed () {
      return Number(this.expendSumMoney).toFixed(2)
    },
    incomeSumMoneyComputed () {
      return Number(this.incomeSumMoney).toFixed(2)
    }
  },

  onLoad: function () {
    this.bkTypeTo = this.$bkTypeTo.bkTypeTo
    this.color = ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FF84BA', '#CCCCFF', '#D1ABC0', '#BA79B1', '#9966CC', '#B50079', '#DE3163', '#FE4C40', '#F3715C', '#FF9F7F', '#FEDCBD', '#EEE8AA', '#FFDB5C', '#7FB80E', '#6BB073', '#7CFC00']
    this.yearOrMonth = 'year'
    this.incomeOrExpend = 'expend'
    setTimeout(() => this.setYearOrMonth(this.yearOrMonth), 500)
  },

  methods: {
    // 获取某年每月收支总额
    getMonthsSumMoney () {
      this.$wxRequest.post({
        url: 'bookkeeping/listMonthsSumMoney',
        data: {
          'bkDateStr': this.bkDateStr
        },
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.monthsSumMoney = res.data
          this.incomeSumMoney = this.nameValueListToSumValue(this.monthsSumMoney.incomeMonthsList)
          this.expendSumMoney = this.nameValueListToSumValue(this.monthsSumMoney.expendMonthsList)
          this.setBarOption()
        })
    },
    // 获取某月每日收支总额
    getDaysSumMoney () {
      this.$wxRequest.post({
        url: 'bookkeeping/listDaysSumMoney',
        data: {
          'bkDateStr': this.bkDateStr
        },
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.daysSumMoney = res.data
          this.incomeSumMoney = this.nameValueListToSumValue(this.daysSumMoney.incomeDaysList)
          this.expendSumMoney = this.nameValueListToSumValue(this.daysSumMoney.expendDaysList)
          this.setLineOption()
        })
    },
    // 获取各类型收支总额
    getTypeSumMoney () {
      this.$wxRequest.post({
        url: 'bookkeeping/listTypeSumMoney',
        data: {
          'bkDateStr': this.bkDateStr
        },
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.TypeSumMoney = res.data
          this.setIncomeOrExpend(this.incomeOrExpend)
        })
    },
    // 搜索日期更改
    dateChange (e) {
      this.bkDateStr = e.mp.detail.value
      if (this.yearOrMonth === 'month') {
        this.monthDay = this.getMonthDay(Number(this.bkDateStr.split('-')[0]), Number(this.bkDateStr.split('-')[1]))
        this.getDaysSumMoney()
      } else {
        this.getMonthsSumMoney()
      }
      this.getTypeSumMoney()
    },
    // 设置搜索日期最小单位
    setYearOrMonth (yOm) {
      var now = new Date()
      if (yOm === 'month') {
        this.yearOrMonth = 'month'
        this.bkDateStr = this.endDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2)
        this.monthDay = this.getMonthDay(Number(this.bkDateStr.split('-')[0]), Number(this.bkDateStr.split('-')[1]))
        this.getDaysSumMoney()
      } else {
        this.yearOrMonth = 'year'
        this.bkDateStr = this.endDate = now.getFullYear()
        this.getMonthsSumMoney()
      }
      this.getTypeSumMoney()
    },
    // 设置显示收入或支出
    setIncomeOrExpend (iOe) {
      if (iOe === 'income') {
        this.incomeOrExpend = 'income'
        this.enTypeList = this.TypeSumMoney.incomeTypeList
        this.cnTypeList = this.nameValueListNameEnToCn(this.enTypeList)
        this.setPieOption()
      } else {
        this.incomeOrExpend = 'expend'
        this.enTypeList = this.TypeSumMoney.expendTypeList
        this.cnTypeList = this.nameValueListNameEnToCn(this.enTypeList)
        this.setPieOption()
      }
    },
    // 打开账单列表页面
    openBookkeepingList (data) {
      var str = null
      if (data !== null) {
        str = '?incomeOrExpend=' + this.incomeOrExpend + '&bkType=' + data.name + '&bkDateStr=' + this.bkDateStr
      }
      wx.navigateTo({
        url: '../bookkeepingList/main' + str
      })
    },
    // 数据nameValueList格式转换
    nameValueListToArrayList (nameValueList) {
      var arrayList = []
      for (var i = 0; i < nameValueList.length; i++) {
        var array = []
        array.push(nameValueList[i].name)
        array.push(nameValueList[i].value)
        arrayList.push(array)
      }
      return arrayList
    },
    // 数据nameValueList求总值Value
    nameValueListToSumValue (nameValueList) {
      var sumValue = 0
      for (var i = 0; i < nameValueList.length; i++) {
        sumValue += nameValueList[i].value
      }
      return sumValue
    },
    // 数据nameValueList英转中Name
    nameValueListNameEnToCn (nameValueList) {
      var tempList = []
      for (var i = 0; i < nameValueList.length; i++) {
        tempList.push({
          name: this.bkTypeTo[nameValueList[i].name].name,
          value: nameValueList[i].value
        })
      }
      return tempList
    },
    getLoopArray (start, end) {
      var start0 = (start || 0)
      var end0 = (end || 1)
      var array = []
      for (var i = start0; i <= end0; i++) {
        array.push(String(i))
      }
      return array
    },
    getMonthDay (year, month) {
      var flag = (((year % 400) === 0) || (((year % 4) === 0) && ((year % 100) !== 0)))
      var array = null
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          array = this.getLoopArray(1, 31)
          break
        case 4:
        case 6:
        case 9:
        case 11:
          array = this.getLoopArray(1, 30)
          break
        case 2:
          array = flag ? this.getLoopArray(1, 29) : this.getLoopArray(1, 28)
          break
        default:
          array = '月份格式不正确，请重新输入！'
      }
      return array
    },
    setBarOption () {
      this.barOption = {
        color: ['#39b54a', '#f37b1d'],
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          icon: 'circle',
          data: ['支出', '收入']
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#8799a3'
              }
            },
            axisTick: {show: false},
            axisLabel: {color: '#8799a3'},
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false,
            axisLabel: {show: false}
          }
        ],
        series: [
          {
            name: '支出',
            type: 'bar',
            barWidth: 6,
            data: this.nameValueListToArrayList(this.monthsSumMoney.expendMonthsList)
          },
          {
            name: '收入',
            type: 'bar',
            barWidth: 6,
            data: this.nameValueListToArrayList(this.monthsSumMoney.incomeMonthsList)
          }
        ]
      }
      this.$refs.barEcharts.init()
    },
    barInit (canvas, width, height) {
      barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(barChart)
      barChart.setOption(this.barOption)
      return barChart
    },
    setLineOption () {
      this.lineOption = {
        color: ['#39b54a', '#f37b1d'],
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['支出', '收入']
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#8799a3'
            }
          },
          axisTick: {show: false},
          axisLabel: {color: '#8799a3'},
          data: this.monthDay
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#8799a3'
            }
          },
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {color: '#8799a3'}
        },
        series: [
          {
            name: '支出',
            type: 'line',
            smooth: true,
            data: this.nameValueListToArrayList(this.daysSumMoney.expendDaysList)
          }
        ]
      }
      this.$refs.lineEcharts.init()
    },
    lineInit (canvas, width, height) {
      lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(lineChart)
      lineChart.setOption(this.lineOption)
      return lineChart
    },
    setPieOption () {
      this.pieOption = {
        color: this.color,
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          type: 'scroll',
          icon: 'circle'
        },
        series: [
          {
            type: 'pie',
            label: {
              normal: {
                show: true,
                formatter: '{d}%',
                fontSize: 10
              }
            },
            center: ['50%', '55%'],
            radius: ['30%', '60%'],
            data: this.cnTypeList,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 2, 2, 0.3)'
              }
            }
          }
        ]
      }
      this.$refs.pieEcharts.init()
    },
    pieInit (canvas, width, height) {
      pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(pieChart)
      pieChart.setOption(this.pieOption)
      return pieChart
    }
  }
}
</script>

<style scoped>
  .statis {
    background-color: #fff;
    width: 100%;
  }
  .statis_head {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    height: 100rpx;
    padding: 30rpx;
  }
  .statis_body {
    width: 100%;
    height: 440rpx;
    padding-top: 30rpx;
  }
  .statis_foot {
    text-align: center;
    width: 100%;
    height: 100rpx;
    padding: 30rpx;
  }
  .list_border {
    position: fixed;
    width: 80%;
    border-bottom: 1px solid #f0f0f0;
    bottom: 1px;
  }
</style>

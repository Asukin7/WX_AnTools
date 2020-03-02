<template>
  <div>

    <div class="margin-xl bg-white padding-xl radius shadow-lg about" @click="caidan()">
      <div class="text-xl text-bold text-center margin-bottom-sm">关于软件</div>
      <div class="text-df text-left margin-bottom-sm">Hi！~ 欢迎使用本记账软件！</div>
      <div class="text-df text-left margin-bottom-sm">该软件是<text :class="number==1?'text-blue':''">我</text>个人学习与自用的一个项目。</div>
      <div class="text-df text-left margin-bottom-sm">该软件主要强调简洁高效，功能<text :class="number==3?'text-orange':number==4?'text-yellow':''">包</text>括最简单的新建、修改、删除、查找账单的功能，此外还有简易的年月账单数据统计功能。</div>
      <div class="text-df text-left margin-bottom-sm">该软件为开源项目，项目已上传至GitHub。</div>
      <div class="text-df text-left margin-bottom-sm">该软件使用的组件包括mpvue、colorUi、echarts，另外特别感谢ZeroS在上一个版本的共同开发。</div>
      <div class="text-df text-left margin-bottom-sm">该软件服务器为腾讯学生机，因此可能存在数据传输过慢的问题。</div>
      <div class="text-df text-left margin-bottom-sm">此外，该软件可能还存在许多不足的地方，欢迎大家提出。<text :class="number==2?'text-red':''">喜欢</text>该软件的朋友也可以打赏作者，请作者喝杯奶茶。</div>
      <div class="text-df text-left margin-bottom-sm"></div>
      <div class="text-sm text-right">Asukin7</div>
      <div class="text-sm text-right">V1.0.200303</div>
    </div>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: false,
      number: null,
      firstNumber: null,
      secondNumber: null,
      thirdNumber: null
    }
  },

  onLoad: function () {
    this.flag = false
    this.number = 0
    this.firstNumber = this.secondNumber = this.thirdNumber = 0
  },

  methods: {
    caidan () {
      if (this.flag === true) {
        this.number++
        if (this.number === 4) {
          this.flag = false
        }
        return
      }
      if (this.number === 4 && this.firstNumber === 8 && this.secondNumber === 1 && this.thirdNumber === 7) {
        this.flag = false
        this.number = 0
        this.firstNumber = this.secondNumber = this.thirdNumber = 0
        return
      }
      if (this.firstNumber !== 8) {
        this.firstNumber++
      } else if (this.firstNumber === 8 && this.secondNumber !== 1) {
        this.secondNumber++
      } else if (this.firstNumber === 8 && this.secondNumber === 1 && this.thirdNumber !== 7) {
        this.thirdNumber++
      }
      if (this.firstNumber === 8 && this.secondNumber === 0 && this.thirdNumber === 0) {
        wx.showToast({
          title: '╭(●｀∀´●)╯世界',
          icon: 'none',
          duration: 2000
        })
      } else if (this.firstNumber === 8 && this.secondNumber === 1 && this.thirdNumber === 0) {
        wx.showToast({
          title: '٩(//̀Д/́/)۶第一',
          icon: 'none',
          duration: 2000
        })
      } else if (this.firstNumber === 8 && this.secondNumber === 1 && this.thirdNumber === 7) {
        wx.showToast({
          title: '(๑＞ڡ＜)☆可爱',
          icon: 'none',
          duration: 2000
        })
      }
      if (this.firstNumber === 8 && this.secondNumber === 1 && this.thirdNumber === 7) {
        this.flag = true
      }
    }
  }
}
</script>

<style>
  .about {
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
</style>

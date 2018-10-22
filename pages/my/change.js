// pages/my/change.js
const https = require('../../util/douban.js')
const apiUrl = require('../../config.js').apiUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '请输入内容',
    changeWhat: '',
    titleArray: {
      name: "姓名",
      num: "学号",
      tel: "手机号",
      school: "学校",
      sex: "性别",
      enter_year: "入学年份"
    },
    sexArray: {
      0: '未知',
      1: '男',
      2: '女'
    },
    tmp: '',
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      changeWhat: options.change,
      placeholder: '请输入' + this.data.titleArray[options.change],
      value: options.value
    })
    wx.setNavigationBarTitle({
      title: '修改' + this.data.titleArray[options.change],
    })
    if (options.change == 'sex') {
      this.setData({
        value: this.data.sexArray[options.value]
      })
    }
  },

  valueChange: function (res) {
    this.setData({
      tmp: res.detail.value
    })
    console.log(res)
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      tmp: e.detail.value.input
    })
    if (e.detail.value.input == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    }
    if (this.data.changeWhat == 'tel') {
      let myreg = /^\d{8,11}$/;
      if (!myreg.test(e.detail.value.input)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      wx.request({
        url: apiUrl,
        header: {
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.student.telSet',
          tel: e.detail.value.input,
        },
        success: res => {
          console.log(res)
        }
      })
    }
    if (this.data.changeWhat == 'num') {
      let myreg = /^\d{7,11}$/;
      if (!myreg.test(e.detail.value.input)) {
        wx.showToast({
          title: '请输入正确的学号',
          icon: 'none'
        })
        return
      }
      wx.request({
        url: apiUrl,
        header: {
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.student.numberSet' ,
          number: e.detail.value.input,
        },
        success: res => {
          console.log(res)
        }
      })
    }
    if (this.data.changeWhat == 'name') {
      wx.request({
        url: apiUrl,
        header: {
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.student.name',
          name: e.detail.value.input,
        },
        success: res => {
          console.log(res)
        }
      })
    }
    if (this.data.changeWhat == 'sex') {
      if (e.detail.value.input == '男') {
        this.setData({
          tmp: 1
        })
      } else if (e.detail.value.input == '女') {
        this.setData({
          tmp: 2
        })
      } else if (e.detail.value.input == '未知') {
        this.setData({
          tmp: 0
        })
      } else {
        wx.showToast({
          title: "请输入'男'，'女'或'未知'",
          icon: 'none'
        })
        return
      }
      wx.request({
        url: apiUrl,
        header: {
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.student.sexSet',
          sex: this.data.tmp,
        },
        success: res => {
          console.log(res)
        }
      })
    }
    wx.navigateBack({
      
    })
  }

})
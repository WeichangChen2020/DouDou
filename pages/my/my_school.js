const apiUrl = require('../../config.js').apiUrl;
Page({
  data: {
    inputShowed: false,   //判断是否显示输入框
    schoolsEmpty: false,  //判断搜索结果是否为空
    inputVal: "",         //存放输入内容
    schools: [],          //存放搜索结果
    // allSchools: [],
  },
  onLoad: function() {
    // wx.request({
    //   url: apiUrl,
    //   header: {
    //     'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
    //   },
    //   data: {
    //     method: 'pingshifen.school.listAll',
    //   },
    //   success: res => {
    //     this.setData({
    //       allSchools: res.data.data
    //     });
    //   }
    // })
  },
  showInput: function() {
    this.setData({
      inputShowed: true,
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false,
      showAllShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  searchSchool: function(e) {
    if (this.data.inputVal != '') {
      wx.request({
        url: apiUrl,
        header: {
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.school.search',
          s_name: this.data.inputVal,
        },
        success: res => {
          this.setData({
            schools: res.data.data,
          });
          //如果搜索结果为空
          if (res.data.data == null) {
            this.setData({
              schoolsEmpty: true,
            })
          } else {
            this.setData({
              schoolsEmpty: false,
            })
          }
        }
      })
    } else {
      //如果输入为空，则显示所有学校
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        showAllShowed: true
      })
      wx.request({
        url: apiUrl,
        header: {
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.school.listAll',
          s_name: e.detail.value,
        },
        success: res => {
          this.setData({
            schools: res.data.data,
            schoolsEmpty: false,
          });
          wx.hideLoading()
          wx.hideNavigationBarLoading()
        }
      })
    }
    console.log(this.data);
  },

  tapSelect: function(e) {
    let selectedSchool = e.currentTarget.dataset.currentSchool;
    if (selectedSchool) {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        school: selectedSchool
      })
      wx.navigateBack()
    }
  },
});
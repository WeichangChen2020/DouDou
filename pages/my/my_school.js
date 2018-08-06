const apiUrl = require('../../config.js').apiUrl;
Page({
  data: {
    inputShowed: false,
    showAllShowed: false,
    inputVal: "",
    schools:[
    ],
    allSchools:[]
  },
  onLoad:function(){
    wx.request({
      url: apiUrl,
      header: { 'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID') },
      data: {
        method: 'pingshifen.school.listAll',
      },
      success: res => {
        this.setData({
          allSchools: res.data.data
        });
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      showAllShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    console.log(e)
    if(e.detail.value == ''){
      this.setData({
        showAllShowed: true
      })
    } else {
      this.setData({
        showAllShowed: false
      })
    }
    this.setData({
      inputVal: e.detail.value
    });
    wx.request({
      url: apiUrl,
      header: {'Cookie':'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')},
      data:{
        method:'pingshifen.school.search',
        s_name: e.detail.value,
      },
      success: res => {
        this.setData({
          schools: res.data.data
        });
      }
    })
  },
  search: function (e) {
    // let result = [], i = 0;
    // let temp = this.data.allSchools;
    // console.log(e);
    // while( i < temp.length){
    //   if(temp[i]['name'].indexOf(e) != -1){
    //     result.push(temp[i]);
    //   }
    //   i++;
    // }
    // this.setData({
    //   school:result
    // })
    // console.log(this.data);
  },
  tapSelect: function(e) {
    let selectedSchool = e.currentTarget.dataset.currentSchool;
    if (selectedSchool) {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        school: selectedSchool
      })
      wx.navigateBack()
    }
  },
  showAll: function (e) {
    wx.showNavigationBarLoading()
    wx.showLoading({ title: '加载中', })
    this.setData({
      showAllShowed: true
    })
    wx.request({
      url: apiUrl,
      header: { 'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID') },
      data: {
        method: 'pingshifen.school.listAll',
        s_name: e.detail.value,
      },
      success: res => {
        this.setData({
          schools: res.data.data
        });
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    })
    console.log(this.data)
  },
});
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // translateX，其指定的距离不可控，正负两个位置移动时，ios会跳到未知位置，改用translate
  // translationend 事件是每一个step结束都会触发一次，但是 duration=0 时，动作结束不会触发 translationend 事件
  // 每次 createAnimation() 时都是以当前位置作为原点，对象不换，原点不变
  speed: 10, // 每px耗时10ms
  strLen: 240,
  boundingWidth: 240,
  currentAnimation: null,
  onReady: function () {
    console.log('首次动画--------------->')
    this.currentAnimation = wx.createAnimation({duration: (this.strLen) * this.speed, timingFunction: 'linear'});
    this.currentAnimation.translate(-this.strLen, 0).step()
    this.setData({
      animationData: this.currentAnimation.export()
    })
  },
  animationendHandle (event) {
    let that = this
    console.log('动画完成，触发事件：', event)
    that.currentAnimation.translate(0, 0).step({duration: 0})
      
    that.setData({
      animationData: that.currentAnimation.export()
    }, ()=>{
      console.log('setdata 回调')
      // let animation = wx.createAnimation({ duration: (that.strLen) * that.speed, timingFunction: 'linear' });    
      that.currentAnimation.translate(-this.strLen, 0).step({ duration: that.strLen * that.speed, timingFunction: 'linear' })
      that.setData({
        animationData: that.currentAnimation.export()
      })
    })
  }

  // animationendHandleTest (event) {
    // console.log('动画完成，触发事件：', event, this.flag)
    // if(this.flag === 0) {
    //   // 左移完成，触发右归
    //   let leftAnimation = wx.createAnimation({duration: 0, timingFunction: 'step-start'}).translate(0, 0).step()
    //   this.setData({
    //     animationData: leftAnimation.export()
    //   }, ()=>{
    //     this.flag = 1
    //   })
    // } else {
    //   // 右归完成，触发左移
    //   let rightAnimation = wx.createAnimation({duration: (this.strLen + this.boundingWidth) * this.speed, timingFunction: 'linear'})
    //     .translateX(-this.strLen - this.boundingWidth).step()
    //   this.setData({
    //     animationData: rightAnimation.export()
    //   }, ()=>{
    //     this.flag = 0
    //   })
    // }
  // }
  
  // marqueeOverall (strLen, boundingWidth) {
  //   let speed = 10 // 每px耗时10ms
  //   let ani = wx.createAnimation().translateX(boundingWidth).step({duration: 500, timingFunction: 'step-start', delay: 10})
  //     .translateX(-strLen).step({duration: (strLen + boundingWidth) * speed, timingFunction: 'linear'})
  //   this.setData({
  //     animationData: ani.export()
  //   })
  // },
  // marquee (strLen, boundingWidth) {
  //   let speed = 10 // 每px耗时10ms
  //   console.log('首次动画--------------->', strLen, boundingWidth)
  //   let animation = wx.createAnimation().translateX(-strLen).step({duration: strLen * speed, timingFunction: 'linear'})
  //   this.setData({
  //     animationData: animation.export()
  //   })
  //   console.log('添加监听器--------------->', strLen, boundingWidth)
  //   wx.createIntersectionObserver()
  //     .relativeToViewport('.notice-marquee', {left: 0, right: 0}).observe('.notice-item', (res) => {
  //       console.log('监听成功--------------->', res.intersectionRatio)
  //       // 相交区域占目标节点的布局区域的比例
  //       if (res.intersectionRatio  === 0) {
  //         // 不相交，表示text滚出视野，就重新开始一个动画
  //         let animation = wx.createAnimation().translateX(boundingWidth).step({duration: 1, timingFunction: 'step-start', delay: 50})
  //           .translateX(-strLen - 2).step({duration: (strLen + boundingWidth + 2) * speed, timingFunction: 'linear'})
  //         this.setData({
  //           animationData: animation.export()
  //         })
  //       }
  //     })
  // }
})

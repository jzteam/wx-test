
Component({
  data: {
    marqueeDistance: 0,
    animationData: null
  },
  animation: null,
  pageLifetimes: {
    show () {
      console.log('show------')
      // this.loopRunMarquee()
      this.setData({
        marqueeDistance: 50 * 2
      })
    },
    hide () {
      console.log('hide------')
    }
  },
  ready () {
    console.log('ready-----start')
    // this.marqueeAnimation(240, 240)
    // this.marquee(240, 240)
    console.log('ready-----end')
  },
  methods: {
    getRect (selector, all) {
      return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery().in(this)
        query.select(selector).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
          if (res) {
            if (all) {
              resolve(res[0].all)
            } else {
              resolve(res[0])
            }
          }
        })
      })
    },
    async loopRunMarquee () {
      try {
        let res = await this.getRect('.notice-item')
        // let windowWidth = wx.getSystemInfoSync().windowWidth
        // let leftTemp = (windowWidth - res.width) / 2
        console.log('loopRunMarquee---->', res)
        let strLen = this.data.notice && this.data.notice.object_value.length * 12
        if (res.width <= strLen) {
          this.marqueeAnimation(strLen, res.width)
        }
      } catch (error) {
      }
    },
    marqueeAnimation (strLen, boundingWidth) {
      let speed = 10 // 每px耗时10ms
      this.animation = wx.createAnimation()
      this.animation.translateX(0).step({duration: 1, timingFunction: 'step-start'})
        .translateX(-strLen).step({duration: strLen * speed, timingFunction: 'linear'})
        .translateX(boundingWidth).step({duration: 1, timingFunction: 'step-start'})
        .translateX(0).step({ duration: boundingWidth * speed, timingFunction: 'linear' })
      this.setData({
        animationData: this.animation.export()
      })
      this.timer = setInterval(() => {
        this.animation.translateX(0).step({duration: 1, timingFunction: 'step-start'})
          .translateX(-strLen).step({duration: strLen * speed})
          .translateX(boundingWidth).step({duration: 1, timingFunction: 'step-start'})
          .translateX(0).step({ duration: boundingWidth * speed, timingFunction: 'linear' })
        this.setData({
          animationData: this.animation.export()
        })
      }, (strLen + boundingWidth) * speed + 10)
    },
    marquee (strLen, boundingWidth) {
      let speed = 10 // 每px耗时10ms
      console.log('首次动画--------------->', strLen, boundingWidth)
      let animation = wx.createAnimation().left(-strLen).step({duration: strLen * speed, timingFunction: 'linear'})
      this.setData({
        animationData: animation.export()
      })
      console.log('添加监听器--------------->', strLen, boundingWidth)
      wx.createIntersectionObserver()
        .relativeToViewport('.notice-marquee', {right: 100}).observe('.notice-text', (res) => {
          console.log('监听成功--------------->', res.intersectionRatio)
          // 相交区域占目标节点的布局区域的比例
          if (res.intersectionRatio  === 0) {
            // 不相交，表示text滚出视野，就重新开始一个动画
            let animation = wx.createAnimation().left(boundingWidth).step({duration: 1, timingFunction: 'step-start', delay: 50})
              .left(-strLen - boundingWidth - 2).step({duration: (strLen + boundingWidth + 2) * speed, timingFunction: 'linear'})
            this.setData({
              animationData: animation.export()
            })
          }
        })
    }
  }
})

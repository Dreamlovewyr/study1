;(function($){
   var Carousel=function(poster){
      var self=this;
    // 保存单个旋转木马对象
     this.poster=poster;
     this.posterItemMain=poster.find("ul.poster-list");
     this.nextBtn=poster.find("div.poster-next-btn");
     this.preBtn=poster.find("div.poster-pre-btn");
     this.posterItems=poster.find("li.poster-item");
     if (this.posterItems.size()%2==0) {
        this.posterItemMain.append(this.posterItems.eq(0).clone());
        this.posterItems=this.posterItemMain.children();
     }
     this.posterFirstItem=this.posterItems.eq(0);
     this.posterLastItem=this.posterItems.last();
     this.rotateFlag=true;
      //默认配置参数
      this.setting={
          "width":1000,             //幻灯片高度
          "height":270,             //幻灯片宽度
          "posterWidth":1000,       //幻灯片第一帧的高度
          "posterHeight":270,       //幻灯片第一帧的宽度
          "scale":0.9,
          "autoplay":false,
          "delay":2000,
          "speed":500,
          "verticalAlign":"middle"
      }
    $.extend(this.setting,this.getSetting());
    //console.log(this.setting);
      //设置配置参数值
    this.setSettingValue();
    this.setPosterpos();
    this.preBtn .click(function(){
      if (self.rotateFlag) {
         self.rotateFlag=false;
         self.carouselRotate("right");
      };
    });

    this.nextBtn .click(function(){
      if (self.rotateFlag) {
         self.rotateFlag=false;
         self.carouselRotate("left");
      };
    });

    if (this.setting.autoplay) {
        this.autoplay();
        this.poster.hover(function(){
           window.clearInterval(self.timer);
        },function(){
           self.autoplay();
        })
    }

   };
      Carousel.prototype={
       // 自动播放
       autoplay:function(){
        var self=this;
       this.timer=window.setInterval(function(){
            self.nextBtn.click();
          },this.setting.delay);
       },

       //旋转
        carouselRotate:function(dir){
          var _this_=this,
              zIndexArr=[];
            if (dir==="left") {
              this.posterItems.each(function(i){
                  var self=$(this),
                      prev=self.prev().get(0)?self.prev():_this_.posterLastItem,
                      width=prev.width(),
                      height=prev.height(),
                      zIndex=prev.css("zIndex"),
                      top=prev.css("top"),
                      opacity=prev.css("opacity"),
                      left=prev.css("left");
                      zIndexArr.push(zIndex);
                 self.animate({
                     width:width,
                     height:height,
                     // zIndex:zIndex,
                     top:top,
                     opacity:opacity,
                     left:left
                 },_this_.setting.speed,function(){
                     _this_.rotateFlag=true;
                 });
              });
              this.posterItems.each(function(i){
                  $(this).css("zIndex",zIndexArr[i]);
              })
            }else if (dir==="right") {
                 this.posterItems.each(function(i){
                     var self=$(this),
                         next=self.next().get(0)?self.next():_this_.posterFirstItem,
                         width=next.width(),
                         height=next.height(),
                         zIndex=next.css("zIndex"),
                         top=next.css("top"),
                         opacity=next.css("opacity"),
                         left=next.css("left");
                         zIndexArr.push(zIndex);
                    self.animate({
                        width:width,
                        height:height,
                        // zIndex:zIndex,
                        top:top,
                        opacity:opacity,
                        left:left
                    },_this_.setting.speed,function(){
                      _this_.rotateFlag=true;
                    });

                 });
                 this.posterItems.each(function(i){
                     $(this).css("zIndex",zIndexArr[i]);
                 })

            }
        },

       //设置配置参数值去控制基本的高度宽度
        setSettingValue:function(){
            this.poster.css({
                width:this.setting.width,
                height:this.setting.height
            });

            this.posterItemMain.css({
                width:this.setting.width,
                height:this.setting.height
            });
        //计算左右切换按钮的宽度
        var w=(this.setting.width-this.setting.posterWidth)/2;
        this.nextBtn.css({
            width:w,
            height:this.setting.height,
          zIndex:Math.ceil(this.posterItems.size()/2)
        });
        this.preBtn.css({
            width:w,
            height:this.setting.height,
          zIndex:Math.ceil(this.posterItems.size()/2)
        });
        this.posterFirstItem.css({
            left:w,
          zIndex:Math.floor(this.posterItems.size()/2),
          width:this.setting.posterWidth,
          height:this.setting.posterHeight
        });
        },

       // 设置剩余帧的位置关系
         setPosterpos:function(){
             var sliceItems=this.posterItems.slice(1),
                 slicesize=sliceItems.size()/2,
                 rightslice=sliceItems.slice(0,slicesize),
                 level=Math.floor(this.posterItems.size()/2),
                 self=this,
                 rw=this.setting.posterWidth,
                 rh=this.setting.posterHeight,
                 FirstLeft=(this.setting.width-this.setting.posterWidth)/2,
                 FixedOffsetLeft=this.setting.posterWidth+FirstLeft,
                 gap=FirstLeft/level;

        // 设置右边帧的位置关系，高度、宽度和top
             rightslice.each(function(i){
                 level--;
                 rw=rw*self.setting.scale;
                 rh=rh*self.setting.scale;
                 var j=i;
                 $(this).css({
                  zIndex:level,
                  width:rw,
                  height:rh,
                  opacity:1/++j,
                  left:FixedOffsetLeft+(++i)*gap-rw,
                  top:self.setVerticalAlign(rh)
                 })
             });
          
          // 设置左边帧的位置关系，高度、宽度和top

             var leftslice=sliceItems.slice(slicesize),
                 lw=rightslice.last().width(),
                 lh=rightslice.last().height(),
                 loop=Math.floor(this.posterItems.size()/2);
             leftslice.each(function(i){
                 $(this).css({
                  zIndex:i,
                  width:lw,
                  height:lh,
                  opacity:1/loop,
                  left:i*gap,
                  top:self.setVerticalAlign(lh)
                 });
                 loop--;
                 lw=lw/self.setting.scale;
                 lh=lh/self.setting.scale;
                
             });

         },

         //设置垂直排列对齐
         setVerticalAlign:function(height){
                   var verticalType=this.setting.verticalAlign,
                       top=0;
                   if (verticalType==="middle") {
                       top=(this.setting.height-height)/2;
                   }else if (verticalType==="top") {
                       top=0;
                   }else if (verticalType==="bottom") {
                       top= this.setting.height-height;
                   }else{
                       top=(this.setting.height-height)/2;
                   }
                   return top;
              },
       //获取人工配置参数
       getSetting:function(){
          var setting=this.poster.attr('data-setting');
          if (setting&&setting!='') {
            return $.parseJSON(setting);
          }else{
            return {};
          }
          // return setting;
      }
   }
   Carousel.init=function(posters){
      var _this_=this;
      posters.each(function(){
         new _this_($(this));
      });
   }
   window['Carousel']=Carousel;
})(jQuery)
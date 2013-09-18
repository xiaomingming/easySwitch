var SimpleSlide=function(options){
    this.container=options.container;
    this.slideList=this.container.find('.slide-list');
    this.imgLength=this.slideList.find('li').length;
    this.imgWidth=this.slideList.find('li img').width();
    // 全局timer
    this.timer=null;
    this.slideIndex=1;
    this.interVal=2000||this.interVal;
    this.animateDuration=300||this.animateDuration;
    this.intialize();
};
SimpleSlide.prototype={
    constructor:SimpleSlide,
    intialize:function(){
        var self=this;
        this.cloneSlideItem().createAutoNumber().setSlideStyle();
        this.autoSlide();
        this.container.on('click','.slide-number li',function(e){
            e.preventDefault();
            var me=$(this),
            index=me.index()+1;
            me.addClass('current').siblings().removeClass('current');
            self.playAuto(index);
        });
    },
    // 克隆前后的对象
    cloneSlideItem:function(){
        var slideList=this.slideList,
        firstSlideItem=slideList.find('li:first-child').clone(),
        lastSlideItem=slideList.find('li:last-child').clone();
        //插入到list中
        slideList.append(firstSlideItem);
        slideList.prepend(lastSlideItem);
        return this;
    },
    // 设置播放初始状态
    setSlideStyle:function(){
        var self=this;
        this.slideList.css({'width':(self.imgLength+2)*(self.imgWidth),'left':-self.imgWidth+'px'});
        return this;
    },
    // 创建自动播放
    createAutoNumber:function(){
        var numberLength=this.imgLength,str='<ol class="slide-number">',i=0;
        for(;i<numberLength;i++){
            str+='<li><a href="#">'+(i+1)+'</a></li>';
        }
        str+='</ol>';
        this.container.append(str);
        // 初始化状态为当前状态
        this.container.find('.slide-number li:first-child').addClass('current');
        return this;
    },
    // 跳转播放
    playAuto:function(index){
        this.stopAuto();
        this.slideIndex=index;
        this.slide(index);
        this.autoSlide();
        // slide(index);
    },
    // 停止播放
    stopAuto:function(){
        var self=this;
        clearInterval(self.timer);
        this.timer=null;
    },
    getSlideIndex:function(){
        this.slideIndex++;
        // console.log(this.slideIndex);
        if(this.slideIndex===(this.imgLength+2)){
            this.slideIndex=1;
        }
    },
    // 播放
    slide:function(index){
        var self=this;
        this.slideList.animate({
            left:-self.imgWidth*index+'px'
        });
        if(index!==(this.imgLength+1)){
            this.slideList.animate({
                left:-self.imgWidth*index+'px'
            });
            self.container.find('.slide-number li').eq(index-1).addClass('current').siblings().removeClass('current'); 
        }else {
            this.slideList.animate({
                left:-self.imgWidth*index+'px'
            },function(){
                self.slideList.css('left',-self.imgWidth+'px');
                self.slideIndex=2;
            });
            self.container.find('.slide-number li').eq(0).addClass('current').siblings().removeClass('current');
        }
        this.getSlideIndex();
    },
    autoSlide:function(){
        // console.log('gooo');
        var self=this;
        this.timer=setInterval(function(){
            self.slide(self.slideIndex);
        },self.interVal);
    }
};

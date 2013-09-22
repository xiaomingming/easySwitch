var SimpleSlide=function(options){
    this.container=options.container;
    this.slideList=this.container.find('.slide-list');
    this.imgLength=options.imgLength||this.slideList.find('li').length;
    this.imgWidth=options.imgWidth||this.slideList.find('li img').eq(0).width();
    this.imgHeight=options.imgHeight||this.slideList.find('li img').eq(0).height();
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
        this.cloneSlideItem().createAutoNumber().setSlideStyle().initialLoading();
        this.autoSlide();
        this.container.on('click','.slide-number li',function(e){
            e.preventDefault();
            self.stopAuto();
            var me=$(this),
            index=me.index()+1;
            me.addClass('current').siblings().removeClass('current');
            self.playAuto(index);
        });
        this.container.on('mouseover',function(){
            self.stopAuto();
        });
        this.container.on('mouseout',function(){
            self.autoSlide();
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
        slideList.find('li:first-child,li:last-child').addClass('clone');
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
    initialLoading:function(){
        var self=this;
        this.container.append('<span class="loading">正在努力加载中...</span>');
        this.container.find('.loading').css({
            'width':self.imgWidth+'px',
            'height':self.imgHeight+'px'
        });
        this.imgPreload(self.slideList.find('li img'));
        return this;
    },
    // 跳转播放
    playAuto:function(index){
        this.stopAuto();
        this.slideIndex=index;
        this.slide(index);
    },
    isPlaying:function(){
        return this.timer!==null;
    },
    // 停止播放
    stopAuto:function(){
        var self=this;
        if(this.isPlaying()){
            clearInterval(self.timer);
            this.timer=null;
        }
    },
    getSlideIndex:function(){
        this.slideIndex++;
        if(this.slideIndex===(this.imgLength+2)){
            this.slideIndex=1;
        }
    },
    // 预加载图片
    imgPreload:function(imgItems){
        var self=this;
        console.log(this);
        $.each(imgItems,function(key,ele){
            self.imgComplete($(ele),self.imgCompleteCallback);
        });
    },
    // 完成判断
    imgComplete:function(img,callback){
        if(img.get(0).complete){
            callback.call(this);
        }else{
            img.load(function(){
                callback.call(this);
                img.load=null;
            });
        }
    },
    // 图像加载完成回调
    imgCompleteCallback:function(){
        //console.log(this);
        this.container.find('.loading').hide();
        // $('.loading').hide();
    },
    // 播放
    slide:function(index){
        var self=this;
        //
        if(index!==(this.imgLength+1)){
            this.slideList.stop(true,true).animate({
                left:-self.imgWidth*index+'px'
            });
            self.container.find('.slide-number li').eq(index-1).addClass('current').siblings().removeClass('current'); 
        }else {
            this.slideList.stop(true,true).animate({
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
        var self=this;
        this.timer=setInterval(function(){
            self.slide(self.slideIndex);
        },self.interVal);
    }
};

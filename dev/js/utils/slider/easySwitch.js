/*
 * author:leweiming
 * date: 2015/8/5
 */
define(['jquery', 'lazyload'], function($, lazyload) {
    var my = {},
        constructorFunName = 'Eswitch',
        pluginName = 'easySwitch';

    my[constructorFunName] = function(container, options) {
        var self = this,
            imgEle;
        this.container = container;
        var settings = $.extend({}, $.fn[pluginName].defaults, options);

        for (var props in settings) {
            if (settings.hasOwnProperty(props)) {
                this[props] = settings[props];
            }
        }
        // 获取图片宽高
        imgEle = container.find('.' + this.switchItemName + ' img').eq(this.startIndex);
        // 显示才能获取宽高
        imgEle.parents('.' + this.switchItemName).addClass('prev');

        this.width = this.containerWidth || this.container.width() || imgEle.width();
        this.height = this.containerHeight || this.container.height() || imgEle.height();

        // 获取图片个数
        this.itemsLen = this.container.find('.' + this.switchItemName).length;
        // 全局timer，动画状态判断
        this.timer = null;
        this.isAnimating = false;

        // 移动的宽度或者高度
        this.moveLenConfig = {
            'left': self.width,
            'top': self.height
        };
        this.moveLen = this.moveLenConfig[this.moveDirection];
        // 移动的动画配置
        // 分为当前动画，前一个状态的动画及样式设置
        this.moveAnimateConfig = {
            currentE: {
                animate: {},
                css: {}
            },
            prevE: {
                animate: {},
                css: {}
            }
        };

        this.moveAnimateConfig.currentE.animate[self.moveDirection] = 0;
        this.moveAnimateConfig.prevE.animate[self.moveDirection] = 0;

        this.moveAnimateConfig.currentE.css[self.moveDirection] = 0;
        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            var self = this;
            // this.setImgUrl();
            this.setContainerStyle();
            // this.container.find('li').eq(this.startIndex).addClass('prev');
            this.isPlayNumber && this.renderPlayNumber();
            this.isPlayThumb && this.renderThumb();
            this.isDirbtn && this.renderDirectionBtn();
            // 自动播放
            this.autoSwitch();
            // 悬浮停止配置
            this.isHoverPause && this.container.on('mouseover', function() {
                self.stopSwitch();
            }).on('mouseout', function() {
                self.autoSwitch();
            });
        },
        // 设置图片列表ul宽高
        setContainerStyle: function() {
            var self = this;
            this.container.css({
                'width': self.width,
                'height': self.height
            });
        },
        // 若有分页，或者前进，后退按钮
        // 需要创建一个外层包含框
        createSwitchWrapper: function() {
            if (!this.isSwitchWrapperCreated) {
                this.isSwitchWrapperCreated = true;
                return '<div class="' + this.switchWrapperName + '" style="width:' + this.width + 'px;height:' + this.height + 'px"></div>';
            } else {
                return false;
            }
        },
        // 创建缩略图
        createThumb: function() {
            var i = 0,
                j = this.itemsLen,
                thumbContainerWidth, //缩略图容器宽度
                thumbContainerHeight, //缩略图容器高度
                directionClass, //方向类别，用于样式控制
                $sliderItem,
                tmp,activeClass;

            if (this.thumbDirection === 'horizen') {
                thumbContainerWidth = (this.thumbWidth + this.thumbGutter) * this.thumbItems - this.thumbGutter;
                thumbContainerHeight = this.thumbHeight;
                directionClass = 'switch-thumb-horizen';
            } else if (this.thumbDirection === 'vertical') {
                thumbContainerWidth = this.thumbWidth;
                thumbContainerHeight = (this.thumbHeight + this.thumbGutter) * this.thumbItems - this.thumbGutter;
                directionClass = 'switch-thumb-vertical';
            }
            tmp = '<div class="' + this.thumbName + ' ' + directionClass + '" style="width:' + thumbContainerWidth + 'px;height:' + thumbContainerHeight + 'px;"><div class="thumb-inner">';
            $sliderItem = this.container.find('.' + this.switchItemName);
            for (; i < j; i++) {
                activeClass = (i === this.startIndex) ? ' current' : '';
                tmp += '<span class="thumb-nav-item' + activeClass + '" style="width:' + this.thumbWidth + 'px;height:' + this.thumbHeight + 'px;background-image:' + $sliderItem.eq(i).data('thumb') + ';"></span>';
            }
            tmp += '</div></div>';

            return tmp;
        },
        // 创建分页
        createPlayNumber: function() {
            var i = 0,
                j = this.itemsLen,
                tmp = '<div class="' + this.switchNumberName + '">';
            for (; i < j; i++) {
                if (i === this.startIndex) {
                    tmp += '<a href="#" class="current">' + (i + 1) + '</a>';
                } else {
                    tmp += '<a href="#">' + (i + 1) + '</a>';
                }
            }
            tmp += '</div>';
            return tmp;
        },
        // 渲染
        renderPlayNumber: function() {
            var switchWrapper = this.createSwitchWrapper(),
                self = this;
            if (switchWrapper) {
                this.container.wrap(switchWrapper);
            }
            this.container.parent().append(self.createPlayNumber());
            this.playNumberEvent();
        },
        renderThumb: function() {
            var switchWrapper = this.createSwitchWrapper(),
                self = this;
            if (switchWrapper) {
                this.container.wrap(switchWrapper);
            }
            this.container.parent().append(self.createThumb());
            this.playThumbEvent();
        },
        // 挪动缩略图
        moveThumb: function(index) {
            var moveUnit, realMove, moveStartIndex, moveMax, $thumbContainer = this.container.parent().find('.thumb-inner');
            var _this = this;
            // 若设置的缩略图个数大于最大长度
            if (this.thumbItems >= this.itemsLen) {
                this.thumbItems = this.itemsLen;
                return;
            }

            moveStartIndex = Math.ceil(this.thumbItems / 2); //挪动缩略图的开始下标
            moveUnit = Math.floor((this.thumbItems - 1) / 2); //每屏挪动的个数
            realMove = moveUnit * (Math.ceil(index / moveUnit - 1)); //当前下标，缩略图要挪动的个数
            moveMax = this.itemsLen - this.thumbItems; //最大的挪动个数

            if (this.thumbDirection === 'horizen') {
                if (index < moveStartIndex) {
                    $thumbContainer.animate({
                        'left': '0'
                    }, this.effectDuration);
                    return;
                }

                if (realMove < moveMax) {
                    // 若尚未挪动到末屏
                    $thumbContainer.animate({
                        'left': -realMove * (_this.thumbWidth + _this.thumbGutter) + 'px'
                    }, this.effectDuration);
                } else {
                    $thumbContainer.animate({
                        'left': -moveMax * (_this.thumbWidth + _this.thumbGutter) + 'px'
                    }, this.effectDuration);
                }
            } else if (this.thumbDirection === 'vertical') {
                if (index < moveStartIndex) {
                    $thumbContainer.animate({
                        'top': '0'
                    }, this.effectDuration);
                    return;
                }

                if (realMove < moveMax) {
                    // 若尚未挪动到末屏
                    $thumbContainer.animate({
                        'top': -realMove * (_this.thumbHeight + _this.thumbGutter) + 'px'
                    }, this.effectDuration);
                } else {
                    $thumbContainer.animate({
                        'top': -moveMax * (_this.thumbHeight + _this.thumbGutter) + 'px'
                    }, this.effectDuration);
                }
            }
        },
        // 绑定缩略图播放
        playThumbEvent: function() {
            var self = this;

            this.container.parent().find('.' + this.thumbName).on('click', 'a', function(e) {
                e.preventDefault();
                self.gotoIndex($(this).index(), self.startIndex, '');
                self.moveThumb($(this).index());
            });
        },
        // 绑定数字播放事件
        playNumberEvent: function() {
            var self = this;

            this.container.parent().find('.' + this.switchNumberName).on('click', 'a', function(e) {
                e.preventDefault();
                self.gotoIndex($(this).index(), self.startIndex, '');
            });
        },
        // play thumb
        playThumb: function(index) {
            this.container.parent().find('.' + this.thumbName).find('a').eq(index).addClass('current').siblings().removeClass('current');
            this.moveThumb(index);
        },
        // play number
        playNumber: function(index) {
            this.container.parent().find('.' + this.switchNumberName).find('a').eq(index).addClass('current').siblings().removeClass('current');
        },
        gotoIndex: function(index, prevIndex, directionFlag) {
            // 停止轮播
            this.stopSwitch();

            this.scroll(index, prevIndex, directionFlag);
            this.autoSwitch();
        },

        // create next,prev button
        createDirectionBtn: function() {
            return '<a href="#" class="' + this.prevBtnName + '">上一张</a><a href="#" class="' + this.nextBtnName + '">下一张</a>';
        },
        // render next,prev button
        renderDirectionBtn: function() {
            var switchWrapper = this.createSwitchWrapper(),
                self = this;

            if (switchWrapper) {
                this.container.wrap(switchWrapper);
            }
            this.container.parent().append(self.createDirectionBtn());
            this.prevBtnEvent();
            this.nextBtnEvent();
        },
        // 上一张按钮事件
        prevBtnEvent: function() {
            var self = this,
                clickIndex;

            this.container.parent().find('.' + this.prevBtnName).on('click', function(e) {
                e.preventDefault();
                clickIndex = self.getPrev(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex, -1);
            });
        },
        // 下一张按钮事件
        nextBtnEvent: function() {
            var self = this,
                clickIndex;
            this.container.parent().find('.' + this.nextBtnName).on('click', function(e) {
                e.preventDefault();
                clickIndex = self.getNext(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex, 1);
            });
        },
        // get direction
        // 传入跳转后的下标，跳转之前的下标
        getDirection: function(gotoIndex, prevIndex) {
            var res = gotoIndex - prevIndex;
            if (res >= 1) {
                // 正向跳转
                return 1;
            } else if (res < 0) {
                // 负向跳转
                return -1;
            } else {
                // 根本就没有跳转么
                return 0;
            }
        },
        // get 前一张
        getPrev: function(index) {
            return (index === 0) ? (this.itemsLen - 1) : (index - 1);
        },
        // 获取下一张
        getNext: function(index) {
            return (index + 1 === this.itemsLen) ? 0 : (index + 1);
        },
        // 获取移动的距离
        // 根据方向参数，自动播放/手动播放标识 来判断
        // 由于上一页，下一页按钮行为特殊，比如，下一页点到最后时，它的下一页就是起始，在两者跳转时，就不同于在分页上的点击那样跳转方向不一致，这个必须一致
        getMoveDistance: function(index, prevIndex, directionFlag) {
            var moveLen = this.moveLen;
            if (directionFlag === '') {
                //前进或后退，首尾图片切换方向不一致时
                return (this.timer) ? moveLen : this.getDirection(index, prevIndex) * moveLen;
            } else {
                return directionFlag * moveLen;
            }

        },
        // 滚动回调
        scroll: function(index, prevIndex, directionFlag) {
            if (index === prevIndex) {
                return;
            }
            if (this.isAnimating) {
                return;
            }
            this.isAnimating = true;

            // 更改开始的下标
            // 这句相当关键，动画状态正在运动时，就不能让startIndex更改了，而放置的最佳位置，就是这里
            this.startIndex = index;
            var self = this,
                moveDistance = 0,
                container = this.container,
                currentEle = container.find('.' + this.switchItemName).eq(index),
                prevEle = container.find('.' + this.switchItemName).eq(prevIndex),
                promiseCurrent,
                promisePrev;
            // 先移除current next类
            container.find('.' + this.switchItemName).removeClass('current prev');

            // 移动效果
            if (this.effect === 'moveEffect') {
                moveDistance = this.getMoveDistance(index, prevIndex, directionFlag);
                self.moveAnimateConfig.currentE.css[self.moveDirection] = moveDistance + 'px';
                self.moveAnimateConfig.prevE.animate[self.moveDirection] = -moveDistance + 'px';

                // 当前
                promiseCurrent = currentEle.addClass('current').css(self.moveAnimateConfig.currentE.css).stop(true, true).animate(self.moveAnimateConfig.currentE.animate, self.effectDuration, 'linear', function() {
                    $(this).siblings().removeClass('prev').attr('style', '');
                    $(this).css('z-index', '1');
                }).promise();

                // 当前图片的前一个
                promisePrev = prevEle.addClass('prev').stop(true, true).animate(self.moveAnimateConfig.prevE.animate, self.effectDuration, 'linear', function() {
                    $(this).attr('style', '');
                }).promise();
            }
            // fade 效果
            if (this.effect === 'fadeEffect') {
                promiseCurrent = currentEle.stop(true, true).fadeIn(self.effectDuration).promise();
                promisePrev = prevEle.stop(true, true).fadeOut(self.effectDuration).promise();
            }
            // 效果这里控制，本来使用key/value来进行控制，这样代码显得优雅
            // 但是，在$.when()中，作为参数，产生了问题，于是这里代码就先ugly着
            self.isPlayThumb && self.playThumb(index);
            self.isPlayNumber && self.playNumber(index);
            $.when(promiseCurrent, promisePrev).done(function() {
                self.lazyloadImg();
                self.isAnimating = false;

            });
        },
        // 触发自动滚动
        autoSwitch: function() {
            var self = this,
                prevIndex;
            this.timer = setInterval(function() {
                prevIndex = self.startIndex;
                self.startIndex = self.getNext(self.startIndex);
                self.scroll(self.startIndex, prevIndex, 1);
            }, self.intervalTime);
        },
        // 阻止滚动
        stopSwitch: function() {
            var self = this;
            if (this.timer) {
                clearInterval(self.timer);
                self.timer = null;
            }
        },
        lazyloadImg: function() {
            this.container.find('img').lazyload();
        }
    };
    $.fn[pluginName] = function(opts) {
        // 可初始化并自定义属性及函数
        if (typeof opts === 'string') {
            if (opts === 'api') {
                return $(this).data('plugin-' + pluginName);
            } else {
                throw new Error('error string ,here supports "api" only!');
            }
        }
        return this.each(function() {
            var that = $(this),
                s1 = new my[constructorFunName](that, opts);

            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }

        });

    };
    $.fn[pluginName].defaults = {
        switchWrapperName: 'switch-wrapper',
        switchItemName: 'switch-item',
        switchNumberName: 'switch-number',
        thumbName: 'switch-thumb',
        prevBtnName: 'switch-prev',
        nextBtnName: 'switch-next',
        effect: 'moveEffect', // fadeEffect or moveEffect
        moveDirection: 'left', //left or top
        containerWidth: 0,
        containerHeight: 0,
        isHoverPause: true, //是否悬浮暂停轮播
        isPlayNumber: true, //是否显示轮播序号
        isPlayThumb: false, //是否显示轮播缩略图
        isDirbtn: true, //是否显示前进后退
        startIndex: 0, //轮播开始的下标
        intervalTime: 3000,
        effectDuration: 500,
        thumbWidth: 200, //缩略图宽度
        thumbHeight: 70, //缩略图高度
        thumbGutter: 10, //缩略图间距
        thumbItems: 2, //缩略图个数
        thumbDirection: 'horizen' //缩略图方向，水平或者居中vertical
    };

    return constructorFunName;
});

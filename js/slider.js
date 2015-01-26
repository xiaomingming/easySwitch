/*
 * author:leweiming
 * description: slider
 * gmail:xmlovecss 艾特 gmail dot com
 */

(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'Slider',
        pluginName = 'slider';

    my[constructorFunName] = function(container, options) {
        var settings = $.extend(true, {}, $.fn[pluginName].defaults, options);

        for (var prop in settings) {
            if (settings.hasOwnProperty(prop)) {
                this[prop] = settings[prop];
            }
        }
        // dom初始化
        this.container = container;
        this.body = this.container.find(this.domSelector.body);
        this.box = this.container.find(this.domSelector.box);
        this.prevBtn = this.container.find(this.domSelector.prevBtn);
        this.nextBtn = this.container.find(this.domSelector.nextBtn);
        // 全局动画标志
        this.isAnimating = false;
        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            this.render().handler();
            return this;
        },
        // 事件处理器
        handler: function() {
            var _this = this;
            this.prevBtn.on('click', function() {
                _this.move('right');
            });
            this.nextBtn.on('click', function() {
                _this.move('left');
            });
            // 快捷键绑定
            // 前进后退
            $(window).on('keyup.' + pluginName, function(e) {
                switch (e.keyCode) {
                    case 37:
                        _this.move('right');
                        break;
                    case 39:
                        _this.move('left');
                        break;
                }
            });
            return this;
        },
        // 渲染
        render: function() {
            this.body.css({
                width: this.width + 'px',
                height: this.height + 'px'
            });
            return this;
        },
        // 水平偏移值获取
        getOffset: function() {
            return Math.abs(parseInt(this.box.css('left'), 10));
        },
        // 图片总数
        getAllItems: function() {
            return this.container.find(this.domSelector.item).length;
        },
        // 向前需要挪动的个数
        prevItems: function() {
            var rest = (this.getOffset() + this.gutter) / (this.itemWidth + this.gutter);
            return rest > this.maxItems() ? this.maxItems() : 'start';
        },
        // 一屏最多容纳的个数
        maxItems: function() {
            return (this.width + this.gutter) / (this.itemWidth + this.gutter);
        },
        // 下一次需要挪动的个数
        nextItems: function() {
            var restItems = this.getAllItems() - (this.getOffset() + this.gutter) / (this.itemWidth + this.gutter) - this.maxItems();
            if (restItems <= 0) {
                return 0;
            }
            return restItems > this.maxItems() ? this.maxItems() : 'end';
        },
        // 挪动的距离
        moveUnits: function(items) {
            if (!items || typeof items === 'string') {
                return false;
            }
            items = Math.floor(items);
            return items * (this.itemWidth + this.gutter);
        },
        // 挪动
        move: function(direction) {
            var to = 0,
                _this = this;
            if (direction === 'left') {
                if (isNaN(this.nextItems())) {
                    to = (this.itemWidth + this.gutter) * this.getAllItems() - this.gutter - this.width;
                } else {
                    to = this.getOffset() + this.moveUnits(this.nextItems());
                }
            } else if (direction === 'right') {
                if (isNaN(this.prevItems())) {
                    to = 0;
                } else {
                    to = this.getOffset() - this.moveUnits(this.prevItems());
                }
            }
            if (!this.isAnimating) {
                this.isAnimating = true;
                $.when(this.animate(to)).then(function() {
                    _this.isAnimating = false;
                });
            }
            return this;
        },
        animate: function(to) {
            return this.box.animate({
                'left': -to + 'px'
            }, this.duration).promise();
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
    // 默认参数配置
    $.fn[pluginName].defaults = {
        // dom配置，若样式定义存在冲突，可以更改此处dom和样式即可
        domSelector: {
            wrapper: '.slider', // slider最外层
            box: '.slider-box', // slider 列表
            item: '.slider-item', // slider 列表项
            body: '.inner', // slider内层
            move: '.move', // 前后左右包裹层
            prevBtn: '.move .prev', // 前一个
            nextBtn: '.move .next' // 下一个
        },
        duration: 400, //动画持续时间
        width: 960, // 一屏展示的容器总宽度
        height: 300, // 一屏展示的总高度
        itemWidth: 200, // 单个展示图的宽度
        gutter: 10 // 展示图的右间距
    };
})(window, jQuery);

/*
 * @name EasyCarousel
 * @class 一个简单的图片轮播插件，支持渐隐渐现效果，还需要支持左右滑动，上下显示效果，自动适应图片大小
 * @param {}
 * @author: leweiming
 * @gmail: xmlovecss@gmail.com
 * @example
 * new EasyCarousel({ container:$('#carousel'),interval:3000,hideDuration:300,showDuration:800})
 */
var EasyCarousel = function(options) {
    this.containner = options.containner;
    var containner = this.containner;
    this.pagination = containner.find('.pagination');
    this.play = containner.find('.play');
    this.picList = containner.find('.pic ul li');
    this.prev = this.pagination.find('.prev');
    this.next = this.pagination.find('.next');
    this.pageNum = 0;

    this.direction = {
        left: 'left',
        right: 'right',
        st: 'switch'
    };
    var defaults = {
        isAuto: true,
        interval: 3000,
        hideDuration: 300,
        showDruation: 800
    };
    var settings = $.extend({}, defaults, options);

    this.isAuto = settings.isAuto;
    this.interval = settings.interval;
    this.hideDuration = settings.hideDuration;
    this.showDruation = settings.showDruation;

    this.animatingFlag = true;
    this.timer = null;

    this.initialize();
};
EasyCarousel.prototype = {
    contstructor: EasyCarousel,
    initialize: function() {
        var _this = this;
        this.createPlayNumberHtml();
        this.prev.on('click', function(e) {
            e.preventDefault();
            _this.animatingFlag && _this.autoPlay(_this.pageNum, _this.direction.right);
        });
        this.next.on('click', function(e) {
            e.preventDefault();
            _this.animatingFlag && _this.autoPlay(_this.pageNum, _this.direction.left);
        });
        // play number
        this.play.on('click', 'a', function(e) {
            e.preventDefault();
            _this.animatingFlag && _this.autoPlay(Number($(this).attr('data-number')), _this.direction.st);
        });
        if (!this.isAuto) {
            return false;
        }
        this.containner.on('mouseover', function() {
            _this.stopPlay();
        });
        this.containner.on('mouseout', function() {
            _this.timer = setInterval(function() {
                _this.autoPlay(_this.pageNum, 'left');
            }, _this.interval);
        });
        this.containner.trigger('mouseleave');
    },
    createPlayNumberHtml: function() {
        var _this = this;
        return (function(picListLength) {
            var playHtml = '';
            for (var i = 0; i < picListLength; i++) {
                playHtml += '<a href="#" data-number="' + i + '">' + (i + 1) + '</a>';
            }
            _this.play.html(playHtml);
            _this.play.find('a').eq(0).addClass('current');
        })(_this.picList.length);
    },
    showPic: function(pageNumber) {
        var _this = this;
        return this.picList.eq(pageNumber).stop(true, true).fadeIn(_this.showDruation).promise();
    },
    hidePic: function(pageNumber) {
        var _this = this;
        return this.picList.eq(pageNumber).siblings().stop(true, true).fadeOut(_this.hideDuration).promise();
    },
    carousel: function(pageNumber) {
        var _this = this;
        this.animatingFlag = false;
        return this.hidePic(pageNumber).then(_this.showPic(pageNumber)).then(function() {
            _this.animatingFlag = true;
        }).then(_this.playNumber(pageNumber));
    },
    playNumber: function(pageNumber) {
        return this.play.find('a').eq(pageNumber).addClass('current').siblings('').removeClass('current');
    },
    getPlayNumber: function(page, direction) {
        if (direction === 'left') {
            this.pageNum = page === (this.picList.length - 1) ? 0 : this.pageNum + 1;
        } else if (direction === 'right') {
            this.pageNum = page === 0 ? this.picList.length - 1 : this.pageNum - 1;
        } else if (direction === 'switch') {
            this.pageNum = page;
        }
        return this.pageNum;
    },
    autoPlay: function(pageNum, direction) {
        var pageNumber = this.getPlayNumber(pageNum, direction);
        return this.carousel(pageNumber);
    },
    stopPlay: function() {
        var _this = this;
        if(this.timer!==null){
            clearInterval(_this.timer);
            return this.timer = null;
        }
    }
};
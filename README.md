EasySwitch
==========

基于jquery的简单的图片轮播插件

##实现效果
自动播放时，始终向左/向上滑动，点击播放数字时，会有前后/上下滑动，点击上一张和下一张时，始终向一个方向（水平为left,right;垂直为top,bottom）
##实现原理：
假设方向为水平方向，那么从第一张滑动到第二张。第二张图片要往左滑动的同时，第一张图片也要往左滑动（也有另一种滑动效果，第一张图片是不动的，第二张图片直接覆盖上去）

这样的话，我们需要计算好轮播的当前下标index和当前状态的前一个图片的下标index。使用绝对定位，同时显示两者，并准备好当前图片的位置。

同时，隐藏其它图片，其它图片层叠值设为0，当前为2，前一个为1。动画完成后，把当前的层叠值恢复为1，前一个图片样式清空，打成平民。

点击播放数字时，图片要么向前，要么向后（垂直方向不陈述了），判断前后的标准是通过 当前 和 前一个 图片的 下标差 来判断，那么，怎么知道是点击呢，还是自动轮播呢？因为点击时需要停止timer，所以timer不存在就是点击状态

点击上一张，下一张时，行为和点击数字不一样，需要区别对待，但是这里逻辑非常简单了

另外，对于动画状态的判断需要格外注意了。这里设置了全局动画标识，所有的事件逻辑最终要走向scroll函数，那么，当动画还在进行时，点击事假是不能生效的。

让点击事件不能生效的技巧就是，通过判断动画标识，在scroll函数中更改轮播下标 startIndex。
##使用方法：

    $(window).load(function(){
        $('.switch-list').easySwitch({
            'switchWrapperName': 'switch-wrapper', // 轮播的最外包含框类名定义
            'switchNumberName': 'switch-number', // 轮播数字包含框类名定义
            'prevBtnName': 'switch-prev', // 轮播上一个按钮类名
            'nextBtnName': 'switch-next', // 下一个按钮类名定义
            'effect': 'fadeEffect', // fadeEffect or moveEffect，渐变还是移动效果
            'moveDirection': 'left', //left or top ，水平移动还是垂直移动（不包含渐变）
            'isHoverPause': true, // 是否支持在图片上悬浮停止轮播
            'isPlayNumber': true, // 是否显示轮播数字
            'isDirbtn': true, // 是否显示轮播的 上一个 下一个按钮
            'startIndex': 0, // 轮播从第几张图片开始
            'intervalTime': 3000, // 图片轮播间隔时间
            'effectDuration': 800 // 动画效果持续时间
        });
    });

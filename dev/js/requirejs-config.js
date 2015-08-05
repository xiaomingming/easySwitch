/*global requirejs:true*/
var staticURL = './js/';
require.config({
    baseUrl: staticURL,
    paths: {
        'jquery': 'libs/jquery-1.8.2',
        'easySwitch': 'utils/slider/easySwitch',
        'slider': 'utils/slider/slider',
        'lazyload': 'utils/lazyload/jquery.lazyload'
    }
});
// 非AMD模块配置
requirejs.config({
    baseUrl: staticURL,
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'lazyload': {
            deps: ['jquery']
        }
    }
});

var devURL = './dev/',
    buildURL = './build/';
module.exports = function(grunt) {
    var autoprefixer = require('autoprefixer-core');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        prettify: {
            options: {
                // Task-specific options go here.
                "indent": 4,
                "condense": true,
                "indent_inner_html": true,
                "preserve_newlines": true,
                "unformatted": [
                    "a",
                    "pre",
                    "strong",
                    "i",
                    "span",
                    "em"
                ]
            },
            html: {
                // Target-specific file lists and/or options go here.
                files: [{
                    expand: true,
                    cwd: devURL,
                    src: ['**/*.html'],
                    dest: devURL,
                    ext: '.html'
                }]
            }
        },
        sass: {
            options: {
                require: 'compass/import-once/activate',
                style: 'compact', // Can be nested, compact, compressed, expanded.
                precision: 5,
                quiet: false,
                debugInfo: false
            },
            app: {

                files: [{
                    expand: true,
                    cwd: devURL + 'css/app/scss',
                    src: ['**/*.scss'],
                    dest: devURL + 'css/app/dist',
                    ext: '.css'
                }]
            },
            common: {

                files: [{
                    expand: true,
                    cwd: devURL + 'css/common/scss',
                    src: ['**/*.scss'],
                    dest: devURL + 'css/common/dist',
                    ext: '.css'
                }]
            },
            widgets: {

                files: [{
                    expand: true,
                    cwd: devURL + 'css/widgets/scss',
                    src: ['**/*.scss'],
                    dest: devURL + 'css/widgets/dist',
                    ext: '.css'
                }]
            },
            utils: {
                files: [{
                    expand: true,
                    cwd: devURL + 'js/utils',
                    src: ['**/*.scss'],
                    dest: devURL + 'js/utils',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    autoprefixer({
                        browsers: ['last 3 versions', '> 5%']
                    }).postcss
                ]
            },
            files: {
                expand: true,
                cwd: devURL + 'css/',
                src: ['**/*.css'],
                dest: devURL + 'css/',
                ext: '.css'
            }
        },
        requirejs: {
            build: {
                options: {
                    appDir: devURL,
                    baseUrl: 'js/',
                    dir: './build',
                    // generateSourceMaps: true,
                    // preserveLicenseComments: false,
                    optimize: 'uglify2',
                    'uglify2': {
                        'mangle': false
                    },
                    // useSourceUrl: true,
                    optimizeCss: 'standard',
                    paths: {
                        'jquery': 'libs/jquery-1.8.2',
                        'easySwitch': 'utils/slider/easySwitch',
                        'slider': 'utils/slider/slider',
                        'lazyload': 'utils/lazyload/jquery.lazyload'
                    },
                    shim: {

                    },
                    modules: [],
                    fileExclusionRegExp: /^(sftp.json)|(.+psd)$/g //过滤不该打包的文件
                }
            }
        },
        imagemin: {
            /* 压缩图片大小 */
            options: {
                optimizationLevel: 4
            },
            base: {
                files: [{
                    expand: true,
                    cwd: devURL + 'images/',
                    src: ['**/*.{jpg,png,gif}'],
                    dest: buildURL + 'images/'
                }]
            },
            utils: {
                files: [{
                    expand: true,
                    cwd: devURL + 'js/utils',
                    src: ['**/*.{jpg,png,gif}'],
                    dest: buildURL + 'js/utils'
                }]
            }
        },

        jshint: {
            options: {
                strict: false,
                globals: {
                    window: true,
                    jQuery: true,
                    jquery: true,
                    define: true,
                    require: true,
                    ACTION_SET: true,
                    VIP_MAP: true,
                    $: true,
                    module: true,
                    grunt: true,
                    document: true,
                    console: true,
                    setTimeout: true,
                    setInterval: true
                },
                expr: true, //防止&&报错
                quotmark: 'single', //只能使用单引号
                noarg: true,
                noempty: true, //不允许使用空语句块{}
                eqeqeq: true, //!==和===检查
                undef: true,
                curly: true, //值为true时，不能省略循环和条件语句后的大括号
                forin: true, //for in hasOwnPropery检查
                devel: true,
                browser: true,
                wsh: true,
                evil: true,
                unused: 'vars', //形参和变量未使用检查
                latedef: true //先定义变量，后使用
            },
            files: {
                src: [devURL + 'js/app/*.js', devURL + 'js/utils/**/*.js', !devURL + 'js/utils/**/*.min.js']
            }
        },
        watch: {
            sass: {
                files: [devURL + 'css/**/*.scss', devURL + 'js/**/*.scss'],
                tasks: ['sass']
            }
        }
    });
    grunt.loadNpmTasks('grunt-csscomb'); // css属性指定
    grunt.loadNpmTasks('grunt-prettify'); //html prettify
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-sass'); //sass编译
    grunt.loadNpmTasks('grunt-contrib-handlebars'); // 添加handlebars任务
    grunt.loadNpmTasks('grunt-autoprefixer'); // css自动添加前缀
    grunt.loadNpmTasks('grunt-contrib-concat'); //文件合并
    grunt.loadNpmTasks('grunt-contrib-jshint'); //js检查
    grunt.loadNpmTasks('grunt-contrib-uglify'); //文件混淆
    grunt.loadNpmTasks('grunt-contrib-cssmin'); //css压缩
    grunt.loadNpmTasks('grunt-contrib-htmlmin'); //html压缩
    grunt.loadNpmTasks('grunt-contrib-imagemin'); //图像压缩
    grunt.loadNpmTasks('grunt-contrib-requirejs'); //requirejs优化
    grunt.loadNpmTasks('grunt-contrib-watch'); // 文件监听
    // 注册任务
    grunt.registerTask('default', ['sass']);
    grunt.registerTask('css', ['sass', 'postcss']);
    grunt.registerTask('go', ['sass', 'postcss', 'requirejs', 'imagemin']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('html', ['prettify']);
    grunt.registerTask('live', ['watch']);
};

//基于commonjs规范
var path=require('path')
var HtmlWebpackPlugin=require('html-webpack-plugin');
var CleanWebpackPlugin=require("clean-webpack-plugin");
var webpack=require('webpack');
var ExtractTextWebpackPlugin=require('extract-text-webpack-plugin');
var cssExtract=new ExtractTextWebpackPlugin({
    filename:'css/cssStyle.css',
    disable:true     //如果不禁用，通过link的样式进行引用，那么无法热更新，一般上线的时候，再开启，开发时可以禁用
});

/*var PurifycssWebpack=require('purifycss-webpack');
var glob=require('glob');*/
module.exports={
    entry:['./demo3.6/图层标注.html','./demo3.5/绘制Graphic.html','./demo3.7/鼠标绘制graphic.html','./demo3.8/demo8图例.html'],    //entry是数组，那么数组中的js文件，会打包成一个js文件
    // entry:'./src/js/index.js', //入口
   /* entry:{   //多个入口，就要配置多个出口的js文件 把output中的filename配置成：'[name].[hash:8].js' ，[name是动态变量，会自动将入口的js文件分别打包
        index:'./src/js/index.js',
        index1:'./src/js/index1.js'
    },*/
    output:{
        filename:'build.js',   //文件名
        // filename:'[name].[hash:8].js',   //多出口js文件的配置
        path:path.resolve('./build') //必须是绝对路径 path.resolve：根据当前路径解析出绝对路径
    }, //出口
    devServer:{
        contentBase:'./build',   //默认的根目录
        port:3000,
        compress:true,//服务器压缩
        open:true, //自动打开浏览器
        hot:true,  //热更新，而不是刷新整个页面，必须配合webpack热更新插件使用，不然是无效的  new webpack.HotModuleReplacementPlugin()
    }, //开发服务器
    plugins: [

        cssExtract,   //有了这个 下面就不用再new了
        // new ExtractTextWebpackPlugin({
        //     filename:'css/index.css'
        // }),
        new webpack.HotModuleReplacementPlugin(),
        //多个html引用多个js，需要配置多个插件
        new HtmlWebpackPlugin({
            // filename:'index.html',  //如果是单文件入口，可以不加
            template: "./demo3.6/图层标注.html",
            title:"webpack配置",
            hash:true,  //带上hash值,上线的时候，可以和之前的版本区别开来
            // chunks: ['index.js'],  //该html需要引用的js文件，单文件不需要，若不加，默认引用所有的js文件
            minify: {
                removeAttributeQuotes:true,  //移除属性的双引号
                // collapseWhitespace:true,   //把代码折叠成一行
            }
        }),
        new HtmlWebpackPlugin({
            filename:'index1.html',
            template: "./demo3.5/绘制Graphic.html",
            title:"webpack配置",
            hash:true,  //带上hash值,上线的时候，可以和之前的版本区别开来
            minify: {
                removeAttributeQuotes:true,  //移除属性的双引号
                // collapseWhitespace:true,   //把代码折叠成一行
            }
        }),

        new HtmlWebpackPlugin({
            filename:'index7.html',
            template: "./demo3.7/鼠标绘制graphic.html",
            title:"webpack配置",
            hash:true,  //带上hash值,上线的时候，可以和之前的版本区别开来
            minify: {
                removeAttributeQuotes:true,  //移除属性的双引号
                // collapseWhitespace:true,   //把代码折叠成一行
            }
        }),
        new HtmlWebpackPlugin({
            filename:'index8.html',
            template: "./demo3.8/demo8图例.html",
            title:"webpack配置",
            hash:true,  //带上hash值,上线的时候，可以和之前的版本区别开来
            minify: {
                removeAttributeQuotes:true,  //移除属性的双引号
                // collapseWhitespace:true,   //把代码折叠成一行
            }
        }),
        new CleanWebpackPlugin([
            './build'  //把build文件夹清空
        ]),
       /* new PurifycssWebpack({     //没用的css样式会被删除掉，必须要放到htmlWebpackPlugin插件下面
            paths:glob.sync(path.resolve('src/!*.html'))
        })*/
    ], //插件的配置
    mode:'development', //可以更改模式
    resolve: {}, //配置解析
    module:{   //模块的配置
        rules:[ //从右往左写
            /*{test:/\.css$/,use:[    //['style-loader','css-loader']
                    {loader:'style-loader', options: ''},
                    {loader: "css-loader"}
                ]
            }*/
            /*{
                test:/\.css$/,use:ExtractTextWebpackPlugin.extract({
                    use:[
                        {loader:'css-loader'}  //不需要再引用style 直接以link的方式进行引用
                    ]
                })
            }*/
            {
                test:/\.css$/,use:cssExtract.extract({    //css的单独抽离到一个文件中去 less单独抽离一个
                    fallback:'style-loader',   //当禁用时，需要通过style的样式进行引用，此参数生效
                    use:[
                        {loader:'css-loader'}, //不需要再引用style 直接以link的方式进行引用
                        {loader:'postcss-loader'}
                    ]
                })
            },
            {
                test:/\.(htm|html)$/,
                use:['raw-loader']
            }
        ]
    }
}
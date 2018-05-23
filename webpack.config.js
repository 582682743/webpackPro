let webpack = require('webpack');
let ET = require('extract-text-webpack-plugin');
let htmlWebpackPlugin = require('html-webpack-plugin');
let $ = require('jquery');
let path = require('path');
let fs = require('fs');
module.exports = {
	entry: getEntry(), //入口配置
    output: {
		path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
		filename: 'js/[name].js',
		publicPath: '../'
		//  filename: 'bundle.js'
	},
	devtool: 'source-map', //打印日志
	mode: 'development', //开发模式 development||部署模式 production
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: "localhost",
        port: "63342",
        open: true, // 开启浏览器
        hot: true   // 开启热更新
    },
    module: {//配置loader文件
        rules: [
			//{test: /\.html$/, loader: 'raw'},
			{
                test: /\.html$/,
　　　　 			loader: 'html-withimg-loader' //!string
			},
			{
                test:/\.tpl$/,
                loader:"ejs-loader"
			},
			{
                test: /\.js$/,
                loader: 'babel-loader'
			},
			{
                test: /\.css/,
                loader: ET.extract({ //单独打包出CSS，这里配置
                        fallback:'style-loader', // 回滚
                        use:['css-loader','postcss-loader'],
                        publicPath:'../' //解决css背景图的路径问题
                })
			},
			{
                test: /\.scss$/,
                loader: ET.extract({
                    fallback:'style-loader',
                    use:['css-loader','sass-loader']
				})
            },
            {
        　　　　 test: /\.(png|jpg|gif|woff|svg|eot|ttf|woff2)$/,
        　　　　 loader: 'url-loader?limit=8192&name=images/[name].[ext]'
	　　　   }
	    ]
    },
    plugins: [
        new ET("css/bundle.css"),
        new webpack.ProvidePlugin({ //自动加载JQ
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
        }),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "all",
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true
        })
    ],
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 name: "application",
    //                 chunks: "initial",
    //                 minChunks: 2
    //             }
    //         }
    //     }
    // },
    watch:true //热更新
};

function getEntry() { //动态读取js文件
    var jsPath = path.resolve("./src", 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve("./src", 'js', item);
        }
    });
    return files;
}

//html页面抽离
const htmlArray = ['index','evaluation' , 'login' , 'wait_interview'];
htmlArray.forEach((element) => {
    const chunksArray = [element];
    const newPlugin = new htmlWebpackPlugin({
        filename: 'html/' + element + '.html',
        template: './' + element + '.html',   // 获取最初的html模版
        inject:  true,          // 插入文件的位置
        hash: true,               // 在生成的文件后面增加一个hash，防止缓存
        chunks: chunksArray
    });
    module.exports.plugins.push(newPlugin);
});

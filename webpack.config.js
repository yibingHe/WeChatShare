
const packageInfo = require('./package')
const outputPath = __dirname+'/dist/'+packageInfo.version


module.exports = {
    mode:'development',
    entry:{
        'WeChatShare':'./src/index.js',
    },
    output:{
        path:outputPath,
        filename: "[name].min.js",
        library:"[name]",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test:/\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test:/\.(png|jpg|gif)$/,
                use:{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            }
        ]
    }
}

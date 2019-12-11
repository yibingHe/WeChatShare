##微信分享页面插件

####版本1.0.0
#####时间：2019-12-10 10:36:57


微信内网页 分享授权


1. 页面引入sdk <script src="https://res2.wx.qq.com/open/js/jweixin-1.4.0.js"></script> 必须是1.4.0版本
2. 文件中引入该js
3. 按需要参数实例化wechat new wechat({title:'',desc:'',imgUrl:'',link:''})
4. 页面授权 wechat.auth()
5. 配置接口代理 /wechat
```
'/wechat':{
                target:'https://api.weixin.qq.com',
                changeOrigin: true,
                pathRewrite: {
                  '^/wechat':''
                }
              }
```
该模块依赖
1. sha1加密文件 npm instnall js-sha1 --s-dev

参数说明：
option:{
  title:'',
  desc:'',
  link:'',
  imgUrl:''
}
```
demo:
var wechatshare = new WeChatShare({
            title:'微信分享',
            desc:'微信分享介绍',
            link:'',
            imgUrl:'',
            appid:'',
            secret:''
        })
        wechatshare.auth()
```


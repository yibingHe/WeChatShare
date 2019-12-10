
/* 
微信内网页 分享授权


1. 页面引入sdk <script src="https://res2.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
2. 文件中引入该js
3. 按需要参数实例化wechat new wechat({title:'',desc:'',imgUrl:'',link:''})
4. 页面授权 wechat.auth()

该模块依赖
1. sha1加密文件 npm instnall js-sha1 --s-dev

参数说明：
option:{
  title:'',
  desc:'',
  link:'',
  imgUrl:''
}
*/


import sha1 from "js-sha1";

const APPID = '*****';
const SECRET = '****';

class WeChat { 

  constructor(option) { 
    this.access_token = '';
    this.jsapi_ticket = '';
    this.option = {}
    this.__setOption__(option)
  }


  auth() { 
    this.__setWXReady__()
    this.__fetchWechatToken__()
  }

  __setOption__(option) { 
    this.option.title = option.title ? option.title : ''
    this.option.desc = option.desc ? option.desc : ''
    this.option.link = option.link ? option.link : window.location.href
    this.option.imgUrl = option.imgUrl?option.imgUrl:''
  }

  __fetchWechatToken__() { 

    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '/wechat/cgi-bin/token?grant_type=client_credential' + '&appid=' + APPID + '&secret=' + SECRET, true);
    httpRequest.onreadystatechange =  () => { 
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
        let json = httpRequest.responseText;//获取到服务端返回的数据
        this.access_token = json.access_token;
        this.__fetchTicket__(json.access_token);
        } 
    }
  }

  __fetchTicket__(token) {
  
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '/wechat/cgi-bin/ticket/getticket?type=jsapi' + '&access_token=' + token , true);
    httpRequest.onreadystatechange =  ()=> { 
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        let json = httpRequest.responseText;
        let timestamp = new Date().getTime();
        let noncestr = randomString(16);
        this.jsapi_ticket = json.ticket;
  
        let signature = createSignature(timestamp,noncestr,json.ticket);
  
        /*global wx*/
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: APPID, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: noncestr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名
          jsApiList: [// 必填，需要使用的JS接口列表
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "chooseWXPay",
            "showOptionMenu",
            "updateAppMessageShareData",
            "hideMenuItems",
            "showMenuItems",
            "onMenuShareTimeline",
            "onMenuShareAppMessage"
          ]
        })   
        } 
    }
  }

  __setWXReady__() { 
    wx.ready(() => {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      wx.onMenuShareAppMessage({
        title: this.option.title, // 分享标题
        desc: this.option.desc,
        link: encodeURIComponent(this.option.link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: this.option.imgUrl, // 分享图标
        type: "link",
        success: () => {},
        error: () => {}
      });

      wx.onMenuShareTimeline({
        title: this.option.title, // 分享标题
        desc: this.option.desc,
        link: encodeURIComponent(this.option.link), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: this.option.imgUrl, // 分享图标
        type: "link",
        success: () => {},
        error: () => {}
      });
    });
  }
}

let createSignature = (timestamp, noncestr, ticket)=> {
  let string = objKeySort({
    timestamp: timestamp,
    noncestr: noncestr,
    jsapi_ticket: ticket,
    url: location.href.split("#")[0]
  });
  return sha1(string);
}

let randomString = (len) => {
  len = len || 32;
  let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

let objKeySort = (arys)=> {//先用Object内置类的keys方法获取要排序对象的属性名数组，再利用Array的sort方法进行排序
  let newkey = Object.keys(arys).sort();
  let newObj = ""; //创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {
    newObj += [newkey[i]] + "=" + arys[newkey[i]] + "&";
  }
  return newObj.substring(0, newObj.length - 1);
}

export default WeChat
define("appmsg/weapp_common.js",["biz_wap/utils/ajax.js","biz_wap/jsapi/core.js"],function(e,p,a,n){
"use strict";
function o(e){
return e.indexOf(h)>-1?e:""+e+h;
}
function t(){
var e=navigator.userAgent.match(/MicroMessenger\/(\d+)\.(\d+)\.(\d+)/);
if(e){
var p=Number(e[1]),a=Number(e[2]),n=Number(e[3]);
p>6?w.canJumpOnTap=!0:6===p&&a>5?w.canJumpOnTap=!0:6===p&&5===a&&n>=3&&(w.canJumpOnTap=!0);
}else navigator.userAgent.match(/MicroMessenger\//)||(w.isNonWechat=!0);
r();
}
function r(){
try{
w.appidSnInfo=JSON.parse(window.weapp_sn_arr_json).weapp_card_list;
}catch(e){
w.appidSnInfo=[];
}
if(!w.appidSnInfo||0==w.appidSnInfo.length)return w.getInfoState=1,void i();
for(var p={
__biz:window.biz||"",
mid:window.mid||"",
idx:window.idx||"",
uin:window.uin||"",
key:window.key||"",
pass_ticket:window.pass_ticket||"",
weapp_num:w.appidSnInfo.length
},a={},n={},o=0;o<p.weapp_num;o++){
var t=w.appidSnInfo[o].appid,r=w.appidSnInfo[o].sn;
a[t]?a[t].push(o):(a[t]=[o],p["weapp_appid_"+o]=w.appidSnInfo[o].appid,w.appidSnDict[t]=r),
n[r]?n[r].push(o):(n[r]=[o],p["weapp_sn_"+o]=w.appidSnInfo[o].sn);
}
var c="/mp/appmsg_weapp?action=batch_get_weapp";
for(var s in p)c+="&"+s+"="+encodeURIComponent(p[s]);
l({
url:c,
type:"GET",
dataType:"json",
async:!0,
success:function(e){
try{
if(console.log("weapp_common success:",e),w.appidInfoResp=e,e.base_resp.ret)throw new Error("Fetch weapp info but get ret="+e.base_resp.ret);
w.data={
infoMap:{},
appid:e.appid||"",
appmsg_compact_url:e.appmsg_compact_url||"",
pathArgs:"appid="+encodeURIComponent(e.appid)+(e.appmsg_compact_url?"&appmsg_compact_url="+encodeURIComponent(e.appmsg_compact_url):"")
};
for(var p=e.weapp_info,a=0;a<p.length;a++){
var n=p[a].weapp_appid;
w.data.infoMap[n]=p[a];
}
w.getInfoState=4;
}catch(o){
w.getInfoState=3,w.appidInfoCatchErr=o;
}
i();
},
error:function(){
w.getInfoState=2,i();
}
});
}
function i(){
if(1==w.getInfoState||2==w.getInfoState)for(var e=0,p=w.appInfoErrQueue.length;p>e;e++){
var a=w.appInfoErrQueue[e];
"function"==typeof a&&a({
code:w.getInfoState
});
}else if(3==w.getInfoState)for(var e=0,p=w.appInfoErrQueue.length;p>e;e++){
var a=w.appInfoErrQueue[e];
"function"==typeof a&&a({
code:w.getInfoState,
resp:w.appidInfoResp,
catchErr:w.appidInfoCatchErr
});
}else if(4==w.getInfoState)for(var e=0,p=w.appInfoSucQueue.length;p>e;e++){
var a=w.appInfoSucQueue[e];
"function"==typeof a&&a({
resp:w.appidInfoResp,
data:w.data
});
}
w.appInfoErrQueue=[],w.appInfoSucQueue=[];
}
function c(e){
console.log("getAppidInfo",w),1!=w.getInfoState&&2!=w.getInfoState||"function"!=typeof e.onError?3==w.getInfoState&&"function"==typeof e.onError?e.onError({
code:w.getInfoState,
resp:w.appidInfoResp,
catchErr:w.appidInfoCatchErr
}):4==w.getInfoState&&"function"==typeof e.onSuccess?e.onSuccess({
resp:w.appidInfoResp,
data:w.data
}):("function"==typeof e.onSuccess&&w.appInfoSucQueue.push(e.onSuccess),"function"==typeof e.onError&&w.appInfoErrQueue.push(e.onError)):e.onError({
code:w.getInfoState
});
}
function s(e,p){
var a={
__biz:window.biz||"",
mid:window.mid||"",
idx:window.idx||"",
weapp_appid:e.appid||"",
weapp_sn:w.appidSnDict[e.appid]||"",
path:e.path||""
},n="/mp/appmsg_weapp?action=get_wxa_code";
for(var o in a)n+="&"+o+"="+encodeURIComponent(a[o]);
l({
url:n,
type:"GET",
dataType:"json",
async:!0,
success:function(e){
e.base_resp&&0===e.base_resp.ret?p&&p(e.url):p&&p();
},
error:function(){
p&&p();
}
});
}
function f(e){
if(!e)return"";
var p="",a=e.indexOf("?"),n=w.data&&w.data.pathArgs?w.data.pathArgs:"";
return p=a>=0?e.slice(0,a)+(a>0?".html":"")+e.slice(a)+"&"+n:e+(""!==e?".html?":"?")+n,
p.replace(/&amp;/g,"&");
}
function u(e){
var p="",a=e.indexOf("?");
return p=e.slice(0,a)+(a>0?".html":"")+e.slice(a);
}
function d(e){
e=e||{};
var p;
if(e.options)p=e.options,p.relativeURL&&(p.relativeURL=p.relativeURL.replace(/&amp;/g,"&"),
p.relativeURL.indexOf(".html")<0&&(p.relativeURL=f(p.relativeURL)));else if(e.appid&&(w.data||e.cps_weapp_username)){
var a;
e.cps_weapp_username?(a={},a.weapp_username=e.cps_weapp_username,a.app_version=e.cps_weapp_version):a=w.data.infoMap[e.appid],
a&&(p={
userName:a.weapp_username,
scene:e.scene,
sceneNote:e.sceneNote,
relativeURL:f(e.path)
},void 0!==a.app_version&&(p.appVersion=a.app_version),e.cps_weapp_username&&(p.relativeURL=u(e.path)));
}
p&&(e.privateExtraData&&(p.privateExtraData=e.privateExtraData),e.sourceAppId&&(p.sourceAppId=e.sourceAppId),
p.scene=p.scene||1058,p.appVersion=p.appVersion||1,p.userName=o(p.userName),console.log("weapp257",p),
w.canJumpOnTap?I.invoke("openWeApp",p,function(p){
"system:function_not_exist"===p.err_msg?w.isNonWechat?("function"!=typeof e.beforeNonWechatWarn||e.beforeNonWechatWarn()!==!1)&&_():("function"!=typeof e.beforeJumpBackupPage||e.beforeJumpBackupPage()!==!1)&&m(e.appid):"function"==typeof e.onJsapiCallback&&e.onJsapiCallback(p);
}):w.isNonWechat?("function"!=typeof e.beforeNonWechatWarn||e.beforeNonWechatWarn()!==!1)&&_():("function"!=typeof e.beforeJumpBackupPage||e.beforeJumpBackupPage()!==!1)&&m(e.appid));
}
function m(e){
location.href="https://mp.weixin.qq.com/mp/waerrpage?type=upgrade&appid="+encodeURIComponent(e)+"#wechat_redirect";
}
function _(){
setTimeout(function(){
n("Open Mini Program in WeChat");
},0);
}
function g(e){
var p={
userNames:[o(e)]
};
I.invoke("preloadMiniProgramContacts",p),I.invoke("preloadMiniProgramEnv",p);
}
var l=e("biz_wap/utils/ajax.js"),I=e("biz_wap/jsapi/core.js"),w={
canJumpOnTap:!1,
isNonWechat:!1,
data:null,
appidInfoResp:null,
appidInfoCatchErr:null,
appInfoSucQueue:[],
appInfoErrQueue:[],
appidSnInfo:[],
appidSnDict:{},
getInfoState:0
},h="@app";
return t(),{
canJumpOnTap:w.canJumpOnTap,
isNonWechat:w.isNonWechat,
getAppidInfo:c,
getAppidCode:s,
appidSnInfo:w.appidSnInfo,
getRelativeURL:f,
jumpUrl:d,
preloadMiniProgram:g
};
});define("biz_common/utils/string/html.js",[],function(){
"use strict";
return String.prototype.html=function(t){
var e,n=["&#96;","`","&#39;","'","&quot;",'"',"&nbsp;"," ","&gt;",">","&lt;","<","&yen;","¥","&amp;","&"],r=["&","&amp;","¥","&yen;","<","&lt;",">","&gt;"," ","&nbsp;",'"',"&quot;","'","&#39;","`","&#96;"];
e=t?r:n;
for(var o=0,i=this;o<e.length;o+=2)i=i.replace(new RegExp(e[o],"g"),e[o+1]);
return i;
},String.prototype.htmlEncode=function(){
return this.html(!0);
},String.prototype.htmlDecode=function(){
return this.html(!1);
},String.prototype.getPureText=function(){
return this.replace(/<\/?[^>]*\/?>/g,"");
},String.prototype.htmlLite=function(t){
var e=["&#96;","`","&#39;","'","&quot;",'"',"&gt;",">","&lt;","<","&amp;","&"];
t&&e.reverse();
for(var n=0,r=this;n<e.length;n+=2)r=r.replace(new RegExp(e[n],"g"),e[n+1]);
return r;
},String.prototype.htmlEncodeLite=function(){
return this.htmlLite(!0);
},String.prototype.htmlDecodeLite=function(){
return this.htmlLite(!1);
},{
htmlDecode:function(t){
return t.htmlDecode();
},
htmlEncode:function(t){
return t.htmlEncode();
},
getPureText:function(t){
return t.getPureText();
},
htmlEncodeLite:function(t){
return t.htmlEncodeLite();
},
htmlDecodeLite:function(t){
return t.htmlDecodeLite();
}
};
});define("cps/tpl/list_tpl.html.js",[],function(){
return'<# if(cps_isready == true){ #> <!--cps 数据ready-->\n    <# if(cps_state == \'no_cps\'){ #>\n        <!--违规-->\n        <section class="cps_inner cps_inner_list cps_inner_empty js_product_err_container">\n            <p>此内容因违规，暂无法查看</p>\n        </section>\n    <# } else { #>\n        <!--正常-->\n        <section class="cps_inner cps_inner_list js_list_container js_product_container<# if(pid_type == \'book\' || pid_type != \'movie\'){ #> cps_inner_book<# } #>">\n            <div class="cps_inner_wrp js_product_loop_content">\n                <div class="cps_inner_content">\n                    <figure class="cps_inner_image_container">\n                        <span class="js_cover cps_inner_image" style="background: url(<#=img_url#>) no-repeat center bottom; background-size: cover;"></span>\n                    </figure>\n                    <# if(is_ad == 1){ #>\n                    <span class="cps_inner_info_adTag js_cps_adTag">Ad</span>\n                    <# } #>\n                    <div class="cps_inner_info">\n                        <div class="cps_inner_info_hd <# if(typeof price === \'undefined\' || pid_type === \'book\' || pid_type === \'movie\'){ #>cps_inner_info_hd_has-desc<# } #>">\n                            <h2 class="cps_inner_info_title"><#=title#></h2>\n                            <# if(typeof price === \'undefined\' || pid_type === \'book\' || pid_type === \'movie\'){ #>\n                            <p class="cps_inner_info_desc a"><#=desc#></p>\n                            <# } #>\n                            <div class="cps_inner_info_from">\n                                <span style="background: url(<#=source_logo_url#>) no-repeat center;\n                                background-size: contain;" class="cps_inner_ic_from"></span><#=source_name#>\n                            </div>\n                        </div>\n        \n                        <div class="cps_inner_info_ft">\n                            <span class="cps_inner_btn_cps_info <# if(is_ad == 1){ #>buy<# } #>"><!--<i class="cps_inner_ic_miniapp"></i><# if(is_ad == 1){ #>购买<# } else { #>详情<# } #>--></span>\n                            <# if(typeof price !== \'undefined\' && pid_type !== \'book\' && pid_type !== \'movie\'){ #>\n                            <p class="cps_inner_info_desc b price"><span class="price_sign">¥</span><#=price#></p>\n                            <# } #>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    <# } #>\n<# }else{ #>\n    <section class="cps_inner cps_inner_list cps_inner_placeholder">\n        <div class="cps_inner_wrp" data-templateid="" data-pid="{{pid1}}" data-order="" data-packid="" data-wxaappid="{{wxa_appid1}}" data-wxapath="{{url_path1}}">\n            <!-- 数据加载成功模板 -->\n            <div class="cps_inner_content">\n                <figure class="cps_inner_image_container">\n                    <span width="100%" class="cps_inner_image"></span>\n                </figure>\n                <div class="cps_inner_info">\n                    <div class="cps_inner_info_hd">\n                        <h2 class="cps_inner_info_title"></h2>\n                    </div>\n                    <div class="cps_inner_info_ft"></div>\n                </div>\n            </div>\n        </div>\n    </section>\n<# } #>\n    \n\n\n';
});define("cps/tpl/card_tpl.html.js",[],function(){
return'<!--卡片类型-->\n<# if(cps_isready == true){ #> <!--cps 数据ready-->\n    <# if(cps_state == \'no_cps\'){ #>\n        <!--违规-->\n        <section class="cps_inner cps_inner_card cps_inner_empty js_product_err_container js_banner_container">\n            <p>此内容因违规，暂无法查看</p>\n        </section>\n    \n    <# } else {#>\n        <!--正常-->\n        <section class="cps_inner cps_inner_card js_product_container js_banner_container">\n            <div class="cps_inner_wrp js_product_loop_content">\n                <div class="cps_inner_content">\n                    <figure class="cps_inner_image_container">\n                        <span width="100%" class="js_cover cps_inner_image" style="background: url(<#=img_url#>) no-repeat center; background-size:cover;"></span>\n                        <# if(is_ad == 1){ #>\n                        <span class="cps_inner_info_adTag js_cps_adTag">广告</span>\n                        <# } #>\n                    </figure>\n                    <div class="cps_inner_info">\n                        <div class="cps_inner_info_hd">\n                            <h2 class="cps_inner_info_title <# if(typeof price !== \'undefined\' && pid_type !== \'book\' && pid_type !== \'movie\'){ #>line2<# } #>"><#=title#></h2> <!--通用模版带金额，title 可以显示2行-->\n                            <div class="cps_inner_info_from">\n                                <span class="cps_inner_ic_from" style="background: url(<#=source_logo_url#>) no-repeat center;\n                                background-size: contain;"></span><#=source_name#>\n                            </div>\n                        </div>\n                        <div class="cps_inner_info_ft">\n                            <span class="cps_inner_btn_cps_info <# if(is_ad == 1){ #>buy<# } #>"><!--<i class="cps_inner_ic_miniapp"></i><# if(is_ad == 1){ #>购买<# } else { #>详情<# } #>--></span>\n                            <# if(typeof price !== \'undefined\' && pid_type !== \'book\' && pid_type !== \'movie\'){ #>\n                            <p class="cps_inner_info_desc e"><span class="price_sign">¥</span><#=price#></p>\n                            <# } #>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    \n    <# } #>\n<# }else{ #>\n    <section class="cps_inner cps_inner_card cps_inner_placeholder">\n        <div class="cps_inner_wrp">\n            <!-- 数据加载成功模板 -->\n            <div class="cps_inner_content">\n                <figure class="cps_inner_image_container">\n                    <span class="cps_inner_image"></span>\n                </figure>\n                <div class="cps_inner_info">\n                    <div class="cps_inner_info_hd">\n                        <h2 class="cps_inner_info_title"></h2>\n                    </div>\n                    <div class="cps_inner_info_ft"></div>\n                </div>\n            </div>\n        </div>\n    </section>\n<# } #>';
});define("cps/tpl/banner_tpl.html.js",[],function(){
return'<# if(cps_isready == true){ #> <!--cps 数据ready-->\n    <# if(cps_state == \'no_cps\'){ #>\n        <!--违规-->\n        <section class="cps_inner cps_inner_banner cps_inner_empty js_product_err_container js_banner_container">\n            <p>此内容因违规，暂无法查看</p>\n        </section>\n    \n    <# } else {#>\n        <!--正常-->\n        <section class="cps_inner cps_inner_banner js_product_container js_banner_container">\n            <div class="cps_inner_wrp js_product_loop_content">\n                <div class="cps_inner_content">\n                    <figure class="cps_inner_image_container">\n                        <span width="100%" class="js_cover cps_inner_image" style="background: url(<#=img_url#>) no-repeat center; background-size: cover;"></span>\n                    </figure>\n                    <# if(is_ad == 1){ #>\n                    <span class="cps_inner_info_adTag js_cps_adTag">Ad</span>\n                    <# } #>\n                    <div class="cps_inner_info_container">\n                        <h2 class="cps_inner_info_title"><#=title#></h2>\n                        <div class="cps_inner_info">\n                            <div class="cps_inner_info_hd">\n                                <p class="cps_inner_info_desc c"><#=desc#></p>\n                                <div class="cps_inner_info_from">\n                                    <span class="cps_inner_ic_from" style="background: url(<#=source_logo_url#>) no-repeat center;\n                                    background-size: contain;"></span><#=source_name#>\n                                </div>\n                            </div>\n                            <div class="cps_inner_info_ft">\n                                <span class="cps_inner_btn_cps_info <# if(is_ad == 1){ #>buy<# } #>"><!--<i class="cps_inner_ic_miniapp"></i><# if(is_ad == 1){ #>购买<# } else { #>详情<# } #>--></span>\n                            </div>\n                        </div>\n                    </div>\n                    \n                </div>\n            </div>\n        </section>\n    \n    <# } #>\n<# }else{ #>\n    <section class="cps_inner cps_inner_banner cps_inner_placeholder">\n        <div class="cps_inner_wrp">\n            <!-- 数据加载成功模板 -->\n            <div class="cps_inner_content">\n                <figure class="cps_inner_image_container">\n                    <span width="100%" class="cps_inner_image"></span>\n                </figure>\n                <div class="cps_inner_info">\n                    <div class="cps_inner_info_hd">\n                        <h2 class="cps_inner_info_title"></h2>\n                        <p class="cps_inner_info_desc d"></p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </section>\n<# } #>\n';
});define("biz_common/tmpl.js",[],function(){
"use strict";
function n(n,e){
var r="";
return r=n.replace(/[\r\t\n]/g," ").split("<#").join("	").replace(/((^|#>)[^\t]*)'/g,"$1\r"),
r=e?r.replace(/\t==(.*?)#>/g,"',$1,'").replace(/\t=(.*?)#>/g,"', String($1).replace(/&/g,'&amp;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') ,'"):r.replace(/\t=(.*?)#>/g,"',$1,'"),
r=r.split("	").join("');").split("#>").join("p.push('").split("\r").join("\\'");
}
var e=function(e,r,t){
var p=n(e,t),i=function(){};
try{
i=new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+p+"');}return p.join('');");
}catch(c){
e=e.replace(/\'/g,"&#39;").replace(/'/g,"&#39;"),p=n(e,t),i=new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+p+"');}return p.join('');");
}
return i(r);
},r=function(n,r,t){
var p=document.getElementById(n);
return p?e(p.innerHTML,r,t):"";
};
return{
render:r,
tmpl:e
};
});define("appmsg/set_font_size.js",["biz_wap/utils/mmversion.js","biz_wap/jsapi/core.js","biz_wap/utils/device.js"],function(e){
"use strict";
function t(e,t){
for(var n=[],o=document.createTreeWalker(e,4);o.nextNode();){
var i=o.currentNode.parentNode,a=i.getAttribute("mp-original-font-size");
a||(a=getComputedStyle(i).fontSize,i.setAttribute("mp-original-font-size",a)),n.push([i,a]);
}
n.forEach(function(e){
e[0].style.fontSize=parseFloat(e[1])*t+"px";
});
}
function n(e){
"function"==typeof e&&s.push(e);
}
var o=e("biz_wap/utils/mmversion.js"),i=e("biz_wap/jsapi/core.js"),a=e("biz_wap/utils/device.js"),s=[];
return o.isIOS&&location.href.match(/fontScale=\d+/)&&i.on("menu:setfont",function(e){
parseFloat(e.fontScale)<=0&&(e.fontScale=100),a.os.ipad&&a.os.getNumVersion()>=13?(t(document.getElementsByTagName("html").item(0),e.fontScale/100),
window.ipados13_font_scale=e.fontScale):document.getElementsByTagName("html").item(0).style.webkitTextSizeAdjust=e.fontScale+"%",
s.forEach(function(t){
return t(e);
});
}),{
setFontSize:t,
onFontScaleChange:n
};
});define("biz_wap/ui/weui.js",[],function(){
"use strict";
function e(){
for(var e=document.getElementsByTagName("link"),i=/^http(s)?:\/\/res\.wx\.qq\.com\/open\/libs\/weui\/([^\/]*)\/weui(\.min)?\.css$/,n=0;n<e.length;n++){
var t=(e[n].href.match(i)||[])[2];
if(t){
if("1"===t[0])return!0;
console.warn("Weui.css("+t+") in page is deprecated. Weui.css(1.0+) will be insert in page automatically.");
}
}
return!1;
}
function i(){
var e=["actionSheet","alert","confirm","dialog","validate","checkIfBlur","gallery","loading","picker","datePicker","searchBar","slider","tab","toast","topTips","uploader"];
window.weui={};
for(var i=0;i<e.length;i++)!function(i){
window.weui[e[i]]=function(){
a.push({
name:e[i],
args:arguments
}),console.info(e[i]+" will be executed after weui.js loaded.");
};
}(i);
}
function n(){
var e=document.createElement("script");
e.onload=function(){
for(var e=0;e<a.length;e++)window.weui[a[e].name].apply(window,a[e].args);
},e.onerror=function(){
throw new Error("weui.js loaded fail.");
},e.src=r,document.body.appendChild(e);
}
var t="https://res.wx.qq.com/open/libs/weui/2.2.0/weui.min.css",r="https://res.wx.qq.com/open/libs/weuijs/1.2.1/weui.min.js",a=[];
if(!e()){
var o=document.createElement("link");
o.href=t,o.rel="stylesheet",document.head.appendChild(o);
}
i(),n();
});function _typeof(e){
return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e;
}
define("appmsg/index.js",["biz_wap/ui/weui.js","appmsg/set_font_size.js","biz_common/tmpl.js","cps/tpl/banner_tpl.html.js","cps/tpl/card_tpl.html.js","cps/tpl/list_tpl.html.js","biz_common/utils/string/html.js","appmsg/weapp_common.js","biz_wap/utils/device.js","biz_common/dom/class.js","appmsg/log.js","biz_wap/utils/ajax.js","biz_common/dom/attr.js","appmsg/max_age.js","biz_wap/utils/mmversion.js","appmsg/test.js","biz_common/dom/event.js","biz_wap/jsapi/core.js","biz_common/moment.js","appmsg/appmsg_report.js","biz_common/utils/url/parse.js","a/mpAdAsync.js","biz_wap/utils/wapsdk.js","common/utils.js","complain/localstorage.js","appmsg/popup_report.js","appmsg/pay_report_utils.js","appmsg/loading.js","appmsg/finance_communicate.js","appmsg/topbar.js","biz_wap/utils/jsmonitor_report.js","appmsg/getForbidConfig.js","page/appmsg_new/combo.css","page/appmsg_new/not_in_mm.css","appmsg/cdn_img_lib.js","appmsg/share.js","biz_common/log/jserr.js","biz_wap/ui/lazyload_img.js","appmsg/async.js","appmsg/copyright_report.js","appmsg/outer_link.js","appmsg/review_image.js","appmsg/album.js","appmsg/product.js","appmsg/page_pos.js","appmsg/iframe.js","appmsg/qqmusic.js","appmsg/voice.js","redpackage/redpacketcover.js","appmsg/search/search.js","appmsg/autoread.js","appmsg/voicemsg.js","appmsg/weproduct.js","appmsg/weapp.js","question_answer/appmsg.js","appmsg/wxtopic.js","appmsg/cdn_speed_report.js","appmsg/appmsg_copy_report.js","appmsg/report_and_source.js","appmsg/report.js","appmsg/fereport_without_localstorage.js","appmsg/fereport.js","biz_wap/safe/mutation_observer_report.js","sougou/index.js"],function(e){
"use strict";
function t(e){
for(var t=window.location.search,o=t.substring(1,t.length).split("&"),i=0;i<o.length;i++){
var n=o[i].split("=");
if(n[0].toUpperCase()===e.toUpperCase())return n[1];
}
return"";
}
function o(){
function o(e){
if(e&&0!=e.length){
for(var t={
batch_no:A.getQuery("batch_no")||"",
bizuin:window.biz||"",
biz:window.biz||"",
mid:window.mid||"",
idx:window.idx||"",
total:e.length
},o=0;o<e.length;o++){
var i=e[o],n=o+1;
for(var a in i)i.hasOwnProperty(a)&&(t[a+""+n]=i[a]);
}
m({
url:"/mp/productreport?",
type:"POST",
data:t,
dataType:"json",
async:!0
});
}
}
function C(){
Q&&clearTimeout(Q),Q=setTimeout(function(){
try{
Q=null;
for(var e=0;e<V.length;e++){
var t=V[e],i=w.attr(t,"data-showed");
if("no"==i){
var n=t.getElementsByClassName("js_product_loop_content");
if(n.length>0){
n=n[0];
var a=n.getBoundingClientRect(),r=a.height||a.bottom-a.top;
if(r>0&&a.top<x.getInnerHeight()&&a.bottom>0){
t.setAttribute("data-showed","yes");
var s=n.getAttribute("data-pid");
s&&o([{
wxa_appid:n.getAttribute("data-wxaappid"),
pid:s,
type:3,
absolute_order:e+1,
appid:n.getAttribute("data-appid")||"",
templateid:n.getAttribute("data-templateid")||"",
relative_order:1*n.getAttribute("data-order"),
packid:n.getAttribute("data-packid")||""
}]);
}
}
}
}
}catch(d){}
},100);
}
function R(e){
try{
for(var c=window.pageYOffset||document.documentElement.scrollTop,l=0;l<V.length;l+=M){
var g=V[l];
if(!(g.offsetTop>c+x.getInnerHeight()+100)){
var u=w.attr(g,"data-cpsstatus");
if("hide"==u){
g.setAttribute("data-cpsstatus","loading");
for(var f=""+l,y=1,v=l+1;v<V.length&&l+M>v;v++)f=f+"%2c"+v,y++;
var b=Math.ceil(1e7*Math.random());
if(""!==t("mockcps"))var A="/mp/cps_product_info?biz="+window.biz+"&mid="+window.mid+"&idx="+window.idx+"&cpslist="+f+"&sn="+window.sn+"&mockcps="+t("mockcps");else var A="/mp/cps_product_info?biz="+window.biz+"&mid="+window.mid+"&idx="+window.idx+"&cpslist="+f+"&sn="+window.sn+"&istempurl="+(window.is_temp_url||0)+"&random="+b;
!function(e,t,c){
m({
url:t,
type:"GET",
dataType:"json",
async:!0,
error:function(){
try{
window.__addIdKeyReport("64469","18",c);
}catch(e){}
},
success:function(e){
try{
window.__addIdKeyReport("64469","16",e.product_list.length),e.product_list.length<c&&window.__addIdKeyReport("64469","18",c-e.product_list.length);
for(var t=0;t<e.product_list.length;t++){
e.product_list[t].data.cps_isready=!0,e.product_list[t].data.pid_type=e.product_list[t].data.pid_type||e.product_list[t].attr.pid_type;
var l=V[e.product_list[t].index],m=e.product_list[t].template_id;
"list"==m?l.innerHTML=n.tmpl(s,e.product_list[t].data):"banner"==m?l.innerHTML=n.tmpl(a,e.product_list[t].data):"card"==m&&(l.innerHTML=n.tmpl(r,e.product_list[t].data)),
e.product_list[t].weapp_username&&(e.product_list[t].attr.weapp_username=e.product_list[t].weapp_username),
e.product_list[t].weapp_version&&(e.product_list[t].attr.weapp_version=e.product_list[t].weapp_version),
l.setAttribute("data-cpsstatus","complete");
for(var g=l.getElementsByClassName("js_product_loop_content"),u=0;u<g.length;u++)for(var f in e.product_list[t].attr)g[u].setAttribute("data-"+f,e.product_list[t].attr[f]);
for(var y=l.getElementsByTagName("img"),u=0;u<y.length;u++)y[u].src=w.attr(y[u],"data-src");
!function(e,t){
if(h.on(e,"tap",".js_product_loop_content",function(e){
try{
var i=e.delegatedTarget,n=i.getAttribute("data-wxaappid"),a=i.getAttribute("data-wxapath"),r=i.getAttribute("data-pid"),s=i.getAttribute("data-appid"),p=i.getAttribute("data-cpspackage"),c=Math.floor((new Date).getTime()/1e3)+5184e3,l=i.getAttribute("data-weapp_username"),m=i.getAttribute("data-weapp_version");
d.jumpUrl({
cps_weapp_username:l,
cps_weapp_version:m,
privateExtraData:{
cookies:"cps_package="+encodeURIComponent(p)+"; expires="+c+"; busid=mmbiz_ad_cps; domain=*; spread=*"
},
sourceAppId:s,
appid:n,
path:a,
scene:1091,
sceneNote:encodeURIComponent(location.href)+":"+encodeURIComponent(r),
beforeNonWechatWarn:function(){},
beforeJumpBackupPage:function(){},
onJsapiCallback:function(e){
"openWeApp:ok"===e.err_msg&&r&&o([{
wxa_appid:n,
pid:r,
type:4,
absolute_order:t+1,
appid:i.getAttribute("data-appid")||"",
templateid:i.getAttribute("data-templateid")||"",
relative_order:1*i.getAttribute("data-order"),
packid:i.getAttribute("data-packid")||""
}]);
}
});
}catch(e){}
return!1;
}),_.isIOS&&location.href.match(/fontScale=\d+/)&&p.os.ipad&&p.os.getNumVersion()>=13){
var n=location.href.match(/fontScale=(\d+)/);
i(e,parseFloat(n[1])/100);
}
}(l,e.product_list[t].index);
}
C();
}catch(v){
window.__addIdKeyReport("64469","18",e.product_list.length);
}
}
});
}(f,A,y);
}
}
}
}catch(e){
console.log(e);
}
}
function O(e){
try{
G&&clearTimeout(G),G=setTimeout(function(){
R(e);
},300);
}catch(e){}
}
function L(e,t){
var o={
lossy:"UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
lossless:"UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
alpha:"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
animation:"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
},i=new Image;
i.onload=function(){
var o=i.width>0&&i.height>0;
t(e,o);
},i.onerror=function(){
t(e,!1);
},i.src="data:image/webp;base64,"+o[e];
}
function K(){
var e=window.performance||window.msPerformance||window.webkitPerformance;
if(e.timing){
var t=e.timing;
l("[Appmsg] dns:"+(t.domainLookupEnd-t.domainLookupStart)+"^^^ ssl:"+(0==t.secureConnectionStart?0:t.connectEnd-t.secureConnectionStart)+"^^^ tcp:"+(t.connectEnd-t.connectStart)+"^^^ request:"+(t.responseStart-t.requestStart)+"^^^ getPackageTime:"+(t.responseEnd-t.responseStart)+"^^^ domCententLoaded:"+(t.domContentLoadedEventStart-t.domLoading)+"^^^ domComplete:"+(t.domComplete-t.domLoading)+"^^^ firstViewTime:"+(real_show_page_time-t.navigationStart)+"^^^ interactiveTime:"+(page_endtime-t.navigationStart))+"^^^ ua:"+window.navigator.userAgent,
setTimeout(function(){
t.loadEventEnd&&l("[Appmsg] onload:"+(t.loadEventEnd-t.loadEventStart));
},100);
}
"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){
return this.replace(/^\s+|\s+$/g,"");
}),""==document.getElementById("js_content").innerHTML.trim()&&T.setSum(24729,94,1);
var o=Math.random();
.001>o&&document.getElementById("js_read_area3")&&document.getElementById("js_read_area3").innerText&&document.getElementById("js_read_area3").innerText.indexOf("Pageview")>-1&&T.setSum(24729,95,1),
window.__wxjs_is_wkwebview&&T.setSum(28307,67,1);
}
try{
var V=document.getElementsByTagName("mpcps");
window.__addIdKeyReport("64469","15",V.length);
for(var W=0;W<V.length;W++){
V[W].setAttribute("data-cpsstatus","hide"),V[W].setAttribute("data-showed","no");
var U={
cps_isready:!1,
cps_state:"",
pid_type:"",
img_url:"",
title:"",
desc:"",
source_name:"",
source_logo_url:"",
is_ad:1
},F=w.attr(V[W],"data-templateid");
"list"==F?V[W].innerHTML=n.tmpl(s,U):"banner"==F?V[W].innerHTML=n.tmpl(a,U):"card"==F&&(V[W].innerHTML=n.tmpl(r,U));
}
}catch(H){
console.log(H);
}
setTimeout(function(){
var e=document.getElementsByClassName("wx-edui-video_source_link");
e=Array.prototype.slice.call(e),e.forEach(function(e){
e&&e.addEventListener("click",function(){
var t=e.dataset.hitUsername;
y.invoke("profile",{
username:t
});
});
});
},500);
var G,Q=null;
C(),h.on(window,"scroll",C),R(),h.on(window,"scroll",O),window.is_new_msg&&-1!=navigator.userAgent.indexOf("MicroMessenger")&&(window.title&&(window.title=window.title.replace(/&#39;/g,"'").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&")),
window.msg_title&&(window.msg_title=window.msg_title.replace(/&#39;/g,"'").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&")),
hd_head_img||I.jsmonitor({
id:115849,
key:26,
value:1
}),B.init({
userName:window.user_name,
bizNickName:window.nickname,
bizNickNameBackup:window.title,
title:window.msg_title,
headImg:window.hd_head_img,
reportData:{
BizUin:window.biz,
AppMsgID:1*window.mid,
ItemIndex:1*window.idx,
Scene:1*window.source,
SubScene:1*window.subscene,
EnterId:1*window.enterid,
SessionId:window.sessionid,
ItemShowType:1*window.item_show_type
}
}),y.invoke("createWebViewForFastLoad",{
scene:1
},function(e){
console.log(e);
}));
var J=document.getElementsByTagName("body");
if(!J||!J[0])return!1;
J=J[0],function(){
function e(){
if(i.length)for(var e=document.documentElement.scrollTop||document.body.scrollTop,t=0;t<i.length;t++)if(1!=i[t].getAttribute("hasload")){
var o=i[t].getBoundingClientRect();
(o.top<d+e&&o.top>e||o.top+o.height>e&&o.top+o.height<d+e)&&i[t].getAttribute("href").length>0&&(i[t].setAttribute("hasload",1),
y.invoke("downloadPageDataForFastLoad",{
itemList:[{
item_show_type:i[t].getAttribute("data-itemshowtype"),
url:i[t].getAttribute("href")
}]
},function(e){
console.log(e);
}),i.splice(t,1),t--);
}
}
function t(){
for(var e=0;e<r.length;e++){
var t=r[e],o=t.getBoundingClientRect();
(o.top<=0&&o.top+o.height>=0||o.top>0&&o.top<d)&&(r.splice(e,1),e--,k.report([1,k.getRedirectType(t.parentNode.getAttribute("href")),"",img_popup?1:0,window.source,k.getUrlData(t.parentNode.getAttribute("href"))]));
}
for(var e=0;e<s.length;e++){
var t=s[e],o=t.getBoundingClientRect();
(o.top<=0&&o.top+o.height>=0||o.top>0&&o.top<d)&&(s.splice(e,1),e--,k.report([1,1,"",img_popup?1:0,window.source,t.getAttribute("data-miniprogram-appid")]));
}
}
function o(){
e(),t();
}
for(var i=[],n=document.getElementById("js_content").getElementsByTagName("a"),a=0;a<n.length;a++)null!==n[a].getAttribute("data-itemshowtype")&&i.push(n[a]);
var r=[];
Array.prototype.map.call(document.getElementById("js_content").getElementsByClassName("h5_image_link"),function(e){
e.parentNode.getAttribute("href")&&e.parentNode.getAttribute("href").length>0&&r.push(e);
});
var s=[];
Array.prototype.map.call(document.getElementById("js_content").getElementsByClassName("weapp_image_link"),function(e){
s.push(e);
});
var d=window.innerHeight||document.documentElement.clientHeight;
h.on(window,"scroll",o),o();
}(),function(){
y.on("onScreenShot",function(){
T.setSum(114217,15,1);
}),window.isPaySubscribe&&(y.on("onScreenShot",function(){
E.reportPayAppmsg(6);
}),window.isPaid||!function(){
var e="isPaid-"+window.biz+"-"+window.mid+"-"+window.idx,t=document.getElementById("js_pay_panel"),o=t.getElementsByClassName("js_pay_btn")[0],i=document.getElementById("js_pay_panel_bottom"),n=window.getComputedStyle(i),a=40+parseInt(n.paddingTop,10)+parseInt(n.paddingBottom,10),r=_.isWindows||_.isMac&&!_.isIOS,s=_.isGooglePlay;
if(_.isAndroid&&(y.invoke("handleMPPageAction",{
action:"isGPVersion"
},function(e){
console.log("GPVersion",e),e.err_msg.indexOf("ok")>-1&&(s=1*e.GPVersion);
}),"1"===window.localStorage.getItem(e)&&E.report110809(30)),r)for(var d=document.getElementsByClassName("js_pay_qrcode"),p="/mp/paysubqrcode?action=get_article_qrcode&__biz="+window.biz+"&mid="+window.mid+"&idx="+window.idx+"&sn="+window.sn+"#wechat_redirect",l=0,w=d.length;w>l;l++)d[l].src=p;
_.isInMiniProgram&&(c.addClass(o,"btn_disabled"),c.addClass(i.getElementsByClassName("js_pay_btn")[0],"btn_disabled")),
_.isIOS&&window.payShowIAPPrice&&!function(){
var e=setTimeout(function(){
e=null,console.log("getIAPProductInfo timeout"),E.reportOverseaPay("",0,1,0,"",2,"");
},3e3),o=Date.now();
y.invoke("handleMPPageAction",{
action:"getIAPProductInfo",
productId:window.payProductId
},function(n){
if("number"==typeof e){
clearTimeout(e);
var a=Date.now()-o;
if(console.log("getIAPProductInfo",n,a+"ms"),-1!==n.err_msg.indexOf(":ok")){
if(E.report110809(38),window.payProductId!==n.productId)return void E.report110809(44);
var r=[t.getElementsByClassName("js_pay_fee")[0],i.getElementsByClassName("js_pay_fee")[0]];
r.forEach(function(e){
var t="CNY"!==n.currencyCode?n.currencySymbol:"￥";
e.innerHTML=t+n.price.toFixed(2),e.parentNode.dataset.ready=1;
}),window.oriProductFee?("CNY"!==n.currencyCode&&E.report110809(40),E.reportOverseaPay(n.currencyCode,100*n.price.toFixed(2),1,a,n.countryCode,0,n.err_msg+(n.err_desc?"__"+n.err_desc:""))):(window.IAPProductInfo=n,
window.IAPProductInfo.invokeTime=a);
}else E.report110809(39),E.reportOverseaPay("",0,1,0,"",1,n.err_msg+(n.err_desc?"__"+n.err_desc:""));
}
});
}(),window.jump2pay&&h.on(window,"load",function(){
window.scrollTo(0,t.getBoundingClientRect().top-x.getInnerHeight()/3);
});
var g=function(){
var e=o.getBoundingClientRect().top;
if(e+a>window.innerHeight){
if(1*window.previewPercent===0)return;
i.className="pay pay__notice pay__notice_show";
}else i.className="pay pay__notice",window.is_finished_preview=1;
};
g(),h.on(window,"scroll",g);
var u=!1,f=function v(t,o){
if(E.report110809ForDevice(32),!_.isInMiniProgram){
if(s)return void window.weui.alert("暂不支持Google Play支付，将微信更新为中国版微信后，可正常付费");
if(!o){
if(!r&&u)return;
if(!_.isWechat&&!r)return void window.weui.alert("Make the payment in WeChat.");
u=!0;
}
var i=t.currentTarget;
if(!r&&1*i.dataset.ready===0)return!o&&z.show("Generating order..."),setTimeout(v,100,{
currentTarget:i
},!0);
if(E.reportPayAppmsg(9),window.is_temp_url)window.weui.alert("A temporary link is free. Please share it with caution to avoid content leakage.",function(){
u=!1,location.replace(location.href+"&temp_is_paid=1");
});else if(r){
var n=function(){
var e="js_pay_qrcode_wrap",t=i.nextElementSibling;
if("block"===t.style.display)return{
v:void 0
};
i.classList.contains("js_article_bottom")&&t.classList[i.getBoundingClientRect().top<300?"add":"remove"]("pay__notice-qrcode_bottom");
var o=function n(o){
if("none"!==t.style.display){
for(var a=o.target;!(null===a||a.classList&&a.classList.contains(e)||a===i);)a=a.parentNode;
a!==i&&(null!==a&&a.classList.contains(e)||(t.style.display="none",h.off(window,"click",n)));
}
};
h.on(window,"click",o),t.style.display="block";
}();
if("object"===("undefined"==typeof n?"undefined":_typeof(n)))return n.v;
}else{
var a=function(){
if(_.isIOS&&_.ltVersion("7.0.10")||_.isAndroid&&_.ltVersion("7.0.10"))return location.replace("https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=page/common_page__upgrade&btn_text=btn_text_0&text=text000"),
{
v:void 0
};
_.isAndroid&&"1"===window.localStorage.getItem(e)&&E.report110809(31),E.report110809ForDevice(34);
var t=function(){
E.reportPayAppmsg(1),y.invoke("handleMPPageAction",{
action:"paySuccess",
fullUrl:window.location.href,
itemShowType:item_show_type
},function(t){
u=!1,E.report110809(t.err_msg.indexOf("ok")>-1?19:20),window.localStorage&&window.localStorage.setItem&&window.localStorage.setItem(e,"1"),
window.__second_open__?window.location.href=window.location.href+"&r="+Math.random()+"#wechat_redirect":window.location.reload();
});
};
z.show("Generating order..."),m({
url:"/mp/paysub?action=create_order",
type:"POST",
dataType:"json",
data:{
__biz:window.biz,
mid:window.mid,
idx:window.idx,
sn:window.sn,
version:window.clientversion.htmlDecode(),
is_from_pc:window.jump2pay
},
async:!0,
success:function(e){
if(e&&e.base_resp&&0===e.base_resp.ret)!function(){
E.report110809(13),E.report110809ForDevice(36);
var o=Math.round(new Date/1e3);
if(_.isIOS){
var i=e.iap_info;
y.invoke("requestVirtualPayment",{
appID:i.appid,
priceLevel:i.price_level,
busiType:23,
busiId:i.busi_id,
productDesc:i.desc,
sign:i.sign,
extInfo:i.ext_info
},function(i){
console.log("requestVirtualPayment res: ",i),i.err_msg.indexOf("ok")>-1?(E.report110809(15),
E.reportPay(o,1,e.order_id),t()):i.err_msg.indexOf("cancel")>-1?(u=!1,E.report110809(28),
E.reportPay(o,2,e.order_id),console.log("pay cancel")):i.err_msg.indexOf("fail")>-1?(u=!1,
E.report110809(16),E.reportPay(o,3,e.order_id,i.err_msg,i.err_code,i.err_domain),
window.weui.alert(i.err_msg.slice(i.err_msg.indexOf("fail")+4))):(u=!1,window.weui.alert(i.err_msg));
}),window.payShowIAPPrice&&!function(){
var e=setTimeout(function(){
e=null,console.log("getIAPProductInfo timeout"),E.reportOverseaPay("",0,2,0,"",2,"");
},3e3),t=Date.now();
y.invoke("handleMPPageAction",{
action:"getIAPProductInfo",
productId:window.payProductId
},function(o){
if("number"==typeof e){
clearTimeout(e);
var i=Date.now()-t;
if(console.log("getIAPProductInfo",o,i+"ms"),-1!==o.err_msg.indexOf(":ok")){
if(E.report110809(41),window.payProductId!==o.productId)return void E.report110809(44);
window.IAPProductInfo?window.IAPProductInfo.currencyCode!==o.currencyCode&&E.report110809(43):window.oriProductFee&&"CNY"!==o.currencyCode&&E.report110809(43),
E.reportOverseaPay(o.currencyCode,100*o.price.toFixed(2),2,i,o.countryCode,0,o.err_msg+(o.err_desc?"__"+o.err_desc:""));
}else E.report110809(42),E.reportOverseaPay("",0,2,0,"",1,o.err_msg+(o.err_desc?"__"+o.err_desc:""));
}
});
}();
}else{
var n=e.midas_info;
window.h5sdk.directPay({
sandbox:!!n.sandbox,
ontimeout:function(){
u=!1,window.weui.alert("Payment timeout. Try again later.");
},
methods:{
onPayEnd:function(i,n){
console.log("directPay res: ",i,n),1===i?(E.report110809(17),E.reportPay(o,1,e.order_id,n,i),
t()):-1===i&&/:cancel$/.test(n)?(u=!1,E.report110809(29),E.reportPay(o,2,e.order_id,n,i),
console.log("pay cancel")):(u=!1,E.report110809(18),E.reportPay(o,3,e.order_id,n,i),
window.weui.alert("Payment failed. Try again later."));
}
}
},{
pf:n.pf,
appid:n.appid,
type:"goods",
openid:n.openid,
extend:{
hideOfferName:1
},
goodstokenurl:n.url_params,
usewxappid:"1",
wx_h5pay:0,
direct_pay_channel:"wechat"
});
}
}();else switch(u=!1,e&&e.base_resp&&e.base_resp.ret){
case 202600:
window.weui.alert("Article has been deleted.");
break;

case 202601:
window.weui.alert('The article is no longer marked as "Original". Unable to purchase.');
break;

case 202602:
window.weui.alert("You have already purchased this article. No additional payment required.",t);
break;

case 202604:
window.weui.alert(e.appmsg_ban_reason_desc?"此内容因"+e.appmsg_ban_reason_desc+"已被封禁，不支持付费":"此内容因违规已被封禁，不支持付费");
break;

case 202607:
window.weui.alert("暂不支持Google Play支付，将微信更新为中国版微信后，可正常付费");
break;

case 202608:
location.replace("https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=page/common_page__upgrade&btn_text=btn_text_0&text=text000");
break;

case 202609:
window.weui.alert("你已成为该公众号的黑名单用户，暂时无法付费");
break;

case 202612:
window.weui.alert("此帐号付费功能已被封禁，不支持付费");
break;

default:
E.report110809(14),window.weui.alert("Order creation failed. Try again later.");
}
},
error:function(){
u=!1,window.weui.alert("System error. Try again later.");
},
complete:function(){
z.hide();
}
});
}();
if("object"===("undefined"==typeof a?"undefined":_typeof(a)))return a.v;
}
}
};
h.tap(o,f),h.tap(i.getElementsByClassName("js_pay_btn")[0],f);
}());
}(),function(){
var e=document.getElementById("js_hotspot_area"),t=0===window.hotspotInfoList.length,o=function i(o){
if(!t){
var n=x.getInnerHeight()+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop);
e.offsetTop<n?(t=!0,h.off(window,"scroll",i),T.setSum(59977,15,1),b.hotspotReport({
hotspotjson:JSON.stringify({
hotspotinfolist:window.hotspotInfoList
})
})):"function"==typeof o&&o();
}
};
o(function(){
h.on(window,"scroll",o);
});
}();
var Y=/^http(s)?:\/\/mp\.weixin\.qq\.com\//g;
try{
if(top!=window&&(!top||top&&location.href&&Y.test(location.href))&&!window.isSg)throw new Error("in iframe");
}catch(H){
var $="",X=new Image;
X.src=("http://mp.weixin.qq.com/mp/jsreport?key=4&content=biz:"+biz+",mid:"+mid+",uin:"+uin+"[key4]"+$+"&r="+Math.random()).substr(0,1024);
}
if(window.isInWeixinApp()&&/#rd$/.test(location.href)&&!window.isWeixinCached&&!window.__second_open__){
var Z=-1!=location.href.indexOf("?")?"&":"?";
location.replace(location.href.replace(/#rd$/,Z+"rd2werd=1#wechat_redirect"));
}
var et=e("biz_common/utils/url/parse.js");
e("appmsg/cdn_img_lib.js"),window.page_endtime=+new Date;
{
var tt=!_.isWp&&-1==navigator.userAgent.indexOf("MicroMessenger");
-1!=navigator.userAgent.indexOf("WindowsWechat");
}
e("appmsg/share.js");
var ot=v(1e3*parseInt(window.modify_time)),it=ot.format("YYYY-MM-DD"),nt=document.getElementById("js_modify_time");
if(nt&&(nt.innerHTML=it),window.isSg||"mp.weixin.qq.com"==location.host){
var at=e("biz_common/log/jserr.js");
at({
key:0,
reporturl:"http://mp.weixin.qq.com/mp/jsreport?1=1",
replaceStr:/http(s)?:(.*?)js\//g
});
}
window.logs.webplog={
lossy:0,
lossless:0,
alpha:0,
animation:0,
total:0
};
var rt=-1!=navigator.userAgent.indexOf("TBS/"),st=function(e,t){
L(e,function(e,o){
if(window.logs.webplog[e]=o?1:0,window.logs.webplog.total++,4==window.logs.webplog.total){
var i=window.logs.webplog,n=Math.random();
rt&&1>=n&&(i.lossy=i.lossless=i.alpha=1,window.logs.webplog=i);
var a=i.lossy&i.lossless&i.alpha;
t(!!a);
}
});
},dt=function(e){
for(var t=document.getElementsByTagName("img"),o=!1,i=!1,n=0,a=t.length;a>n;n++){
var r=t[n].getAttribute("data-src");
r&&r.canHevc()&&(o=!0),r&&r.isGif()&&(i=!0);
}
var s=_.gtVersion("6.5.13",!0)&&i,d=_.gtVersion("6.8.0",!0)&&o,p=!1;
try{
{
top.window.document;
}
}catch(c){
p=!0;
}
(N||navigator.userAgent.indexOf("Br_trunk")>-1)&&_.isIOS&&(s||d)&&!p?(console.info("[HEVC代理] 当前版本可以启用HEVC代理"),
y.invoke("imageProxyInit",{},function(t){
t.err_msg.indexOf(":ok")>-1?(D=t.serverUrl,window.__addIdKeyReport("28307",117)):t.err_msg.indexOf(":fail")>-1&&window.__addIdKeyReport("28307",118),
e();
})):e();
},pt=function(e){
st("lossy",e),st("lossless",e),st("alpha",e),st("animation",e);
};
window.webp=!1,dt(function(){
pt(function(t){
function o(e){
e.width<40||e.height<40||-1==e.className.indexOf("img_loading")&&(e.className+=" img_loading");
}
function i(e){
if(!(e.width<40||e.height<40)){
var t=e.src;
if(e.className=e.className.replace("img_loading",""),-1==e.className.indexOf("img_loadederror")){
e.className+=" img_loadederror",e.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==",
window.__addIdKeyReport("28307",51);
var i=function(){
window.__addIdKeyReport("28307",66),n(e),o(e);
var i=e.__retryload;
return i=0,t=t.https2http(),e.__retryload=i,e.src=et.addParam(t,"retryload",i,!0),
!1;
};
h.on(e,"click",i);
}
}
}
function n(e){
e.className=e.className.replace("img_loading",""),e.className=e.className.replace("img_loadederror","");
}
window.webp=t,t&&window.localStorage&&window.localStorage.setItem&&window.localStorage.setItem("webp","1"),
window.logs.img={
download:{},
read:{},
load:{}
};
var a=document.getElementById("js_cover");
if(a){
var r=a.getAttribute("data-src");
r&&(r.isCDN()&&(r=r.imgChange640(),t&&(r=et.addParam(r,"tp","webp",!0)),r=et.addParam(r,"wxfrom","5",!0),
is_https_res||q?r=r.http2https():("http:"==location.protocol||-1!=navigator.userAgent.indexOf("MicroMessenger"))&&(r=r.https2http())),
setTimeout(function(){
a.onload=function(){
g(a,"height","auto","important"),g(a,"visibility","visible","important");
},a.setAttribute("src",r);
},0),window.logs.img.read[r]=!0,window.logs.img.load[r]=!0,a.removeAttribute("data-src"));
}
var s=e("biz_wap/ui/lazyload_img.js"),d=2;
window.logs.outer_pic=0;
for(var p=document.getElementsByTagName("img"),m=0,w=p.length;w>m;m++){
{
var u=p[m].getAttribute("data-src");
p[m].getAttribute("src");
}
u&&u.isGif()&&p[m].className.indexOf("__bg_gif")<0&&(p[m].className+=" __bg_gif");
}
for(var f=document.getElementsByClassName("__bg_gif"),m=0,w=f.length;w>m;++m)f[m].setAttribute("data-order",m);
var y=function(e){
try{
var t=e,o=t.getAttribute("data-src");
if(!/^https?\:\/\/mmbiz\.qpic\.cn/.test(o))return;
var i=t.parentNode,n=!1;
c.hasClass(i,"js_jump_icon")&&(n=!0);
for(var a=!1;i.tagName&&"body"!=i.tagName.toLowerCase();){
if("a"==i.tagName.toLowerCase()){
var r=i.getAttribute("href")||"";
null!=r.match(/^http/)&&(a=!0);
break;
}
i=i.parentNode;
}
if(n&&!a){
var s=t.parentNode,d=s.parentNode;
if(d){
for(var p=document.createDocumentFragment();s.firstChild;)p.appendChild(s.firstChild);
d.insertBefore(p,s),d.removeChild(s);
}
}else if(!n&&a){
var l=document.createElement("span"),m=getComputedStyle(t);
"static"!=m.positon&&(l.style.position=m.positon),l.style.left=m.left,l.style.top=m.top,
l.style.right=m.right,l.style.bottom=m.bottom,l.style.margin=m.margin,c.addClass(l,"js_jump_icon"),
c.addClass(l,"h5_image_link"),t.style.position="static",t.style.margin="0px",t.parentNode.insertBefore(l,t),
l.appendChild(t),window.__addIdKeyReport("111535",0);
}
}catch(w){}
},v=function z(e){
try{
var t=e.childNodes,o=getComputedStyle(e);
(o.backgroundImage.match(/https\:\/\/mmbiz\.qpic\.cn/)||o.backgroundImage.match(/http\:\/\/mmbiz\.qpic\.cn/))&&window.__addIdKeyReport("111535",2);
for(var i=0;i<t.length;i++)"a"!=t[i].tagName.toLowerCase()&&z(t[i]);
}catch(n){}
};
try{
for(var b=document.getElementsByTagName("a"),A=0;A<b.length;A++){
var j=b.item(A),x=j.getAttribute("href")||"";
null!=x.match(/^http/)&&v(j);
}
}catch(k){}
var E=!1;
new s({
attrKey:"data-src",
imgOccupied:!0,
crossOrigin:!0,
lazyloadHeightWhenWifi:function(){
var e,t=1,o=1;
e=window.svr_time?new Date(1e3*window.svr_time):new Date;
var i=e.getHours();
return i>=20&&23>i&&(t=.5,o=0),{
bottom:t,
top:o
};
},
inImgRead:function(e){
e&&(window.logs.img.read[e]=!0);
},
changeSrc:function(e,t){
if(!t)return"";
var o=t;
if(t.isCDN()){
o=o.imgChange640();
var i,n=window.navigator.userAgent,a=/TBS\/([\d\.]+)/i,r=n.match(a);
r&&r[1]&&(i=parseInt(r[1]));
var s,d=/XWEB\/([\d\.]+)/i,p=n.match(d);
p&&p[1]&&(s=parseInt(p[1]));
var c=1e3,m=window.user_uin||0,w=0!==m&&Math.floor(m/100)%1e3<c,g=(i>=43305&&44206!=i||s>=16)&&o.isGif(),u=0!==m&&Math.floor(m/100)%1e3<=500,f=s>=564&&o.canHevc()&&_.gtVersion("6.8.0",!0)&&u;
w&&(g||f)?(o=et.addParam(o,"tp","wxpic",!0),window.__addIdKeyReport("28307",91)):window.webp&&(o=et.addParam(o,"tp","webp",!0),
window.__addIdKeyReport("28307",84)),o=et.addParam(o,"wxfrom","5",!0),is_https_res||q?(o=o.http2https(),
window.__addIdKeyReport("28307",77)):("http:"==location.protocol||-1!=navigator.userAgent.indexOf("MicroMessenger"))&&(o=o.https2http(),
window.__addIdKeyReport("28307",70));
}else try{
var a=new RegExp("^http(s)?://((mmbiz.qpic.cn/.*)|(m.qpic.cn/.*)|(mmsns.qpic.cn/.*)|(shp.qpic.cn/.*)|(wx.qlogo.cn/.*)|(mmbiz.qlogo.cn/.*)|((a|b)[0-9]*.photo.store.qq.com/.*)|(mp.weixin.qq.com/.*)|(res.wx.qq.com/.*))");
a.test(t)||(window.__addIdKeyReport("28307",9),window.logs.outer_pic++);
}catch(h){}
var y=/^http\:\/\/(a|b)(\d)+\.photo\.store\.qq\.com/g;
o=o.replace(y,"http://m.qpic.cn"),/^http(s)?:\/\/m\.qpic\.cn([\/?].*)*$/i.test(o)&&!window.webp&&(o=et.addParam(o,"t","",!0)),
o=et.addParam(o,"wx_lazy","1",!0);
var v=_.gtVersion("6.5.13",!0)&&!_.eqVersion("7.0.9")&&o.isGif(),b=_.gtVersion("6.8.0",!0)&&o.canHevc()&&!(_.eqVersion("7.0.9")&&o.isGif());
return D&&(v||b)&&(window.__addIdKeyReport("28307",106),o=et.addParam(o,"tp","wxpic",!0),
o=D+"hevc?url="+encodeURIComponent(o)+"&type="+o.getOriginImgType()),"anonymous"==e.crossOrigin&&(o=et.addParam(o,"wx_co","1",!0)),
window.logs.img.load[o]=!0,l("[Appmsg] image_load_event_change_src. originsrc:"+t+"  ^^^ newsrc : "+o),
e.start_load_time=+new Date,o;
},
onerror:function(e,t){
var o=t?t.__retryload||0:0;
if(2==o&&i(t),e&&!(o>d)){
if(!e.isCDN()){
if(!D)return;
if(-1==e.indexOf(D))return;
}
var n=0==e.indexOf("https://")?7:0;
if(window.__addIdKeyReport("28307",72+n),1>=o&&window.__addIdKeyReport("28307",75+1*o+n),
e.isWxpic()?(window.__addIdKeyReport("28307",93),1>=o&&window.__addIdKeyReport("28307",96+1*o)):e.isWebp()&&(window.__addIdKeyReport("28307",86),
1>=o&&window.__addIdKeyReport("28307",89+1*o)),D&&e.indexOf(D)>-1&&window.__addIdKeyReport("28307",108),
d>o){
if(o++,t.__retryload=o,1==o&&e.indexOf("http://")>-1?(e=e.http2https(),window.__addIdKeyReport("28307",60),
window.__addIdKeyReport("28307",77)):1==o&&e.indexOf("https://")>-1?(window.__addIdKeyReport("28307",61),
window.__addIdKeyReport("28307",77)):2==o&&e.indexOf("mmbiz.qpic.cn")>-1&&(e=e.replace("mmbiz.qpic.cn","mmbiz.qlogo.cn"),
e.indexOf(!1)&&(e=e.http2https())),D&&e.indexOf(D)>-1){
var a=e.split("hevc?url=")[1];
a=a.split("&type")[0],a=decodeURIComponent(a),a=a.replace("tp=wxpic",""),e=a.https2http();
}
t.start_load_time=+new Date,t.src=et.addParam(e,"retryload",o,!0);
}
window.__has_imgfailed||(window.__has_imgfailed=!0,window.__addIdKeyReport("28307",65)),
l("[Appmsg] image_load_event_on_error. src:"+e),t.setAttribute("data-fail",1);
try{
if("[object Array]"==Object.prototype.toString.call(t.lazyLoadOnerror))for(var r=0,s=t.lazyLoadOnerror.length;s>r;r++)"function"==typeof t.lazyLoadOnerror[r]&&t.lazyLoadOnerror[r].call(t);
}catch(p){}
var c=10;
/tp\=webp/.test(e)&&(c=11);
var m=new Image;
m.src="http://mp.weixin.qq.com/mp/jsreport?key="+c+"&content="+(encodeURIComponent(e)+"["+uin+"]")+"&r="+Math.random();
}
},
onload:function(e,t){
if(!window.__second_open__&&!E){
var o=window.performance||window.msPerformance||window.webkitPerformance;
if(!o||!o.timing)return;
var i=window.location.protocol;
I.saveSpeeds({
uin:uin,
pid:"https:"==i?462:417,
speeds:{
sid:35,
time:Date.now()-window.performance.timing.navigationStart
}
}),I.send(),E=!0;
}
n(t),t.gray&&!t.loadGif&&((t.width||t.naturalWidth)<120||(t.height||t.naturalHeight)<120?t.autoTap&&t.autoTap():t.span&&t.span.children&&t.span.children.item(0)&&(t.span.children.item(0).style.display=""));
var a=t?t.__retryload||0:0;
if(!(a>d)){
l("[Appmsg] image_load_event_onload_image. src:"+e+"  ^^^  retryloadtimes: "+a),
t.setAttribute("data-fail",0),y(t);
try{
if("[object Array]"==Object.prototype.toString.call(t.lazyLoadOnload))for(var r=0,s=t.lazyLoadOnload.length;s>r;r++)"function"==typeof t.lazyLoadOnload[r]&&t.lazyLoadOnload[r].call(t);
}catch(p){}
var c=0==e.indexOf("https://")?7:0;
window.__addIdKeyReport("28307",71+c),1>=a&&window.__addIdKeyReport("28307",73+1*a+c),
e.isWxpic()?(window.__addIdKeyReport("28307",92),1>=a&&window.__addIdKeyReport("28307",94+1*a)):e.isWebp()&&(window.__addIdKeyReport("28307",85),
1>=a&&window.__addIdKeyReport("28307",87+1*a)),D&&e.indexOf(D)>-1&&window.__addIdKeyReport("28307",107),
window.__has_imgsucceed||(window.__has_imgsucceed=!0,window.__addIdKeyReport("28307",64)),
1==a&&e.indexOf("http://")>-1&&window.__addIdKeyReport("28307",50),1==a&&e.indexOf("https://")>-1&&window.__addIdKeyReport("28307",52);
var m=Math.random(),w=+new Date-t.start_load_time;
w&&0==e.indexOf("https://")&&.5>m?(window.__addIdKeyReport("27822",121,w),window.__addIdKeyReport("27822",122)):w&&5e-4>m&&(window.__addIdKeyReport("27822",124,w),
window.__addIdKeyReport("27822",125)),""===t.style.filter||"none"===t.style.filter||/translate(Z|3d)\(/.test(t.style.transform)||(t.style.transform+=" translateZ(0)",
t.style.webkitTransform+=" translateZ(0)");
}
},
detect:function(e){
if(e&&e.time&&e.loadList){
var t=e.time,o=e.loadList;
window.logs.img.download[t]=o;
}
},
container:document.getElementById("page-content")
});
});
}),e("appmsg/async.js"),!window.isSg;
var ct=e("appmsg/copyright_report.js");
!function(){
var e=document.getElementById("profileBt"),t=document.getElementById("copyright_info"),o=[];
if(e){
var i="57";
"28"==window.source&&(i="96"),"31"===window.source&&(i="103"),"30"===window.source&&(i="102"),
"29"==window.source&&(i="39"),"15"==window.source&&(i="121"),o.push({
dom:e,
username:user_name,
profileReportInfo:window.profileReportInfo||"",
scene:i
});
}
t&&source_encode_biz&&o.push({
dom:t,
source_encode_biz:source_encode_biz,
scene:"161"
});
var n=document.getElementById("js_share_headimg");
n&&o.push({
dom:n,
username:source_username,
scene:"172"
});
var a=document.getElementById("js_share_author");
a&&o.push({
dom:a,
username:source_username,
scene:"172"
});
for(var r=0,s=o.length;s>r;r++)!function(e){
h.on(e.dom,"click",function(){
if("copyright_info"==e.dom.id&&source_encode_biz){
ct.card_click_report({
scene:"0"
});
var t="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz="+e.source_encode_biz+"&scene="+e.scene+"#wechat_redirect";
-1!=navigator.userAgent.indexOf("WindowsWechat")?location.href=t:y.invoke("profile",{
username:source_username,
scene:e.scene+""
});
}else{
if(l("[Appmsg] profile_click_before_loadprofile: username:"+e.username+", scene:"+e.scene),
b.profileReport({
hotspotjson:JSON.stringify({
hotspotinfolist:window.hotspotInfoList
})
}),profileReportInfo){
var o=String(profileReportInfo).split("_");
3==o.length&&m({
url:"/mp/ad_biz_info?action=report&__biz="+window.biz+"&report_type=2&aid="+o[1]+"&tid="+o[2],
type:"GET",
dataType:"json",
async:!0,
success:function(){}
});
}
1==isprofileblock?y.invoke("openUrlWithExtraWebview",{
url:"https://mp.weixin.qq.com/mp/profileblock?__biz="+window.biz+"#wechat_redirect",
openType:1
},function(e){
-1==e.err_msg.indexOf("ok")&&(location.href="https://mp.weixin.qq.com/mp/profileblock?__biz="+window.biz+"#wechat_redirect");
}):y.invoke("profile",{
username:e.username,
profileReportInfo:e.profileReportInfo||"",
scene:e.scene+""
},function(t){
window.__addIdKeyReport("28307","1"),l("[Appmsg] profile_click_after_loadprofile: username:"+e.username+", scene:"+e.scene+", profileReportInfo:"+e.profileReportInfo+", res.err_msg:"+t.err_msg);
});
}
return!1;
}),_.isWp&&e.dom.setAttribute("href","weixin://profile/"+e.username);
}(o[r]);
}(),function(){
function e(){
if("hidden"in document)return"hidden";
for(var e=["webkit","moz","ms","o"],t=0;t<e.length;t++)return e[t]+"Hidden"in document,
e[t]+"Hidden";
return null;
}
function t(){
var t=e();
return t?document[t]:!1;
}
function o(){
if(t())for(var e=0;e<window.parent.originalVideoAdFrames.length;e++)window.parent.originalVideoAdFrames[e].contentWindow.postMessage({
action:"pauseAd",
value:""
},"*");else window.originalVideoAdCurrentFrame&&window.originalVideoAdCurrentFrame.contentWindow.postMessage({
action:"playAd"
},"*");
}
document.webkitVisibilityState?document.addEventListener("webkitvisibilitychange",o,!1):document.msVisibilityState?document.addEventListener("msvisibilitychange",o,!1):document.visibilityState&&document.addEventListener("visibilitychange",o,!1);
}();
try{
var lt=document.getElementById("js_author_name");
if(lt){
var mt="";
h.on(lt,"click",function(){
return c.hasClass(lt,"rich_media_meta_link")?window.is_temp_url?(window.weui.alert("Unable to do this in preview"),
!1):lt.getAttribute("data-rewardsn")?1!=lt.getAttribute("data-canreward")?!1:(mt="https://mp.weixin.qq.com/mp/author?action=show&author_id="+author_id+"&rewardsn="+lt.getAttribute("data-rewardsn")+"&timestamp="+lt.getAttribute("data-timestamp")+"&__biz="+window.biz+"&appmsgid="+window.appmsgid+"&idx="+window.idx+"&scene=142&rscene=129&from_scene="+window.source+"&from_subscene="+window.subscene+"&from_enterid="+window.enterid+"&from_sessionid="+window.sessionid+"&is_fans="+window.isFans+"#wechat_redirect",
_.isInMiniProgram?!1:(-1!=navigator.userAgent.indexOf("MicroMessenger")&&(_.isIOS||_.isAndroid||_.isWp)?(window.__addIdKeyReport("110809","1"),
y.invoke("openUrlWithExtraWebview",{
url:mt,
openType:1
},function(e){
-1==e.err_msg.indexOf("ok")&&(location.href=mt);
})):location.href=mt,!1)):!1:!1;
});
}
}catch(H){}
var wt=e("appmsg/outer_link.js");
if(new wt({
container:document.getElementById("js_content"),
changeHref:function(e,t){
if(!e||0!=e.indexOf("http://mp.weixin.qq.com/")&&0!=e.indexOf("https://mp.weixin.qq.com/")){
if(18==ban_scene)return"/mp/ban?action=check&__biz="+biz+"&mid="+mid+"&idx="+idx+"&scene="+ban_scene+"#wechat_redirect";
if(0!=e.indexOf("http://mp.weixinbridge.com/mp/wapredirect"))return"http://mp.weixinbridge.com/mp/wapredirect?url="+encodeURIComponent(e)+"&action=appmsg_redirect&uin="+uin+"&biz="+biz+"&mid="+mid+"&idx="+idx+"&type="+t+"&scene=0";
}else{
e=e.replace(/#rd\s*$/,""),e=e.replace(/#wechat_redirect\s*$/,""),e=e.replace(/[\?&]scene=21/,"");
var o="&";
-1==e.indexOf("?")&&(o="?"),e+=o+"scene=21#wechat_redirect";
}
return e;
}
}),!tt){
var gt=e("appmsg/review_image.js"),ut=document.getElementById("js_cover"),_t=[];
ut&&_t.push(ut),new gt({
container:document.getElementById("js_content"),
is_https_res:is_https_res,
imgs:_t
});
}
e("appmsg/album.js"),e("appmsg/product.js");
var ft=e("appmsg/page_pos.js");
ft.init({
hasSpAd:!0,
disableScroll:window.isPaySubscribe&&!window.isPaid&&window.jump2pay
}),function(){
try{
var e=document.getElementById("js_content");
if(!e||!e.querySelectorAll)return;
var t=function(e){
var t=e.getAttribute("class");
if(t){
for(var o=t.split(/\s+/),i=[],n=0,a=o.length;a>n;++n){
var r=o[n];
if(r&&-1!=window.whiteList.indexOf(r))i.push(r);else for(var s=0,d=window.whiteListReg.length;d>s;s++)if(window.whiteListReg[s].test(r)){
i.push(r);
break;
}
}
e.setAttribute("class",i.join(" "));
}
};
e.querySelectorAll("*").forEach(function(e){
if(e&&e.tagName){
var o=e.tagName.toLowerCase();
"iframe"!==o?t(e):"video_ad_iframe"===e.getAttribute("class")&&e.setAttribute("class","");
}
});
}catch(o){
console.error(o);
}
}(),function(){
window.originalVideoAdFrames=[],window.originalVideoAdCurrentFrame=null,window.originalVideoAdFramesUnsetList=[],
window.addEventListener("message",function(e){
var t="",o=document.getElementsByTagName("iframe");
if(e.data&&"originalVideoAdNeedData"==e.data.action&&e.data.vid)if(window.originalVideoAdFramesAdData){
window.originalVideoAdFramesAdData&&window.originalVideoAdFramesAdData[e.data.vid]&&(t=window.originalVideoAdFramesAdData[e.data.vid]);
for(var i=0;i<o.length;i++)o[i].dataset&&o[i].dataset.mpvid==e.data.vid&&o[i].contentWindow.postMessage({
action:"receiveOriginalVideoData",
vid:e.data.vid,
adData:t
},"*");
}else console.log(e.data.vid," has no ad data yet"),window.originalVideoAdFramesUnsetList.push(e.data.vid);
});
}(),window.fromWeixinCached||e("appmsg/iframe.js"),j.getAdData(window.reportVid),
e("appmsg/qqmusic.js"),e("appmsg/voice.js"),e("redpackage/redpacketcover.js"),e("appmsg/search/search.js"),
window.__appmsgCgiData&&1==window.__appmsgCgiData.show_msg_voice&&e("appmsg/autoread.js"),
"1"==window.show_msg_voice&&(console.log("load voicemsg"),e("appmsg/voicemsg.js")),
!window.__appmsgCgiData||1!=window.__appmsgCgiData.wxa_product&&1!=window.__appmsgCgiData.wxa_cps||e("appmsg/weproduct.js"),
e("appmsg/weapp.js"),e("question_answer/appmsg.js"),e("appmsg/wxtopic.js"),e("appmsg/cdn_speed_report.js");
var ht=e("appmsg/appmsg_copy_report.js");
new ht({
biz:window.biz,
isPaySubscribe:window.isPaySubscribe,
container:document.getElementById("js_content"),
logid:18504,
baseData:["",window.biz,window.mid,window.idx,window.location.href,window.msg_title]
}),setTimeout(function(){
window.article_improve_combo_css;
},0),setTimeout(function(){
h.tap(document.getElementById("copyright_logo"),function(){
var e="http://kf.qq.com/touch/sappfaq/150211YfyMVj150326iquI3e.html";
window.__second_open__?y.invoke("openUrlWithExtraWebview",{
url:e,
openType:1
},function(t){
-1==t.err_msg.indexOf("ok")&&(location.href=e);
}):location.href=e;
}),u(),f(),h.tap(document.getElementById("js_hotspot_area"),function(e){
if(c.hasClass(e.target,"js_hotspot")){
var t=e.target.dataset.id;
if(!t)return;
t="https://search.weixin.qq.com/cgi-bin/searchweb/clientjump?scene=306&tag=mp_topic&topic_id="+t+"#wechat_redirect",
-1!=navigator.userAgent.indexOf("MicroMessenger")&&(_.isIOS||_.isAndroid||_.isWp)?y.invoke("openUrlWithExtraWebview",{
url:t,
openType:1
},function(e){
-1==e.err_msg.indexOf("ok")&&(location.href=t);
}):location.href=t;
}
}),e("appmsg/report_and_source.js"),function(){
if(tt){
document.title=window.msg_title.htmlDecode(),c.addClass(J,"not_in_mm");
var e=document.getElementById("js_pc_qr_code_img");
if(e){
var t=10000004,o=document.referrer;
if(0==o.indexOf("http://weixin.sogou.com")?t=10000001:0==o.indexOf("https://wx.qq.com")&&(t=10000003),
window.isSg)e.setAttribute("src",sg_qr_code.htmlDecode());else{
e.setAttribute("src","/mp/qrcode?scene="+t+"&size=102&__biz="+biz+"&mid="+mid+"&idx="+idx+"&sn="+sn+"&send_time="+send_time);
var i=new Image;
i.src="/mp/report?action=pcclick&__biz="+biz+"&uin="+uin+"&scene="+t+"&r="+Math.random();
}
document.getElementById("js_pc_qr_code").style.display="block";
}
var n=document.getElementById("js_profile_qrcode"),a=document.getElementById("js_profile_arrow_wrp"),r=document.getElementById("profileBt");
if(n&&r&&a){
var s=function(){
var e=10000005,t=document.referrer;
0==t.indexOf("http://weixin.sogou.com")?e=10000006:0==t.indexOf("https://wx.qq.com")&&(e=10000007);
var o=document.getElementById("js_profile_qrcode_img");
if(o)if(window.isSg)o.setAttribute("src",sg_qr_code.htmlDecode());else{
o.setAttribute("src","/mp/qrcode?scene="+e+"&size=102&__biz="+biz+"&mid="+mid+"&idx="+idx+"&sn="+sn+"&send_time="+send_time);
var i=new Image;
i.src="/mp/report?action=pcclick&__biz="+biz+"&uin="+uin+"&scene="+e+"&r="+Math.random();
}
return n.style.display="block",a.style.left=r.offsetWidth/2-8+"px",!1;
};
h.on(r,"click",s),h.on(n,"click",s),h.on(document,"click",function(e){
var t=e.target||e.srcElement;
t!=r&&t!=n&&(n.style.display="none");
});
}
}else{
var d=document.getElementById("js_report_article3");
!!d&&(d.style.display="");
}
}(),function(){
var e=location.href.indexOf("scrolltodown")>-1?!0:!1,t=document.getElementById("img-content");
if(e&&t&&t.getBoundingClientRect){
var o=t.getBoundingClientRect().height;
window.scrollTo(0,o);
}
}(),e("appmsg/report.js");
for(var t=document.getElementsByTagName("map"),o=0,i=t.length;i>o;++o)t[o].parentNode.removeChild(t[o]);
if(ct.card_pv_report(),Math.random()<.01)try{
var n="https://js.aq.qq.com/js/aq_common.js",a=document.createElement("script");
a.src=n;
var r=document.getElementsByTagName("head")[0];
r.appendChild(a);
}catch(s){}
var d=document.getElementById("js_close_temp");
h.on(d,"click",function(){
d.parentNode.parentNode.removeChild(d.parentNode),c.removeClass(document.getElementById("js_article"),"preview_appmsg");
});
},1e3),function(){
if(p.os.ios&&"onorientationchange"in window){
var e=[],t="onorientationchange"in window?"orientationchange":"resize",o=function(){
return 90===Math.abs(window.orientation)?1:2;
};
e.push({
ori:o(),
scroll:window.pageYOffset||document.documentElement.scrollTop,
istouchmove:!1
});
var i=(new Date).getHours();
h.on(window,t,function(){
var t=e.length-2,n=o();
if(P=+new Date,t>=0){
{
var a=e[t];
a.ori;
}
e[e.length-1].istouchmove||(i>=11&&17>=i&&window.__report(63),setTimeout(function(){
window.scrollTo(0,a.scroll);
},100));
}
e.push({
ori:n,
scroll:window.pageYOffset||document.documentElement.scrollTop,
istouchmove:!1
});
});
var n=document.getElementById("js_hotspot_area"),a=0===n.children.length;
h.on(window,"scroll",function(){
var t=e.length-1,i=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,r=+new Date;
if(-1!=P){
if(console.log("[横屏滚动检测]",r-P),500>r-P)return void(P=-1);
}else P=-1;
if(e[t].ori==o()&&(e[t].scroll=i,e[t].istouchmove=!0,!a)){
var s=x.getInnerHeight()+i;
n.offsetTop<s&&(a=!0,T.setSum(59977,15,1));
}
});
}
}(),l("[Appmsg] href:"+location.href+"^^^ ua:"+window.navigator.userAgent),window.addEventListener?window.addEventListener("load",K,!1):window.attachEvent&&window.attachEvent("onload",K),
e(window.moon&&moon.clearSample?"appmsg/fereport_without_localstorage.js":"appmsg/fereport.js"),
function(){
window.addEventListener&&document.getElementsByTagName("body")[0].addEventListener("copy",function(){
T.setSum(28307,18,1),_.isIOS&&T.setSum(28307,19,1),_.isAndroid&&T.setSum(28307,20,1);
},!1);
}(),function(){
window.__observer&&window.__observer_data&&e("biz_wap/safe/mutation_observer_report.js");
}(),"undefined"!=typeof isSg&&e("sougou/index.js"),setTimeout(function(){
for(var e=function(){
T.setLogs({
id:28307,
key:49,
value:1,
lc:1,
log0:"[28307_49_appmsg_fe_filter]"+encodeURIComponent(location.href)
});
},t=(window.appmsg_fe_filter||"").split(","),o=function(t,o){
try{
if(!t)return;
if(t.querySelectorAll){
var i=t.querySelectorAll("*["+o+"]");
if(i&&i.length>0){
e();
for(var n=0;n<i.length;++n)i[n]&&i[n].removeAttribute&&i[n].removeAttribute(o);
}
return;
}
var a=t.childNodes;
if(t.hasAttribute&&t.hasAttribute(o)&&e(),t.removeAttribute&&t.removeAttribute(o),
a&&a.length)for(var n=0;n<a.length;++n)filterContenteditable(a[n]);
}catch(r){}
},i=document.getElementById("js_content"),n=0;n<t.length;++n)t[n]&&o(i,t[n]);
},0),setTimeout(function(){
var e=999,t=636,o="http://mmbiz.qpic.cn/mmbiz_png/7lG1x2vpicdic0p5bBthpD9lsJcINicsSzd6uKQQJyoj5oTl8lFIs9K0fIibgxCzms0enDLTRxTHLpDPCLpSvIExiag/0",i=(new Date).getHours();
if(!(11>i||i>16||Math.random()<.99)){
var n=new Image;
n.onload=function(){
var o=n.naturalWidth||n.width,i=n.naturalHeight||n.height;
(o!=e||i!=t)&&window.__addIdKeyReport("28307","wifi"===window.networkType?120:123),
window.__addIdKeyReport("28307","wifi"===window.networkType?121:124);
},n.src=o;
var a=new Image;
a.onload=function(){
var o=a.naturalWidth||a.width,i=a.naturalHeight||a.height;
(o!=e||i!=t)&&window.__addIdKeyReport("28307",126),window.__addIdKeyReport("28307",127);
},a.src="https://mmbiz.qpic.cn/mmbiz_png/7lG1x2vpicdic0p5bBthpD9lsJcINicsSzd6uKQQJyoj5oTl8lFIs9K0fIibgxCzms0enDLTRxTHLpDPCLpSvIExiag/0";
}
},3e3);
var yt=Math.random();
if(2e-4>yt)try{
for(var vt=document.getElementsByTagName("img"),bt=window.screen.height,At=window.screen.width,jt=0,It=window.devicePixelRatio,jt="",W=0,xt=vt.length;xt>W;W++){
var kt=vt[W].getAttribute("data-src");
if(kt){
var Et=vt[W].getBoundingClientRect();
jt+=At+"|"+bt+"|"+Et.left.toFixed(2)+"|"+(At-Et.right).toFixed(2)+"|"+Et.width.toFixed(2)+"|"+It.toFixed(2)+"|"+kt+";";
}
}
m({
url:"/mp/wapreport?action=img_display_report",
data:{
key:jt
},
type:"POST",
dataType:"json",
async:!0
});
}catch(H){}
setTimeout(function(){
S&&S.postPageHeightMessage&&S.postPageHeightMessage("updatePageHeight");
},2e3),_.isIOS&&location.href.match(/fontScale=\d+/)&&p.os.ipad&&p.os.getNumVersion()>=13&&setTimeout(function(){
if(!window.ipados13_font_scale){
var e=location.href.match(/fontScale=(\d+)/);
window.ipados13_font_scale=parseFloat(e[1]),i(document.getElementsByTagName("html").item(0),window.ipados13_font_scale/100);
}
},500);
}
e("biz_wap/ui/weui.js");
var i=e("appmsg/set_font_size.js").setFontSize,n=e("biz_common/tmpl.js"),a=e("cps/tpl/banner_tpl.html.js"),r=e("cps/tpl/card_tpl.html.js"),s=e("cps/tpl/list_tpl.html.js");
e("biz_common/utils/string/html.js");
var d=e("appmsg/weapp_common.js"),p=e("biz_wap/utils/device.js"),c=e("biz_common/dom/class.js"),l=e("appmsg/log.js"),m=e("biz_wap/utils/ajax.js"),w=e("biz_common/dom/attr.js"),g=w.setProperty,u=e("appmsg/max_age.js"),_=e("biz_wap/utils/mmversion.js"),f=e("appmsg/test.js"),h=e("biz_common/dom/event.js"),y=e("biz_wap/jsapi/core.js"),v=e("biz_common/moment.js"),b=e("appmsg/appmsg_report.js"),A=e("biz_common/utils/url/parse.js"),j=e("a/mpAdAsync.js"),I=e("biz_wap/utils/wapsdk.js"),x=e("common/utils.js"),k=(e("complain/localstorage.js"),
e("appmsg/popup_report.js")),E=e("appmsg/pay_report_utils.js"),z=e("appmsg/loading.js"),P=-1,S=e("appmsg/finance_communicate.js"),B=e("appmsg/topbar.js"),T=e("biz_wap/utils/jsmonitor_report.js"),C=e("appmsg/getForbidConfig.js");
window.new_appmsg&&(e("page/appmsg_new/combo.css"),e("page/appmsg_new/not_in_mm.css")),
e("appmsg/finance_communicate.js");
var R=window.user_uin||0,O=Math.floor(R/100)%1e3,q=0!==R&&1001>O,N=!0,D="",M=5;
if(window.logs.pagetime.jsapi_ready_time=+new Date,window.logs.idkeys={},console.info("[图文信息] 三元组:",window.biz,window.mid,window.idx),
console.info("[用户信息] 设备信息: 是否安卓",p.os.android,"是否IOS",p.os.ios,"是否秒开场景",window.__second_open__,"系统版本",p.os.version,"用户uin",window.user_uin,"是否小程序内打开",_.isInMiniProgram),
l("[Appmsg] start run index.js init"),function(){
var e=(new Date).getHours(),t=function(e,t){
t=t||"",window.isSg?(t=["uin:sougou","resp:"+t].join("|"),(new Image).src="/mp/jsreport?key="+e+"&content="+t+"&r="+Math.random()+"&from=sougou"):(t=["uin:"+window.user_uin,"resp:"+t].join("|"),
(new Image).src="/mp/jsreport?key="+e+"&content="+t+"&r="+Math.random());
},o=function(e,t,o){
var i=e+"_"+t;
o=o||1,window.logs.idkeys[i]||(window.logs.idkeys[i]={
val:0
}),window.logs.idkeys[i].val+=o;
},i=e>=11&&17>=e&&Math.random()<1,n=function(e,o){
i&&t(e,o);
};
window.__report=t,window.__commonVideoReport=n,window.__addIdKeyReport=o;
}(),o(),!window.__second_open__){
var L=window.performance||window.msPerformance||window.webkitPerformance;
if(!L||!L.timing)return;
var K=window.location.protocol;
I.saveSpeeds({
uin:uin,
pid:"https:"==K?462:417,
speeds:{
sid:34,
time:Date.now()-window.performance.timing.navigationStart
}
}),I.send(),C({
isPaySubscribe:window.isPaySubscribe
});
}
});
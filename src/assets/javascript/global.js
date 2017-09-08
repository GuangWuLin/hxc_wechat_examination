import $ from "jquery"
import { request } from "../api/api";

//global.js全局函数
var global = {
    pageSize: 10,
    schoolCodes: 510300085,
    defaultImg: 'http://img.haoxueche.com:8888/group1/M00/04/38/wKgKH1mbL2OACW9wAAatZZ2ig9Y570.jpg',
    // '{"studentId":20000033,"studentName":"王传美","schoolCode":510100755,"phone":"15881084528","cardNo":"620103197401268019","studentUnifyCode":"1833758976032153","gender":1,"photosUrl":"http://img.haoxueche.com:8888/group1/M00/03/85/wKgKH1lxubOAMQaAAAMXhKeUJQA119.png","autograph":null,"carTypeName":"C2","carType":22,"province":"510000","schoolName":"省振中驾校","appointment":false,"learnFirst":false,"openId":"ofYYU1GgTPj5TPrcMGRRABZNFpWM","redirectUrl":null}'
    studentId: 122,
    openId: 'ofYYU1LonWhcvduN7s4UuJWOfIlc',
    redirectURL: 'www.haoxueche.com',

    //枚举
    enums: {
        statusText: {
            203: '非授权信息,服务器已成功处理了请求，但返回的信息可能来自另一来源',
            204: '无内容,服务器成功处理了请求，但没有返回任何内容',
            205: '重置内容,服务器成功处理了请求，但没有返回任何内容',
            301: '请求的网页已永久移动到新位置',
            302: '服务器目前从不同位置的网页响应请求',
            303: '查看其他位置',
            304: '自从上次请求后，请求的网页未修改过',
            305: '只能使用代理访问请求当前网页',
            307: '临时重定向',
            400: '错误请求,服务器无法理解',
            401: '用户未授权，请先绑定用户',
            403: '服务器拒绝了此次请求',
            404: '服务器找不到请求的网页',
            405: '当前请求方法禁用',
            407: '当前请求需要代理授权',
            408: '请求超时',
            409: '服务器在完成请求时发生冲突',
            410: '请求的资源已永久删除',
            411: '服务器不接受不含有效内容长度标头字段的请求',
            412: '服务器未满足请求者在请求中设置的其中一个前提条件',
            413: '服务器无法处理请求，超出服务器的处理能力',
            414: '请求的 URI（通常为网址）过长，服务器无法处理',
            415: '请求的格式不受请求页面的支持',
            416: '请求范围不符合要求',
            422: '参数错误，无法处理的请求实体',
            423: '锁定',
            451: '由于法律原因产生的后果而被拒绝访问',
            500: '服务器遇到错误，无法完成请求',
            501: '服务器不具备完成请求的功能',
            502: '错误网关,服务器从上游服务器收到无效响应',
            503: '服务器目前无法使用（超载或停机维护）',
            504: '网关超时,没有及时从上游服务器收到请求',
            505: '服务器不支持请求中所用的 HTTP 协议版本',
            507: '系统空间不足'
        }
    },
    //字段验证
    fieldVerification: {
        //判断输入的Phone格式
        IsPhone: function (field) {
            /*移动号段
            1706,853,1703,147,1705,184,178,182,183,187,188,157,158,159,150,151,152,134,135,136,137,138,139,148
            规则：可以以0开头+三位固定号段+8为数字*/
            var pattern1 = new RegExp(/^0{0,1}(13[4-9]|14[78]|15[0-2]|15[7-9]|170|178|18[2-4]|18[78]|853)[0-9]{8}$/);
            //var pattern1 = new RegExp(/^0{0,1}(13[4-9]|147|15[0-2]|15[7-9]|178|18[23478])[0-9]{8}$/);
            /*联通号段
            0,130,131,132,155,156,185,186,145,176,154,171,1704,1707,1708,1709,175
            */
            var pattern2 = new RegExp(/^0{0,1}(13[0-2]|145|15[4-6]|170|171|17[56]|18[56])[0-9]{8}$/);
            /*电信号段
            149,153,133,180,189,181,177,173,1701,1702,1700
            */
            var pattern3 = new RegExp(/^0{0,1}(133|149|153|170|173|177|18[01]|189)[0-9]{8}$/);

            /*座机号码
            */
            var pattern4 = /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/;
            if (pattern1.test(field)) {
                //"移动";
                return 1;
            }
            else if (pattern2.test(field)) {
                //"联通";
                return 1;
            }
            else if (pattern3.test(field)) {
                //"电信";
                return 1;
            }
            //        else if (pattern4.test(str)) {
            //            return 1;
            //        }
            else {
                //"非手机号";
                return 0;
            }
        },
    },
    convertToString(val) {
        if (val === "" || val === null) {
            return "";
        }
        else {
            return val.toString();
        }
    },
    printLog(context) {
        console.info(context);
    },
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
}

export { global }

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "H+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
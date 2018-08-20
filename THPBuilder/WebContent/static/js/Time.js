/**
 * Created by wly on 2018/3/23.
 */
var month1 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
var conn = ["*", "t", "today", "y", "yesterday"];
var weed = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

var weed1 = {
    '1': 'mon',
    '2': 'tue',
    '3': 'wed',
    '4': 'thu',
    '5': 'fri',
    '6': 'sat',
    '7': 'sun'
};
var monthfull = {
    '01': 'january',
    '02': 'gebruary',
    '03': 'marcy',
    '04': 'april',
    '05': 'may',
    '06': 'june',
    '07': 'july',
    '08': 'august',
    '09': 'september',
    '10': 'october',
    '11': 'november',
    '12': 'december'
};
var month = {
    '01': 'jan',
    '02': 'feb',
    '03': 'mar',
    '04': 'apr',
    '05': 'may',
    '06': 'jun',
    '07': 'jul',
    '08': 'aug',
    '09': 'sep',
    '10': 'oct',
    '11': 'nov',
    '12': 'dec'
};

var Time = {
    /*处理时间*/
    getDate: function (str) {
        str = str.toLowerCase();
       var result= Time.dateClassify(str);
        return result;
    },

    /*判断时间是否符合规范*/
    legal:function () {
        var blegal=false;   //是否符合规范
        if(str.indexOf('-')>=0 && str.indexOf('+')>=0){
            if(Time.isInArray(month,str)){
                blegal=true;
            }
        }
        else{
            blegal=true;
        }
        return blegal;
    },

    /*判断是什么类型的表达式*/
    dateClassify: function (str) {
        var result;
        if (str) {
            //判断头个字符是否是+/-
            if (str.indexOf('+')==0 || str.indexOf('-')==0){
            //相对表达式
                result= Time.relativeManager(str);
            }
            else {
                //由特定参考时间后连接一个相对时间表达式组成混合时间表达式
                var isblend = false;
                var newstr=str;
                if(str.match(/-.+-/)){
                    //此表达式算作一个
                    newstr=str.replace(/-/g,'.');
                }
                var strs=newstr.split(/[+,-]/);
                if(strs.length>1 && strs.length<=2){
                    isblend = true;
                }
                else if(strs.length>2){
                    //表达式不正确
                    alert("输入格式不正确！");
                    return;
                }

                if (isblend) {
                    result=  Time.blendManager(str);
                }
                else {
                    result= Time.absoluteManager(str);
                }
            }
        }
        return result;
    },
    /*相对表达式处理*/
    relativeManager: function (str) {
        //解析
        var symbol = str.substr(0, 1);
        var tmp = str.substr(1, str.length - 1);
       var result= Time.characterManager('', tmp, symbol);
        return result;
    },
    /*混合表达式处理*/
    blendManager: function (str) {
        var result;
        var newstr=str;
        if(str.match(/-.+-/)){
            newstr=str.match(/-.+-/)[0].replace('-','.');
        }
        var strs= newstr.split(/[+,-]/);
        var symbol;
        if(newstr.indexOf('+')>=0){
            symbol='+';
        }
        else if(newstr.indexOf('-')>=0){
            symbol='-';
        }
        if(strs.length>1){
           var date= Time.connManager(strs[0]);
            var time=new Date(date);
            result= Time.characterManager(time,strs[1],symbol);
        }

        return result;


    },
    /*绝对表达式处理*/
    absoluteManager: function (str) {
        var result=Time.connManager(str);
        return result;
    },

    /*常量的处理*/
    connManager: function (str) {
        var result;
        var time = new Date(); //获取当前时间
        switch (str) {
            case '*':
                result = Time.formatDate(time);
                break;
            case 'y':
            case 'yesterday':
                var date = new Date(time.getTime() - 24 * 60 * 60 * 1000);
                var preDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + "00:00:00";
                result = preDate;
                break;
            case 't':
            case 'today':
                var date = time;
                var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + "00:00:00";
                result = today;
                break;
        }
        if(result){
            return result;
        }
        //处理星期
        if(str.match(/^[A-Za-z]+$/) && Time.isInArray(weed,str)>=0){
            var oneDayTime = 24*60*60*1000;
            var num=parseInt(Time.replaceArr(str,weed1));
            var newDate= new Date(time.getTime()-(time.getDay()-num)*oneDayTime);
            result=Time.formatDate(newDate);
            //new Date(now.getTime()-(now.getDay()-2)*24*60*60*1000)

        }
        //处理06-dec-91 15:00:00
       else  if(str.match(/-.+-/)){
            result= Time.getmonth(str);
        }

        //处理月份
       else if(str.match(/^[A-Za-z]+$/) && Time.isInArray(month1,str)>=0){
            var monthNum= Time.replaceMonth(str,monthfull);
            if(!monthNum){
                monthNum= Time.replaceMonth(str,month);
            }
           result = time.getFullYear() + "-" + monthNum+ "-" + time.getDate() + " " + "00:00:00";

        }
        //处理数字
        else {
            result= Time.numManager(str);
        }
        return result;
    },

    /*字符的处理
     * datetime 时间
     * str 字符
     * symbol 符号（+/-）
     * */
    characterManager: function (datetime, str, symbol) {
        var result = '';
        if (!datetime) {
            datetime = new Date();
        }
        if (str) {
            var number = str.match(/[0-9]+/)[0];
            var tmp = str.match(/[a-z]+/)[0];
            var millisecond = 0;
            var date;
            switch (tmp) {
                case 's':
                case 'second':
                    millisecond = 1000 * number;
                    date = millisecondDate(datetime, millisecond, symbol);
                    break;
                case 'm':
                case 'minute':
                    millisecond = 1000 * 60 * number;
                    date = Time.millisecondDate(datetime, millisecond, symbol);
                    break;
                case 'h':
                case 'hour':
                    millisecond = 1000 * 60 * 60 * number;
                    date = millisecondDate(datetime, millisecond, symbol);
                    break;
                case 'd':
                case 'day':
                    millisecond = 1000 * 60 * 60 * 24 * number;
                    date = millisecondDate(datetime, millisecond, symbol);
                    break;
                case 'mo':
                case 'month':
                    var myDate=datetime;
                    number=parseInt(number);
                    var mdate;
                    if(symbol.indexOf('+')>=0){
                        mdate=myDate.setMonth(datetime.getMonth() + number);
                    }
                    else  if(symbol.indexOf('-')>=0){
                        mdate=myDate.setMonth(datetime.getMonth() - number);
                    }
                    date=new Date(mdate);

                    break;
                case 'y':
                case 'year':
                    var myDate=datetime;
                    number=parseInt(number);
                    var mdate;
                    if(symbol.indexOf('+')>=0){
                        mdate=myDate.setYear(datetime.getFullYear() + number);
                    }
                    else  if(symbol.indexOf('-')>=0){
                        mdate=myDate.setYear(datetime.getFullYear() - number);
                    }
                    date=new Date(mdate);
                    break;
                case 'w':
                case 'week':
                    var myDate=datetime;
                    number=parseInt(number);
                    var mdate;
                    if(symbol.indexOf('+')>=0){
                        mdate=myDate.setDate((datetime.getDate() +7*number));
                    }
                    else  if(symbol.indexOf('-')>=0){
                        mdate=myDate.setDate((datetime.getDate() -7*number));
                    }
                    date=new Date(mdate);
                    break;
            }
            result=Time.formatDate(date);
            return result;
        }
        //加上毫秒的时间
        function millisecondDate() {
            var result = '';
            var date;
            var time = datetime.getTime();
            if (symbol == "+") {
                date = new Date(time + millisecond);
            }
            else if (symbol == "-") {
                date = new Date(time - millisecond);
            }
            // result = Time.formatDate(date);
            result=date;
            return result;
        }
    },


    /*在数组中的位置
    * arr
    * value
    * */
    isInArray: function (arr, value) {
        var flag = null;
        if (arr.indexOf && typeof(arr.indexOf) == 'function') {
            if (arr.indexOf(value) >= 0) {
                flag = arr.indexOf(value);
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (value === arr[i]) {
                    flag = i;
                    break;
                }
            }
        }
        return flag;
    },

    /*判断是否是06-dec-91 15:00:00 格式*/
    getmonth:function (str) {
        var result=str;
        if(str.match(/-.+-/)){
           var strmonth=str.match(/-.+-/)[0].replace(/-/g,'');
            var monthNum= Time.replaceArr(strmonth,monthfull);
            if(!monthNum){
                monthNum= Time.replaceArr(strmonth,month);
            }
            var newstr=str.replace(new RegExp(strmonth), monthNum);
            var strs= newstr.split(' ');
            if(strs.length>0){
                //判断是否是正确的日期格式
                var newdate;
                var date;
               if(strs[0].match(/^(\d{4})-(\d{2})-(\d{2})$/)){
                   newdate=new Date(strs[0]);
                   date=newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate();
               }
                else {
                   newdate=new Date("01-01-"+strs[0].split('-')[2]);
                   date=newdate.getFullYear() + "-" + strs[0].split('-')[1] + "-" +strs[0].split('-')[0];
               }

                var hms="00:00:00";
                if(strs.length>1){
                    hms=strs[1];
                }
               result= date + " "+hms;
            }

        }
        return result;
    },
    replaceArr:function(str,arr) {
    var result = str;
    for(var key in arr) {
        var smonth = arr[key];
        if(new RegExp("("+ str +")").test(smonth)) {
            result = key;
            break;
        }
    }
    return result;
},

    /*处理数字*/
    numManager:function (str) {
        var result;
        var date=new Date();
        if(str){
            //4位的数字表示年
            if(str.match(/^\d{4}$/)){
                result=str+"-1-1 00:00:00";
            }
            //2位的数字表示年
            else if(str.match(/^\d{2}$/)){
                result=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + str + " " + "00:00:00";
            }
            //是否存在：
            else if(str.indexOf(' ')>=0 && str.match(/:/)){
                var newstr= str.split(' ');
                if(newstr && newstr.length>1){
                   var hms= gethhmmss(newstr[1]);
                    result=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + newstr[0] + " " +hms;
                }

            }
            //是否存在：
            else if(str.match(/:/)){
                var hms= gethhmmss(str);
                result=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +hms;
            }
            //是否是3-1 3/1
            else if(str.indexOf('/') >= 0|| str.indexOf('-')>=0){
                var newstr= str.split(/[-,/]/);
                if(newstr){
                    var m=date.getMonth() + 1;
                    var t=date.getDate();
                    if(newstr.length>0){
                        m=newstr[0];
                    }
                    if(newstr.length>1){
                        t=newstr[1];
                    }
                }
                result=date.getFullYear() + "-" + m + "-" + t + " " + "00:00:00";
            }
        }
       return result;

        //获取时分秒
        function gethhmmss() {
            var re="00:00:00";
            var h="00";
            var m="00";
            var s="00";
            if(str.split(':')){
                if(str.split(':').length>0){
                    h=str.split(':')[0];
                }
                if(str.split(':').length>1){
                    if(str.split(':')[1]){
                        m=str.split(':')[1];
                    }

                }
                if(str.split(':').length>2){
                    if(str.split(':')[2]){
                        s=str.split(':')[2];
                    }

                }
                re= h+":"+m+":"+s;
            }
            return re;
        }

    },

    //时间格式化
    formatDate: function (date) {
        //创建补0函数
        function p(s) {
            return s < 10 ? '0' + s : s;
        }
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + p(date.getHours()) + ":" + p(date.getMinutes()) + ":" + p(date.getSeconds());
    },

}
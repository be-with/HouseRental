
function createDateArr(){
    var dateArr = [];
    for(var i=0;i<7;i++){
        dateArr.push(getDay(i) + (getWeek(-i)));
    }
    return dateArr;
}

function getWeek(i) {
    var week;
    if (i > new Date().getDay()) {//new Date().getDay() 6 i2 0周一周二
        week = "星期" + "日一二三四五六".charAt(new Date().getDay() - i + 7);
    } else {//当前六 下两天 周一  8
        week = "星期" + "日一二三四五六".charAt((new Date().getDay() - i) % 7);
    }
    return `（${week}）`;
}

function getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds);
    var month = today.getMonth();
    var date = today.getDate();
    month = handleMonth(month + 1);
    date = handleMonth(date);
    return `${month}月${date}日`;
}
function handleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}
module.exports = createDateArr;
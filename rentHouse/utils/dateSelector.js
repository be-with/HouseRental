var createDateArr = require("../utils/dateArr");

var dateArr = createDateArr();

function loopDate() {
    var dateSelector = [];
    for (let i = 0; i < dateArr.length; i++) {
        const date = dateArr[i];
        var dateObj = {
            name: date,
            hours: [
                {
                    name: '10时',
                    minutes: [{
                        name: '00分'
                    },
                    {
                        name: '30分'
                    },
                    ]
                },
                {
                    name: '11时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '12时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '13时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '14时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '15时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '16时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '17时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '18时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '19时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                },
                {
                    name: '20时',
                    minutes: [{
                        name: '00分'
                    }, {
                        name: '30分'
                    }]
                }
            ]
        }
        // console.log(dateObj);
        dateSelector.push(dateObj);
    }
    return dateSelector;
}
module.exports = loopDate;



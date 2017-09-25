// 添加全局移动事件回调函数
let mouseEvent = {},
    cbObj = {
        'down': {
            arr: [],
            id: -1
        },
        'move': {
            arr: [],
            id: -1
        },
        'up': {
            arr: [],
            id: -1
        }
    };

/**
 * [add 添加函数，鼠标操作回调]
 * @param {[type]}   name [description]
 * @param {Function} fn   [description]
 */
mouseEvent.add = function (name, fn) {
    let token = (++cbObj[name].id).toString();

    cbObj[name].arr.push({
        token: token,
        fn: fn
    });

    return token;
};

/**
 * [trigger 触发事件]
 * @param  {[type]} name [description]
 * @param  {[type]} e    [description]
 */
mouseEvent.trigger = function (name, e) {

    cbObj[name].arr.forEach(function (item, index) {
        item.fn(e);
    });
};

mouseEvent.cancel = function (name, token) {
    cbObj[name].arr.forEach(function (item, index) {
        if (item.token === token) {
            cbObj[name].arr.splice(index, 1);
            return token;
        }
    });
};

window.mouseEvent = mouseEvent;
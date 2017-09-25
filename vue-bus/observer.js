let observer = {};

(function (o) {

    let obj = {},
        id = -1,

        time = 80,
        speed = 50;

    o.on = function (name, fn) {

        if (!obj[name]) {
            obj[name] = [];
        }

        let token = (++id).toString();

        obj[name].push({
            token: token,
            fn: fn
        });

        return token;
    };

    o.emit = function (name, param) {
        let i = 0;

        function _run () {
            let tempArr = obj[name],
                len = tempArr ? tempArr.length : 0;

            while (len--) {
                tempArr[len].fn(param);
            }
        }

        let timer = setInterval(function () {
            if (obj[name]) {
                _run();
                clearTimeout(timer);
            } else if (i < time) {
                i++;
            } else if (i >= time && !obj[name]) {
                clearTimeout(timer);
            }
        }, speed);
    };

    o.cancel = function (token) {
        for (let name in obj) {
            if (obj.hasOwnProperty(name)) {
                obj[name].forEach(function (item, index) {
                    if (item.token === token) {
                        obj[name].splice(index, 1);
                        // 改用删除某个属性
                        delete obj[name];
                        return token;
                    }
                });
            }
        }
    };
})(observer);

export default observer;
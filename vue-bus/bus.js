import Vue from 'vue';
import observer from './observer';

var Bus = new Vue(); // 创建事件中心

Bus.$emit = function (name, obj) {
    observer.emit(name, obj);
};

Bus.$on = function (name, fn) {
    let token = observer.on(name, fn);

    return token;
};

Bus.cancel = function (token) {
    observer.cancel(token);
};

export default Bus;
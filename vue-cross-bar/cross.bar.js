/**
 * 横向滚动条组件
 * 调用方法
 * <el-table id="quota-table"></el-table>
 *  <crossBar target="quota-table"></crossBar>
 * target 指向id为quota-table的表格，一个页面中独一无二的值
 */



const doc = document,
    win = window;



function _throttle (method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
        method.call(context);
    }, 200);
}



/**
 * [getCurrentIndex description] 获取当前页的下标
 * @return {[type]} [description]
 */
function getCurrentIndex () {
    let elTabItems = doc.querySelectorAll('.el-tabs__item'),
        currentIndex = 0;

    if (elTabItems.length !== undefined) {
        elTabItems.forEach(function (node, index) {
            if (node.classList.contains('is-active')) {
                currentIndex = index;
            }
        });
    }

    return currentIndex;
}



export default {
    props: {
        target: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            parentDom: '',
            tableDom: '',
            tableWidth: 0,
            tableRealWidth: 0,
            crossBarDom: '',
            barDom: ''
        };
    },
    created () {
        let that = this;

        // 监听电脑resize变化 addeventlistener
        window.addEventListener('resize', reInit, false);

        function reInit () {
            _throttle(that.init);
        }

        that.init(false);
    },
    methods: {
        init (isAlreadyAddEvent) {
            let that = this;

            // 延迟，不然获取不到table id
            setTimeout(function () {
                that.parentDom = doc.querySelectorAll('.el-tab-pane')[getCurrentIndex()]; // 该tab的父节点
                that.tableDom = doc.getElementById(that.target); // 获取table dom节点

                if (that.tableDom !== null) {
                    that.tableWidth = that.tableDom.offsetWidth; // 获取table的可视宽度
                    that.tableRealWidth = that.tableDom.querySelector('.el-table__body').offsetWidth; // 获取table的真正宽度
                    that.crossBarDom = that.$refs.crossBar; // 获取滚动条包裹div dom节点
                    that.barDom = that.$refs.bar; // 获取滚动条dom节点

                    // 为barDom添加标志
                    that.barDom.setAttribute('data-target', that.target);

                    // 若表格在可视区域能显示的下，则隐藏滚动条，否则
                    if (that.tableRealWidth <= that.tableWidth) {
                        that.crossBarDom.style.display = 'none';
                    } else {
                        that.crossBarDom.style.display = 'block';
                        that.crossBarDom.style.width = that.tableWidth + 'px';
                        that.barDom.style.width = ((that.tableWidth * that.tableWidth) / that.tableRealWidth).toFixed(0) + 'px';
                    }

                    // 是否添加过事件，防止重复提交
                    if (isAlreadyAddEvent === false) {
                        // 滚动条添加点击事件
                        that.addEvent();
                    }
                }
            }, 0);
        },

        /**
         * [refresh 重新刷新滚动条]
         * @return {[type]} [description]
         */
        refresh () {
            let that = this;

            that.init(true); // 已经添加过事件的初始化
        },

        /**
         * [addEvent 添加滚动事件]
         */
        addEvent () {
            let that = this,
                clientX = 0,
                distance = 0,
                isBar = false;

            let _calculation = function (tableRealWidth, tableWidth, crossWidth, distance) {
                return ((tableRealWidth - tableWidth) / (tableWidth - crossWidth)) * distance;
            };

            let _mousedown = function (e) {
                let target = e.target;

                if (target.classList.contains('bar')) {

                    // 移动禁止鼠标复制内容
                    doc.body.classList.add('no-select');
                    // target.style.background = "rgba(0, 0, 0, .4)";
                    target.classList.add('bar-spe');
                    clientX = e.clientX;

                    if (that.tableDom.getAttribute('id') === target.getAttribute('data-target')) {
                        isBar = true;
                    }
                }
            };

            let _mousemove = function (e) {
                let target = e.target;

                if (isBar === true) {
                    let tableDom = that.tableDom,
                        barDom = that.barDom,
                        crossWidth = barDom.offsetWidth,
                        maxWidth = that.crossBarDom.offsetWidth,
                        header = tableDom.querySelector('.el-table__header'),
                        body = tableDom.querySelector('.el-table__body'),
                        tableRealWidth = tableDom.querySelector('.el-table__body').offsetWidth, // 获取table的真正宽度
                        left = barDom.style.left,
                        headerLeft = header.style.marginLeft,
                        bodyLeft = body.style.marginLeft,
                        tempDistance;

                    distance = e.clientX - clientX;
                    clientX = e.clientX;

                    if (left !== '') {
                        left = Number(left.replace(/^(.*)px$/, '$1'));
                        headerLeft = Number(headerLeft.replace(/^(.*)px$/, '$1'));
                        bodyLeft = Number(bodyLeft.replace(/^(.*)px$/, '$1'));

                        if (distance > 0) {
                            if ((left + distance) < maxWidth - crossWidth) {
                                barDom.style.left = left + distance + 'px';

                                // 算出table需要移动的距离
                                tempDistance = _calculation(tableRealWidth, maxWidth, crossWidth, -distance);
                                header.style.marginLeft = headerLeft + tempDistance + 'px';
                                body.style.marginLeft = bodyLeft + tempDistance + 'px';
                            } else {
                                barDom.style.left = maxWidth - crossWidth + 'px';
                                header.style.marginLeft = maxWidth - tableRealWidth + 'px';
                                body.style.marginLeft = maxWidth - tableRealWidth + 'px';
                            }
                        } else {
                            if ((left + distance) > 0) {
                                barDom.style.left = left + distance + 'px';

                                // 算出table需要移动的距离
                                tempDistance = _calculation(tableRealWidth, maxWidth, crossWidth, -distance);
                                header.style.marginLeft = headerLeft + tempDistance + 'px';
                                body.style.marginLeft = bodyLeft + tempDistance + 'px';
                            } else {
                                barDom.style.left = '0px';
                                header.style.marginLeft = '0px';
                                body.style.marginLeft = '0px';
                            }
                        }
                    } else {
                        if (distance >= 0) {
                            barDom.style.left = distance + 'px';
                            header.style.marginLeft = _calculation(tableRealWidth, maxWidth, crossWidth, -distance) + 'px';
                            body.style.marginLeft = _calculation(tableRealWidth, maxWidth, crossWidth, -distance) + 'px';
                        }
                    }
                }
            };

            let _mouseup = function (e) {
                if (isBar === true) {
                    // 取消移动禁止鼠标复制内容
                    doc.body.classList.remove('no-select');

                    isBar = false;

                    // 移除颜色
                    // that.barDom.style.background = "rgba(0, 0, 0, .2)";
                    that.barDom.classList.remove('bar-spe');
                }
            };

            // cross-bar点击事件
            doc.addEventListener('mousedown', _mousedown, false);
            doc.addEventListener('mousemove', _mousemove, false);
            doc.addEventListener('mouseup', _mouseup, false);
        }
    }
};
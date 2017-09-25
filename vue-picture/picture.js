/**
 * Created by outside on 2017/08/14
 *
 * @todo 图片弹窗，可放大缩小，旋转操作
 * 调用方法 <picture :lists="pictures" @close="closePicture"></picture>
 */

export default {
    name: 'picture',
    props: {
        lists: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    data () {
        return {
            isShow: true, // 是否展示图片弹窗
            src: '', // 图片路径
            width: 0, // 图片宽度
            height: 0, // 图片高度
            zoomBase: 1, // 缩放基数
            rotateBase: 0, // 旋转基数
            currentIndex: 0, // 展示当前图片的下标
            isComplete: false, // 图片是否请求回来
            isBtnShow: true, // 是否显示下一页按钮

            isCondition: false, // 是否符合在div里面移动
            isDown: false, // true表示鼠标是否点击图片了，移动的开始, false是否表示没点击或者鼠标已经移开

            clientX: 0, // 临时变量 记录鼠标所在位置
            clientY: 0,

            cageWidth: 600, // 配置包囊图片的div的宽高
            cageHeight: 600,

            tokenDown: '',
            tokenMove: '',
            tokenUp: '',

            percentage: 100, // 缩放百分比
            isPercentage: false, // 是否显示百分比弹窗
            percentageTimer: ''
        };
    },
    created () {
        let that = this;

        that.init();
    },
    methods: {
        // 初始化 图片信息
        init () {
            let that = this,
                lists = that.lists,
                len = lists.length;

            // 是否展示左右按钮
            if (len === 0) {
                that.isShow = false;
                return false;
            } else if (len === 1) {
                that.isBtnShow = false;
            }

            that.load();
        },

        load () {
            let that = this,
                lists = that.lists,
                url = lists[that.currentIndex],

                img = new Image(),
                picDom = '';

            img.onload = function () {
                that.src = url;
                that.isShow = true;

                if (img.width > img.height) {
                    that.width = that.cageWidth;
                    that.height = (that.cageWidth * img.height) / img.width;
                } else {
                    that.height = that.cageHeight;
                    that.width = (that.cageHeight * img.width) / img.height;
                }

                if (that.isComplete === false) { // 切换图片的load不会再执行一次addevent
                    // 加载完成标志
                    that.addEvent();
                }
                that.isComplete = true;

                that.$nextTick(() => {
                    picDom = that.$refs.pic;
                    picDom.style.left = 0;
                    picDom.style.top = 0;
                });
            };

            img.onerror = function () {
                that.isShow = false;
                that.$message.error('图片路径错误!');
            };

            that.zoomBase = 1;
            img.src = url;
        },

        /**
         * [isConditionFn 是否符合在div里面移动]
         */
        isConditionFn (e) {
            let that = this,
                target = that.$refs.pic;

            if (that.rotateBase !== 90 && that.rotateBase !== 270) {
                if (target.width > that.cageWidth || target.height > that.cageHeight) {
                    that.isCondition = true;
                    e.stopPropagation();
                } else {
                    that.isCondition = false;
                }
            } else {
                if (target.width > that.cageHeight || target.height > that.cageWidth) {
                    that.isCondition = true;
                    e.stopPropagation();
                } else {
                    that.isCondition = false;
                }
            }
        },

        /**
         * [wheel 鼠标滚轮事件]
         * @param  {[type]} e [description]
         */
        wheel (e) {
            let that = this,
                picDom = that.$refs.pic;

            if (e.wheelDeltaY === 120) {
                // 图片放大不能超过6倍
                if (that.zoomBase < 6) {
                    that.zoomBase = that.zoomBase + 0.2;
                }
            }

            if (e.wheelDeltaY === -120) {
                // 缩小倍速不能低于0.4
                if (that.zoomBase > 0.4) {
                    that.zoomBase = that.zoomBase - 0.2;
                }

                that.reset();
            }

            that.showPercent();
        },

        // 放大图片
        bigger () {
            let that = this;

            // 图片放大不能超过6倍
            if (that.zoomBase < 6) {
                that.zoomBase = that.zoomBase + 0.2;
            }

            that.showPercent();
        },

        // 缩小图片
        smaller () {
            let that = this,
                picDom = that.$refs.pic;

            // 缩小倍速不能低于0.4
            if (that.zoomBase > 0.4) {
                that.zoomBase = that.zoomBase - 0.2;
            }

            that.reset();
            that.showPercent();
        },

        // 图片顺时钟旋转90度
        rotate () {
            let that = this,
                picDom = that.$refs.pic;

            if (that.rotateBase >= 360) {
                that.rotateBase = 90;
            } else {
                that.rotateBase = that.rotateBase + 90;
            }

            that.zoomBase = 1;
            picDom.style.left = 0;
            picDom.style.top = 0;
        },

        close () {
            let that = this;

            that.$emit('close');
        },

        down (e) {
            let that = this;

            that.isDown = true;
            that.clientX = e.clientX;
            that.clientY = e.clientY;
            that.isConditionFn(e); // 判断是否符合拖拽条件
        },

        move (e) {
            let that = this,
                clientX = that.clientX,
                clientY = that.clientY,

                target = e.target,
                distanceX,
                distanceY,
                left,
                top,

                scrollX,
                scrollY;

            if (that.isDown === true && that.isCondition === true) {
                // 获取图片的top left
                top = target.offsetTop;
                left = target.offsetLeft;

                distanceX = e.clientX - clientX;
                distanceY = e.clientY - clientY;
                that.clientX = e.clientX;
                that.clientY = e.clientY;

                if (that.rotateBase !== 90 && that.rotateBase !== 270) {
                    // Y轴控制
                    if (target.height > that.cageHeight) {
                        scrollY = (target.height - that.cageHeight) / 2;
                        if (distanceY >= 0 && distanceY + top <= scrollY) { // 向下滚动鼠标
                            target.style.top = distanceY + top + 'px';
                        }

                        if (distanceY < 0 && distanceY + top >= -scrollY) {
                            target.style.top = distanceY + top + 'px';
                        }
                    }

                    // X轴控制
                    if (target.width > that.cageWidth) {
                        scrollX = (target.width - that.cageWidth) / 2;
                        if (distanceX >= 0 && distanceX + left <= scrollX) { // 向下滚动鼠标
                            target.style.left = distanceX + left + 'px';
                        }

                        if (distanceX < 0 && distanceX + left >= -scrollX) {
                            target.style.left = distanceX + left + 'px';
                        }
                    }
                } else {
                    // X、Y轴倒过来计算
                    if (target.height > that.cageWidth) {
                        scrollX = (target.height - that.cageWidth) / 2;
                        if (distanceX >= 0 && distanceX + left <= scrollX) { // 向下滚动鼠标
                            target.style.left = distanceX + left + 'px';
                        }

                        if (distanceX < 0 && distanceX + left >= -scrollX) {
                            target.style.left = distanceX + left + 'px';
                        }
                    }

                    if (target.width > that.cageHeight) {
                        scrollY = (target.width - that.cageHeight) / 2;
                        if (distanceY >= 0 && distanceY + top <= scrollY) { // 向下滚动鼠标
                            target.style.top = distanceY + top + 'px';
                        }

                        if (distanceY < 0 && distanceY + top >= -scrollY) {
                            target.style.top = distanceY + top + 'px';
                        }
                    }
                }
            }
        },

        up (e) {
            let that = this;

            that.isDown = false;
        },

        leave () {
            let that = this;

            that.isDown = false;
        },

        /**
         * [reset 重置left top]
         */
        reset () {
            let that = this,
                left = 0,
                top = 0,
                picDom = that.$refs.pic;

            that.$nextTick(() => {
                if (picDom.width <= that.cageWidth) { // 图片宽度小于容器宽度
                    picDom.style.left = 0;
                } else {
                    left = picDom.offsetLeft;

                    if ((that.width * that.zoomBase - that.cageWidth) / 2 < Math.abs(left)) {
                        if (left > 0) {
                            picDom.style.left = (that.width * that.zoomBase - that.cageWidth) / 2 + 'px';
                        } else {
                            picDom.style.left = (that.cageWidth - that.width * that.zoomBase) / 2 + 'px';
                        }
                    }
                }

                if (picDom.height <= that.cageHeight) { // 图片高度小于容器高度
                    picDom.style.top = 0;
                } else {
                    top = picDom.offsetTop;

                    if ((that.height * that.zoomBase - that.cageHeight) / 2 < Math.abs(top)) {
                        if (top > 0) {
                            picDom.style.top = (that.height * that.zoomBase - that.cageHeight) / 2 + 'px';
                        } else {
                            picDom.style.top = (that.cageHeight - that.height * that.zoomBase) / 2 + 'px';
                        }
                    }
                }
            });
        },

        /**
         * [pre 上一张图片]
         */
        pre () {
            let that = this,
                lists = that.lists,
                currentIndex = that.currentIndex,
                len = lists.length;

            if (currentIndex > 0) {
                that.currentIndex = currentIndex - 1;
            } else if (currentIndex === 0) {
                that.currentIndex = len - 1;
            }

            that.load();
        },

        /**
         * [next 下一张图片]
         */
        next () {
            let that = this,
                lists = that.lists,
                currentIndex = that.currentIndex,
                len = lists.length;

            if (currentIndex < len - 1) {
                that.currentIndex = currentIndex + 1;
            } else if (currentIndex === len - 1) {
                that.currentIndex = 0;
            }

            that.load();
        },

        showPercent () {
            let that = this;

            that.percentage = (that.zoomBase * 100).toFixed(0);
            that.isPercentage = true;

            clearTimeout(that.percentageTimer);
            that.percentageTimer = setTimeout(() => {
                that.isPercentage = false;
            }, 500);
        },

        /**
         * [addEvent 外框移动事件]
         */
        addEvent () {
            let that = this,
                target = that.$refs.pictureContent,

                mouseEvent = window.mouseEvent;

            let params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0,
                flag: false
            };

            let getCss = function (o, key) {
                return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
            };

            let hasChild = (e, node, cb) => {
                node.childNodes.forEach((sub, index) => {
                    if (sub === e.target) {
                        cb();
                        return false;
                    } else {
                        if (sub.nodeType === 1) {
                            hasChild(e, sub, cb);
                        }
                    }
                });
            };

            if (getCss(target, "left") !== "auto") {
                params.left = getCss(target, "left");
            }
            if (getCss(target, "top") !== "auto") {
                params.top = getCss(target, "top");
            }

            that.tokenDown = mouseEvent.add('down', (e) => {
                if (e.target === target) {
                    params.flag = true;
                } else {
                    hasChild(e, target, () => {
                        params.flag = true;
                    });
                }

                params.currentX = e.clientX;
                params.currentY = e.clientY;
            });

            that.tokenMove = mouseEvent.add('move', (e) => {
                if (params.flag) {
                    let nowX = e.clientX, nowY = e.clientY;
                    let disX = nowX - params.currentX, disY = nowY - params.currentY;

                    target.style.left = parseInt(params.left) + disX + "px";
                    target.style.top = parseInt(params.top) + disY + "px";
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                }
            });

            that.tokenUp = mouseEvent.add('up', () => {
                params.flag = false;
                if (getCss(target, "left") !== "auto") {
                    params.left = getCss(target, "left");
                }
                if (getCss(target, "top") !== "auto") {
                    params.top = getCss(target, "top");
                }
            });

            // mouseEvent.cancel('move', tokenMove);
        }
    },

    destroyed () {
        let that = this,
            mouseEvent = window.mouseEvent;

        mouseEvent.cancel('down', that.tokenDown);
        mouseEvent.cancel('move', that.tokenMove);
        mouseEvent.cancel('up', that.tokenUp);
    }
};
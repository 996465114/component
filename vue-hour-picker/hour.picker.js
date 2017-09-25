/**
 * 小时选择框 调用方式
 * <hourPicker
        placeholder="默认00点-23点"
        v-model="callOutForm.hour">
    </hourPicker>

    placeholder 为输入框里面的提示
    v-model 双向绑定值
 */

export default {
    props: {
        'value': {
            type: Array,
            required: false,
            default () {
                return ['00', '23'];
            }
        },
        placeholder: {
            type: String,
            required: false
        }
    },
    data () {
        return {
            isShow: false, // 是否显示时间弹窗
            val: '', // 输入框的值
            rangeArr: [
                ['00', '01', '02', '03', '04', '05', '06'],
                ['07', '08', '09', '10', '11', '12', '13'],
                ['14', '15', '16', '17', '18', '19', '20'],
                ['21', '22', '23']
            ], // 小时二维数组
            choiceStart: '00', // 选中的开始时间
            choiceEnd: '23', // 选择的介绍时间
            mouseoverVal: '', // 鼠标在值上面
            tempGlobalClick: '' // 点击事件，全局调用，用于没有点击下拉框时收起下拉框
        };
    },
    created () {
        let that = this,
            common = that.common,
            domGlobalClick = common.domGlobalClick;

        // 初始化输入框
        that.init();

        // 添加事件
        that.tempGlobalClick = domGlobalClick.add(() => {
            that.isShow = false;
        }, that);
    },
    methods: {
        /**
         * [init 初始化]
         */
        init () {
            let that = this,
                common = that.common,
                value = that.value;

            // 初始化输入框
            that.val = value[0] + '点 - ' + value[1] + '点';

            that.choiceStart = value[0];
            that.choiceEnd = value[1];
        },

        /**
         * [handleDisplay 输入框控制显示还是隐藏]
         */
        handleDisplay () {
            let that = this;

            that.isShow = true;
        },

        /**
         * [choice 时间选择事件]
         */
        choice (val) {
            let that = this,
                rangeArr = that.rangeArr,
                rangeArrLen = rangeArr.length,
                rangeArrChildLen = rangeArr[0].length;

            if (that.choiceEnd !== '') { // 不等于空，为单选，也即选择开始时间
                that.choiceStart = val;
                that.choiceEnd = '';
            } else { // 选择结束时间
                if (parseInt(that.choiceStart, 10) > parseInt(val, 10)) { // 选择的时间小于开始时间
                    that.choiceStart = val;
                    that.choiceEnd = '';
                } else {
                    that.choiceEnd = val;
                    that.val = that.choiceStart + '点 - ' + that.choiceEnd + '点';
                    that.$emit('input', [that.choiceStart, that.choiceEnd]);

                    // 下拉框收起
                    that.close();
                }
            }
        },

        /**
         * [over 鼠标在值上面]
         */
        over (val) {
            let that = this;

            if (that.choiceEnd === '') { // 还没有选择结束时间
                if (parseInt(val) > parseInt(that.choiceStart)) { // 如果时间大于
                    that.mouseoverVal = val;
                } else {
                    that.mouseoverVal = '';
                }
            } else {
                that.mouseoverVal = '';
            }
        },

        /**
         * [close 弹窗关闭]
         */
        close () {
            let that = this;

            that.isShow = false;
        }
    },
    watch: {
        value (newVal, oldVal) {
            this.init();
        }
    },
    destroyed () {
        let that = this,
            common = that.common,
            domGlobalClick = common.domGlobalClick;

        domGlobalClick.cancel(that.tempGlobalClick);
    }
};
<template>
    <div
        class="hour-picker"
        @click.stop>
        <div class="el-input el-input--small">
            <i class="el-input__icon el-icon-time"></i>
            <input
                type="text"
                readonly="readonly"
                :placeholder="placeholder"
                class="el-input__inner"
                :value="val"
                @click="handleDisplay">
            <transition
                name="hour-down">
                <div
                    v-if="isShow"
                    class="hour-down">
                    <div class="hour-content">
                        <ul class="lists">
                            <template v-for="arr in rangeArr">
                                <li
                                    v-for="node in arr"
                                    class="item"
                                    :class="{'choice': (node === choiceStart || node === choiceEnd), 'over': (mouseoverVal !== '' && parseInt(mouseoverVal) === parseInt(node)), 'between': (choiceEnd !== '' ? (parseInt(node) > parseInt(choiceStart) && parseInt(node) < parseInt(choiceEnd)) : (parseInt(node) > parseInt(choiceStart) && parseInt(node) < parseInt(mouseoverVal)))}"
                                    @click="choice(node)"
                                    @mouseover="over(node)">
                                    {{ node }}
                                </li>
                                <br />
                            </template>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import hourPicker from './hour.picker.js';

    export default {
        ...hourPicker
    };
</script>

<style scoped src="./hour-picker.css"></style>
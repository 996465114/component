*** 组件调用方式

> 引入组件，然后调用以下代码

```vue
    import hourPicker from './hour-picker.vue'; // hour-picker.vue的相对路径

    <hourPicker
        placeholder="默认00点-23点"
        v-model="selectHour">
    </hourPicker>

    selectHour: ['00', '23']
```

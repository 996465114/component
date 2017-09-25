*** 组件调用方式

> 引入组件，然后调用以下代码

```vue
import pictureElement from './picture.vue'; // picture.vue的相对路径

<pictureElement
    v-if="isShow"
    :lists="lists"
    @close="closePicture">
</pictureElement>
```

lists格式为图片路径数组。
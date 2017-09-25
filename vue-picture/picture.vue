<template>
    <div
        class="wrapper"
        v-if="isShow">
        <!-- <div class="cover"></div> -->
        <div
            class="content"
            ref="pictureContent">
            <div
                class="close"
                @click.stop="close"
                @mousedown.stop>
                <i class="icon"></i>
            </div>
            <div
                v-if="isPercentage"
                class="percent">
                {{ percentage + '%' }}
            </div>
            <div
                class="cage"
                @mousewheel="wheel"
                :style="{'width': cageWidth + 'px', 'height': cageHeight + 'px'}">
                <div class="cage-sub">
                    <img
                        ref="pic"
                        class="pic"
                        :src="src"
                        v-if="isComplete"
                        @mousedown="down"
                        @mousemove="move"
                        @mouseup="up"
                        @mouseleave="leave"
                        :style="{'width': (width * zoomBase) + 'px', 'height': (height * zoomBase) + 'px', 'transform': 'rotate(' + rotateBase + 'deg)'}"
                        draggable="false"
                    />
                </div>
            </div>
            <div class="tool">
                <div class="toolct">
                    <span
                        v-if="isBtnShow"
                        class="item btn btn-pre"
                        @click.stop="pre"
                        @mousedown.stop>
                        <i class="icon"></i>
                    </span>
                    <span
                        v-if="isBtnShow"
                        class="item btn btn-next"
                        @click.stop="next"
                        @mousedown.stop>
                        <i class="icon"></i>
                    </span>
                    <span
                        class="item bigger"
                        title="放大图片"
                        @click.stop="bigger"
                        @mousedown.stop>
                        <i class="icon icon-bigger"></i>
                    </span>
                    <span
                        class="item smaller"
                        title="缩小图片"
                        @click.stop="smaller"
                        @mousedown.stop>
                        <i class="icon icon-smaller"></i>
                    </span>
                    <span
                        class="item item-spe rotate"
                        title="向右旋转"
                        @click.stop="rotate"
                        @mousedown.stop>
                        <i class="icon icon-rotate"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import picture from './picture.js';

    export default {
        ...picture
    };
</script>

<style src="./picture.css" scoped></style>
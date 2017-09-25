<template>
    <div class="wrapper">
        <!-- 横向滚动条 -->
        <div class="cross-bar" ref="crossBar">
            <div class="bar" ref="bar"></div>
        </div>
    </div>
</template>

<script>
    import crossBar from './cross.bar';

    export default {
        ...crossBar
    };
</script>

<style src="./cross-bar.css" scoped></style>
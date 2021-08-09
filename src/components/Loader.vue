<template>
    <div 
        :style="{
            width: `${size}rem`,
            height: `${size}rem`,
            zIndex
        }"
        :class="{
        absolute,
        fixed
        }"
    class="spinner-border text-primary"></div>
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            defalut: 2
        },
        absolute: {
            type: Boolean,
            defalut: false
        },
        fixed: {
            type: Boolean,
            defalut: false
        },
        zIndex: {
            type: Number,
            defalut: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.spinner-border {
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    &.absolute {
        position: absolute;
    }
    &.fixed {
        position: fixed;
    }
}
</style>
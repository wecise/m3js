<template>
    <FlexBox class="ovo-hrt-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align right */
.ovo-hrt-box {
	flex-flow: row;
	justify-content: flex-end;
	align-items: flex-start;
}

</style>
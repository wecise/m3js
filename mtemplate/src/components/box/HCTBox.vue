<template>
    <FlexBox class="ovo-hct-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align center top*/
.ovo-hct-box {
	flex-flow: row;
	justify-content: center;
	align-items: flex-start;
}
</style>
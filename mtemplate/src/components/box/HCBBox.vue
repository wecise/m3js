<template>
    <FlexBox class="ovo-hcb-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align center bottom */
.ovo-hcb-box {
	flex-flow: row;
	justify-content: center;
	align-items: flex-end;
}
</style>
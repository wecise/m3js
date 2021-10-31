<template>
    <FlexBox class="ovo-hcm-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align center middle*/
.ovo-hcm-box {
	flex-flow: row;
	justify-content: center;
	align-items: center;
}
</style>
<template>
    <FlexBox class="ovo-vlt-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align top */
.ovo-vlt-box {
	flex-flow: column;
	justify-content: flex-start;
	align-items: flex-start;
}
</style>
<template>
    <FlexBox class="ovo-vrm-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align bottom */
.ovo-vrm-box {
	flex-flow: column;
	justify-content: center;
	align-items: flex-end;
}
</style>
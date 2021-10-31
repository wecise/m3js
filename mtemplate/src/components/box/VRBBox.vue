<template>
    <FlexBox class="ovo-vrb-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items vertical - align bottom */
.ovo-vrb-box {
	flex-flow: column;
	justify-content: flex-end;
	align-items: flex-end;
}
</style>
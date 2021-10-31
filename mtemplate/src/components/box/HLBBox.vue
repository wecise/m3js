<template>
    <FlexBox class="ovo-hlb-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align left */
.ovo-hlb-box {
	flex-flow: row;
	justify-content: flex-start;
	align-items: flex-end;
}
</style>
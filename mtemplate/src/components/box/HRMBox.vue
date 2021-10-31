<template>
    <FlexBox class="ovo-hrm-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align right */
.ovo-hrm-box {
	flex-flow: row;
	justify-content: flex-end;
	align-items: center;
}

</style>
<template>
    <FlexBox class="ovo-hrb-box">
        <slot></slot>
	</FlexBox>
</template>
<script>
import FlexBox from './FlexBox.vue'
export default {components: { FlexBox }}
</script>
<style>
/* items horizontal - align right */
.ovo-hrb-box {
	flex-flow: row;
	justify-content: flex-end;
	align-items: flex-end;
}

</style>
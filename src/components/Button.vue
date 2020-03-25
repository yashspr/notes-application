<template>
	<div @click="clickEvent" class="toolbar__icon-container">
		<svg class="toolbar__icon">
			<slot name="icon"></slot>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['clickEvent']
};
</script>

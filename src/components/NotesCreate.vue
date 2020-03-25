<template>
	<div class="create__container">
		<ToolBar />
		<Form />
	</div>
</template>

<script>
import ToolBar from './ToolBar.vue';
import Form from './Form.vue';

export default {
	data() {
		return {
			title: null,
			description: null
		};
	},
	components: {
		ToolBar,
		Form
	}
};
</script>

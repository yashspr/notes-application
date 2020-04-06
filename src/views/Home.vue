<template>
	<div class="body__container">
		<NotesList />
		<Form />
	</div>
</template>

<script>
import NotesList from '@/components/NotesList.vue';
import Form from '@/components/Form.vue';

export default {
	components: {
		NotesList,
		Form
	},
	created() {}
};
</script>

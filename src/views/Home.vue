<template>
	<div class="body__container">
		<NotesList />
		<Form />
		<NotificationContainer />
	</div>
</template>

<script>
import NotesList from '@/components/NotesList.vue';
import Form from '@/components/Form.vue';
import NotificationContainer from '@/components/NotificationContainer.vue';

export default {
	components: {
		NotesList,
		Form,
		NotificationContainer,
	},
	created() {},
};
</script>

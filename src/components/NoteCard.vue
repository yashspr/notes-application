<template>
	<div class="note-card" @click="populateForm">
		<div class="note-card__title">{{ note.title }}</div>
		<div class="note-card__description">{{ note.description }}</div>
	</div>
</template>

<script>
import EventBus from './../main.js';

export default {
	props: {
		note: {
			type: Object,
			require: true
		}
	},
	methods: {
		populateForm() {
			const note = this.note;
			EventBus.$emit('populate-form', note);
		}
	}
};
</script>

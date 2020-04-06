<template>
	<div class="note-card" @click="populateForm">
		<div class="note-card__title">{{ note.title }}</div>
		<div class="note-card__description">Created At : {{ createdAt }}</div>
		<div class="note-card__description">
			Last Modified At : {{ modifiedAt }}
		</div>
	</div>
</template>

<script>
import EventBus from './../main.js';

export default {
	props: {
		note: {
			type: Object,
			require: true,
		},
		fileID: {
			type: String,
		},
	},
	methods: {
		populateForm() {
			if (!this.note.description) {
				this.$store.dispatch('fetchDescription', this.note.fileID);
			}
			EventBus.$emit('populate-form', this.note);
		},
	},
	computed: {
		createdAt() {
			return new Date(this.note.createdDate).toLocaleString('en-in');
		},
		modifiedAt() {
			return new Date(this.note.lastModified).toLocaleString('en-in');
		},
	},
};
</script>

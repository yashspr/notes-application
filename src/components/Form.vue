<template>
	<form class="form">
		<input
			type="text"
			v-model="title"
			class="form__title"
			placeholder="Title of your notes"
			@keyup="updateNote"
		/>
		<textarea
			name="notes"
			v-model="description"
			class="form__textarea"
			placeholder="Takedown your notes"
			@keyup="updateNote"
		></textarea>
	</form>
</template>

<script>
import EventBus from './../main.js';

export default {
	data() {
		return {
			title: null,
			description: null
		};
	},
	mounted() {
		EventBus.$on('populate-form', note => {
			this.populateForm(note);
		});
		EventBus.$on('clear-form', () => {
			this.clearForm();
		});
		EventBus.$on('fetch-form-data', () => {
			this.addNewNote();
		});
		EventBus.$on('fetch-note-id', () => {
			this.deleteNote();
		});
	},
	methods: {
		populateForm(note) {
			this.id = note.id;
			this.title = note.title;
			this.description = note.description;
		},
		clearForm() {
			this.title = null;
			this.description = null;
		},
		updateNote() {
			let note = {
				id: this.id,
				title: this.title,
				description: this.description
			};
			EventBus.$emit('update-note', note);
		},
		addNewNote() {
			this.title = this.title === null || '' ? 'New Note' : this.title;
			this.description =
				this.description === null || '' ? 'Write your notes' : this.description;
			let note = {
				title: this.title,
				description: this.description
			};
			EventBus.$emit('add-to-notes', note);
			this.title = null;
			this.description = null;
		},
		deleteNote() {
			!this.id
				? alert('no note is selected')
				: EventBus.$emit('delete-note', this.id);
			this.title = null;
			this.description = null;
		}
	}
};
</script>

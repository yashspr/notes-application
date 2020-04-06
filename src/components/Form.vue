<template>
	<div class="form__container">
		<div class="toolbar">
			<button class="toolbar__icon-container" @click="syncNotes">
				<svg class="toolbar__icon icon__sync">
					<use xlink:href="./../assets/sprite.svg#icon-loop2" />
				</svg>
			</button>
			<button class="toolbar__icon-container" @click="clearForm">
				<svg class="toolbar__icon">
					<use xlink:href="./../assets/sprite.svg#icon-block" />
				</svg>
			</button>
			<button class="toolbar__icon-container" @click="addNewNote">
				<svg class="toolbar__icon">
					<use xlink:href="./../assets/sprite.svg#icon-add-to-list" />
				</svg>
			</button>
			<button class="toolbar__icon-container" @click="deleteNote">
				<svg class="toolbar__icon">
					<use xlink:href="./../assets/sprite.svg#icon-trash-can" />
				</svg>
			</button>
		</div>
		<form class="form">
			<div class="title__flex">
				<input
					type="text"
					v-model="note.title"
					class="form__title"
					placeholder="Title of your notes"
					@change="updateNote"
				/>
				<input
					type="text"
					v-model="note.tags"
					class="form__title"
					placeholder="Tags(tag1,tag2)"
					@change="updateTags"
				/>
			</div>
			<textarea
				name="notes"
				v-model="note.description"
				class="form__textarea"
				placeholder="Takedown your notes"
				@change="updateNote"
			></textarea>
		</form>
	</div>
</template>

<script>
import EventBus from './../main.js';

export default {
	data() {
		return {
			note: {
				title: '',
				description: '',
				tags: [],
				createdDate: null,
				lastModified: null,
			},
		};
	},
	created() {
		EventBus.$on('populate-form', (note) => {
			this.populateForm(note);
		});
	},
	methods: {
		populateForm(note) {
			this.note = note;
		},
		clearForm() {
			this.note = {
				title: '',
				description: '',
				tags: [],
				createdDate: null,
				lastModified: null,
			};
		},
		addNewNote() {
			const note = this.collectFormData();
			if (this.note.fileID) {
				this.$store.dispatch('addToUpdateNotes', note);
			} else {
				this.note.title == ''
					? alert('note needs a title ')
					: this.$store.dispatch('addToNewNotes', note);
			}
			this.clearForm();
		},
		updateNote() {
			const note = this.collectFormData();
			this.$store.dispatch('addToUpdateNotes', note);
			this.note = note;
		},
		deleteNote() {
			!this.note.fileID
				? alert('select note to delete')
				: this.$store.dispatch('deleteNote', this.note.fileID);
		},
		collectFormData() {
			let note = {};
			this.note.fileID
				? (note.fileID = this.note.fileID)
				: (note.fileID = `temp${Math.floor(Math.random() * 1000000)}`);
			note.title = this.note.title;
			note.description = this.note.description;
			note.tags = this.note.tags;
			note.createdDate = this.note.createdDate;
			note.lastModified = Date.now();
			return note;
		},
		updateTags() {
			this.note.tags = this.note.tags.split(',');
		},
		syncNotes() {
			this.$store.dispatch('syncNotes');
		},
	},
};
</script>

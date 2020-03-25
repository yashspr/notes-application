<template>
	<div class="toolbar">
		<Button :clickEvent="clearForm">
			<use xlink:href="./../assets/sprite.svg#icon-block" slot="icon" />
		</Button>
		<Button :clickEvent="addNewNote">
			<use xlink:href="./../assets/sprite.svg#icon-add-to-list" slot="icon" />
		</Button>
		<Button :clickEvent="deleteNote">
			<use xlink:href="./../assets/sprite.svg#icon-trash-can" slot="icon" />
		</Button>
	</div>
</template>

<script>
import Button from './Button.vue';
import EventBus from './../main.js';

export default {
	components: {
		Button
	},
	methods: {
		clearForm() {
			EventBus.$emit('clear-form');
		},
		addNewNote() {
			EventBus.$emit('fetch-form-data');
		},
		deleteNote() {
			EventBus.$emit('fetch-note-id');
		}
	}
};
</script>

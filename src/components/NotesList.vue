<template>
	<div class="list__container">
		<NoteCard
			v-for="note in notes"
			:key="note.fileID"
			:note="note"
			:fileID="note.fileID"
		/>
		<!-- <NoteCard
			v-for="fileID in fileIDs"
			:key="fileID"
			:note="notes[fileID]"
			:fileID="fileID"
		/> -->
	</div>
</template>

<script>
import NoteCard from '@/components/NoteCard.vue';
import { mapState } from 'vuex';

export default {
	components: {
		NoteCard,
	},
	computed: {
		...mapState(['notes']),
	},
};
</script>

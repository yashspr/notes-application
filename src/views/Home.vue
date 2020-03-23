<template>
  <div class="body__container">
    <NotesList :notes="notes" />
    <NotesCreate
      @add-to-notes="addNoteToNotes"
      @update-note="updateNote"
      @delete-note="deleteNote"
    />
  </div>
</template>

<script>
import NotesList from '@/components/NotesList.vue';
import NotesCreate from '@/components/NotesCreate.vue';
export default {
  name: 'home',
  data() {
    return {
      notes: [
        {
          id: 1,
          title: 'note 1',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui aut veritatis recusandae ipsum fuga, sequi, quasi provident maiores fugit praesentium aliquid eaque, magni consectetur magnam molestiae ut consequuntur adipisci tenetur.'
        },
        {
          id: 2,
          title: 'note 2',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui aut veritatis recusandae ipsum fuga, sequi, quasi provident maiores fugit praesentium aliquid eaque, magni consectetur magnam molestiae ut consequuntur adipisci tenetur.'
        },
        {
          id: 3,
          title: 'note 3',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui aut veritatis recusandae ipsum fuga, sequi, quasi provident maiores fugit praesentium aliquid eaque, magni consectetur magnam molestiae ut consequuntur adipisci tenetur.'
        }
      ],
      clickedNote: null
    };
  },
  components: {
    NotesList,
    NotesCreate
  },
  methods: {
    addNoteToNotes(note) {
      note.id = this.notes.length + 1;
      this.notes.push(note);
    },
    updateNote(note) {
      let objToUpdate = this.notes.find(noteObj => noteObj.id === note.id);
      objToUpdate.title = note.title;
      objToUpdate.description = note.description;
    },
    deleteNote(id) {
      let index = this.notes.findIndex(note => note.id === id);
      index != -1
        ? this.notes.splice(index, 1)
        : alert('select note to delete');
    }
  }
};
</script>

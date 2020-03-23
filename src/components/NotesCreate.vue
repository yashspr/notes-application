<template>
  <div class="create__container">
    <div class="toolbar">
      <div @click="clearForm" class="toolbar__icon-container">
        <svg class="toolbar__icon">
          <use xlink:href="./../assets/sprite.svg#icon-block"></use>
        </svg>
      </div>
      <div @click="addNewNote" class="toolbar__icon-container">
        <svg class="toolbar__icon">
          <use xlink:href="./../assets/sprite.svg#icon-add-to-list"></use>
        </svg>
      </div>
      <div @click="deleteNote" class="toolbar__icon-container">
        <svg class="toolbar__icon">
          <use xlink:href="./../assets/sprite.svg#icon-trash-can"></use>
        </svg>
      </div>
    </div>
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
  </div>
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
      this.id = note.id;
      this.title = note.title;
      this.description = note.description;
    });
  },
  methods: {
    clearForm() {
      this.title = null;
      this.description = null;
    },
    addNewNote() {
      this.title = this.title === null || '' ? 'New Note' : this.title;
      this.description =
        this.description === null || '' ? 'Write your notes' : this.description;
      let note = {
        title: this.title,
        description: this.description
      };
      this.$emit('add-to-notes', note);
      this.title = null;
      this.description = null;
    },
    updateNote() {
      let note = {
        id: this.id,
        title: this.title,
        description: this.description
      };
      this.$emit('update-note', note);
    },
    deleteNote() {
      !this.id
        ? alert('no note is selected')
        : this.$emit('delete-note', this.id);
      this.title = null;
      this.description = null;
    }
  }
};
</script>

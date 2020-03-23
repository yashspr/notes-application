<template>
  <div class="list__container">
    <NoteCard v-for="note in notes" :key="note.id" :note="note" />
  </div>
</template>

<script>
import NoteCard from "@/components/NoteCard.vue";

export default {
  props: ["notes"],
  components: {
    NoteCard
  }
};
</script>

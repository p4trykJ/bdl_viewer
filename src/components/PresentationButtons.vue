<template>
  <v-row>
    <v-col>
      <v-btn>
        <v-icon @click="startPresentation">
          mdi-play
        </v-icon>
      </v-btn>
      <v-btn @click="previousSlide">
        <v-icon>
          mdi-skip-previous
        </v-icon>
      </v-btn>
      <v-btn @click="nextSlide">
        <v-icon>
          mdi-skip-next
        </v-icon>
      </v-btn>
      <v-btn @click="stopPresentation">
        <v-icon>
          mdi-play-pause
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PresentationButtons',
  computed: {
    timeoutID() {
      return this.$store.getters.getTimeoutID;
    },
  },
  methods: {
    startPresentation() {
      this.$root.$emit('startPresentation');
    },
    nextSlide() {
      this.$root.$emit('nextSlide');
    },
    previousSlide() {
      this.$root.$emit('previousSlide');
    },
    stopPresentation() {
      this.$root.$emit('stopPresentation');
    },
  },
};
</script>

<style></style>

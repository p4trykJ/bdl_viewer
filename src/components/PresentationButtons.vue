<template>
  <v-row>
    <v-col>
      <v-btn class="button--ol mr-1" dark @click="previousSlide">
        <v-icon>
          mdi-skip-previous
        </v-icon>
      </v-btn>
      <v-btn class="button--ol mr-1" dark @click="nextSlide">
        <v-icon>
          mdi-skip-next
        </v-icon>
      </v-btn>
      <v-btn
        class="button--ol"
        dark
        @click="stopPresentation"
        v-show="isPresentationOnAuto"
      >
        <v-icon>
          mdi-play-pause
        </v-icon>
      </v-btn>
      <v-btn
        class="button--ol"
        dark
        v-show="!isPresentationOnAuto"
        @click="startPresentation"
      >
        <v-icon>
          mdi-play
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PresentationButtons',
  data: () => ({
    isPresentationOn: false,
  }),
  computed: {
    isPresentationOnAuto() {
      return this.$store.getters.getIsPresentationOnAuto;
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
  mounted() {
    this.$root.$on('isAutoPresentation', this.setPresentation);
  },
};
</script>

<style></style>

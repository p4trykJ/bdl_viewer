<template>
  <v-app>
    <v-app-bar absolute>
      <v-app-bar-nav-icon
        @click="drawerVisibility = !drawerVisibility"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <!-- Side menu -->

    <v-navigation-drawer app v-model="drawerVisibility" temporary>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-btn icon @click="drawerVisibility = !drawerVisibility">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid fill-height pa-0>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout">
      {{ snackbarText }}
      <v-icon color="white" @click="snackbar = false">
        mdi-close
      </v-icon>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data: () => ({
    snackbar: false,
    snackbarText: '',
    color: '',
    timeout: 0,
  }),
  computed: {
    drawerVisibility: {
      get() {
        return this.$store.getters.getDrawerVisibility;
      },
      set(value) {
        this.$store.commit('setDrawerVisibility', value);
      },
    },
  },
  methods: {
    showSnackbar(text, color = 'success', timeout = 5000) {
      this.snackbar = true;
      this.snackbarText = text;
      this.timeout = timeout;
      this.color = color;
    },
  },
  mounted() {
    this.$root.$on('showSnackbar', this.showSnackbar);
  },
};
</script>

<style lang="scss">
.v-app-bar {
  left: unset !important;
  right: unset !important;
  box-shadow: unset !important;
  background-color: unset !important;
}
</style>

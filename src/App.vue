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
      <v-row no-gutters class="px-4">
        <v-col cols="12">
          <v-subheader class="justify-center headline">
            BDL Viewer
          </v-subheader>
        </v-col>
        <v-col cols="12">
          <p class="text-justify subtitle-2">
            BDL Viewer jest aplikacją oferującą możliwość szybkiej i łatwej
            prezentacji danych pochodzących z Banku Danych Lokalnych,
            udostępnianego przez Główny Urząd Statystyczny, w postaci
            kartogramów.
          </p>
        </v-col>
        <v-col cols="12">
          <p class="text-justify subtitle-2">
            W celu wykonania kartogramu należy wypełnić wszystkie wymagane pola,
            a następnie zatwierdzić przyciskiem ✓.
          </p>
        </v-col>
        <v-col cols="12">
          <p class="text-justify subtitle-2">
            Wybierając więcej niż jeden rok aplikacja pozwala na wykonanie
            pokazu slajdów.
          </p>
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
$olButtonsColor: rgba(0, 60, 136, 0.5);
.v-app-bar {
  left: unset !important;
  right: unset !important;
  box-shadow: unset !important;
  background-color: unset !important;
}
.button--ol {
  background-color: $olButtonsColor !important;
  width: 40px !important;
  height: 40px !important;
  min-width: unset !important;
  .v-icon {
    font-size: 23px !important;
  }
  &:hover {
    background-color: rgba(0, 60, 136, 0.7) !important;
  }
}
</style>

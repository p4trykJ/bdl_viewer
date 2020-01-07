<template>
  <v-app>
    <v-app-bar absolute>
      <v-app-bar-nav-icon
        @click="drawerVisibility = !drawerVisibility"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <!-- Side menu -->

    <v-navigation-drawer app v-model="drawerVisibility"></v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid fill-height pa-0>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data: () => ({}),
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
  mounted() {},
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

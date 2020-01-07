<template>
  <v-app>
    <!-- Side menu -->
    <v-navigation-drawer app></v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container
        fluid
        fill-height
        pa-0
        class="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      >
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer absolute>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',

  components: {},

  data: () => ({
    //
  }),
  mounted() {
    console.log(process.env);
  },
};
</script>

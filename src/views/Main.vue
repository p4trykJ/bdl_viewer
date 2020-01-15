<template>
  <v-container pa-0 fluid>
    <Map></Map>
    <v-row class="menu menu--main">
      <v-col>
        <v-menu
          transition="slide-x-transition"
          :max-width="500"
          :close-on-click="false"
          :close-on-content-click="false"
          v-model="mainMenuVisible"
        >
          <template #activator="{on}">
            <v-btn v-show="!mainMenuVisible" @click="toggleMenu('mainMenu')">
              <v-icon>
                mdi-settings-outline
              </v-icon>
            </v-btn>
          </template>
          <v-card class="card--main mx-auto">
            <v-card-title>
              Ustawienia
              <v-spacer></v-spacer>
              <v-btn icon @click="toggleMenu('mainMenu')">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-tabs grow centered center-active v-model="mainMenuTab">
                <v-tab>
                  Kategoria
                </v-tab>
                <v-tab>
                  Dane
                </v-tab>
                <v-tab>
                  Kartogramy
                </v-tab>
                <v-tabs-items v-model="mainMenuTab">
                  <v-tab-item>
                    <Categories
                      @requestCompleted.once="cardLoading = false"
                      @formFilled.once="mainMenuTab = 1"
                    >
                    </Categories>
                  </v-tab-item>
                  <v-tab-item>
                    <Data @dataFilled.once="mainMenuTab = 2"></Data>
                  </v-tab-item>
                  <v-tab-item>
                    <Carto></Carto>
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon title="Akceptuj" @click="accept">
                <v-icon>mdi-check-outline</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="menu menu--legend">
      <v-col cols="12" sm="12">
        <v-menu
          transition="slide-x-reverse-transition"
          :max-width="500"
          :close-on-click="false"
          :close-on-content-click="false"
          v-model="legendMenuVisible"
        >
          <template v-slot:activator="{on}">
            <v-btn
              color="primary"
              dark
              @click="toggleMenu('legendMenu')"
              v-show="!legendMenuVisible"
            >
              <v-icon>
                mdi-map-legend
              </v-icon>
            </v-btn>
          </template>
          <v-card class="card--legend mx-auto">
            <v-card-title>
              Legenda
              <v-spacer></v-spacer>
              <v-btn icon @click="toggleMenu('legendMenu')">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-tabs grow centered center-active v-model="legendMenuTab">
                <v-tab>
                  Legenda
                </v-tab>
                <v-tab>
                  Statystyki
                </v-tab>
                <v-tabs-items v-model="legendMenuTab">
                  <v-tab-item>
                    <Legend></Legend>
                  </v-tab-item>
                  <v-tab-item>
                    <Statistics></Statistics>
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <!-- <v-row class="menu menu--layers">
      <v-col cols="12" sm="12">
        <v-menu offset-y>
          <template v-slot:activator="{on}">
            <v-btn color="primary" dark>
              menu
            </v-btn>
          </template>
          aaa
        </v-menu>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import Map from '@/components/Map.vue';
// Main menu components
import Carto from '@/components/Carto.vue';
import Categories from '@/components/Categories.vue';
import Data from '@/components/Data.vue';
// Legend components
import Statistics from '@/components/Statistics.vue';
import Legend from '../components/Legend.vue';

export default {
  name: 'Main',
  components: {
    Map,
    // Main menu components
    Carto,
    Categories,
    Data,
    // Legend components
    Statistics,
    Legend,
  },
  data: () => ({
    // Main menu
    mainMenuVisible: true,
    mainMenuTab: 0,

    // Legend
    legendMenuVisible: false,
    legendMenuTab: 0,
    cardLoading: true,
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
    accept() {
      this.$root.$emit('drawCartogram');
    },
    toggleMenu(menu) {
      this[`${menu}Visible`] = !this[`${menu}Visible`];
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.menu {
  position: absolute;
  z-index: 5;
}
.card--main {
  width: 500px;
  max-width: 100vw;
}
.menu--main {
  top: 50px;
}
.menu--layers {
  top: 0;
  right: 0;
}
.menu--legend {
  bottom: 400px;
  right: 0;
}
.card--legend {
  // min-width: 330px;
  max-width: 100vw;
}
</style>

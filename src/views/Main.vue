<template>
  <v-container pa-0 fluid>
    <Map></Map>
    <v-row class="menu menu--main">
      <v-col>
        <v-menu
          transition="slide-x-transition"
          :close-on-click="false"
          :close-on-content-click="false"
          v-model="mainMenuVisible"
          offset-x
          :nudge-right="5"
        >
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template #activator="{ on }">
            <v-btn
              title="Ustawienia"
              class="button--ol"
              dark
              @click="toggleMenu('mainMenu')"
            >
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
              <v-tabs
                grow
                centered
                center-active
                show-arrows
                v-model="mainMenuTab"
              >
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
                    <Categories @categoriesFilled.once="onCategoriesFilled">
                    </Categories>
                  </v-tab-item>
                  <v-tab-item>
                    <Data @dataFilled.once="onDataFilled"></Data>
                  </v-tab-item>
                  <v-tab-item>
                    <Carto @cartoFilled.once="onCartoFilled"></Carto>
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-row class="justify-end">
                <v-col
                  cols="auto"
                  :title="
                    isFormFilled
                      ? `Akceptuj`
                      : `Aby wyświetlić kartogram wypełnij pola we wszystkich zakładkach`
                  "
                >
                  <v-btn :disabled="!isFormFilled" icon @click="accept">
                    <v-icon>mdi-check-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <PresentationButtons
      v-show="hasCoupleYears"
      class="menu presentation__buttons"
    />

    <v-row class="menu menu--opacitySlider">
      <v-col cols="12" sm="12">
        <v-menu
          transition="slide-x-transition"
          :close-on-content-click="false"
          v-model="sliderMenuVisible"
          offset-x
          :nudge-right="5"
        >
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template v-slot:activator="{on}">
            <v-btn
              class="button--ol"
              title="Nieprzezroczystość warstwy jednostek"
              dark
              @click="toggleMenu('sliderMenu')"
            >
              <v-icon>
                mdi-opacity
              </v-icon>
            </v-btn>
          </template>
          <v-card class="card--opacitySlider mx-auto">
            <v-card-title>
              Nieprzezroczystość
              <v-spacer></v-spacer>
              <v-btn icon @click="toggleMenu('sliderMenu')">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-slider v-model="unitsLayerOpacity" hide-details> </v-slider>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <v-btn
      class="button--legend button--ol"
      title="Legenda i statystyki"
      dark
      @click="toggleMenu('legendMenu')"
    >
      <v-icon>
        mdi-map-legend
      </v-icon>
    </v-btn>
    <v-row class="menu">
      <v-col cols="12" sm="12">
        <v-menu
          content-class="menu--legend"
          transition="slide-x-reverse-transition"
          :close-on-click="false"
          :close-on-content-click="false"
          v-model="legendMenuVisible"
        >
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <!-- <template v-slot:activator="{on}">
        
          </template> -->
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
              <v-tabs
                grow
                centered
                center-active
                show-arrows
                v-model="legendMenuTab"
              >
                <v-tab>
                  Symbolizacja
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
// Other components
import PresentationButtons from '../components/PresentationButtons.vue';

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
    // Other components
    PresentationButtons,
  },
  data: () => ({
    // Main menu
    mainMenuVisible: true,
    mainMenuTab: 0,
    // Legend
    legendMenuVisible: false,
    legendMenuTab: 0,
    // Slider
    sliderMenuVisible: false,
    // Form filled variables
    categoryFilled: false,
    cartoFilled: false,
    dataFilled: false,
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
    hasCoupleYears() {
      return this.$store.getters.getChosenYears.length > 1;
    },
    isFormFilled() {
      return this.cartoFilled && this.dataFilled && this.categoryFilled;
    },
    unitsLayerOpacity: {
      get() {
        return this.$store.getters.getUnitsLayerOpacity;
      },
      set(value) {
        this.$store.commit('setUnitsLayerOpacity', value);
      },
    },
  },
  methods: {
    accept() {
      this.$root.$emit('prepareDataset');
    },
    toggleMenu(menu) {
      this[`${menu}Visible`] = !this[`${menu}Visible`];
    },
    onCategoriesFilled() {
      this.categoryFilled = true;
      this.mainMenuTab = 1;
    },
    onDataFilled() {
      this.dataFilled = true;
      this.mainMenuTab = 2;
    },
    onCartoFilled() {
      this.cartoFilled = true;
    },
    onCartogramDrawn() {
      this.legendMenuVisible = true;
    },
  },
  mounted() {
    this.$root.$once('cartogramDrawn', this.onCartogramDrawn);
  },
};
</script>

<style lang="scss">
.menu {
  position: absolute;
  z-index: 5;
}
.menu--main {
  top: 45px;
  left: 5px;
}
.card--main {
  width: 400px;
}
.menu--opacitySlider {
  top: 90px;
  left: 5px;
}
.button--legend {
  position: absolute;
  top: 147px;
  left: 5px;
}
.menu--legend {
  top: 300px !important;
  right: 5px !important;
  left: unset !important;
  bottom: unset !important;
}
@media (min-width: 480px) {
  .card--legend {
    width: 340px;
  }
}
.presentation__buttons {
  top: 10px;
  right: 50px;
  .presentation__list {
    list-style: none;
  }
}
</style>

<template>
  <v-container pa-0 fluid>
    <Map></Map>
    <v-row class="menus menus--main">
      <v-col>
        <v-menu
          transition="slide-x-transition"
          :max-width="500"
          :close-on-click="false"
          :close-on-content-click="false"
          v-model="mainMenuVisible"
        >
          <template #activator="{on}">
            <v-btn
              @click="mainMenuVisible = !mainMenuVisible"
              v-show="!mainMenuVisible"
            >
              <v-icon>
                mdi-settings-outline
              </v-icon>
            </v-btn>
          </template>
          <v-card class="card--main mx-auto" :loading="cardLoading">
            <v-card-title>
              Ustawienia
              <v-spacer></v-spacer>
              <v-btn icon @click="mainMenuVisible = !mainMenuVisible">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-tabs grow centered center-active v-model="activeTab">
                <v-tab>
                  Kategoria
                </v-tab>
                <v-tab>
                  Dane
                </v-tab>
                <v-tab>
                  Kartogramy
                </v-tab>
                <v-tabs-items v-model="activeTab">
                  <v-tab-item>
                    <Categories
                      @requestCompleted.once="cardLoading = false"
                      @formFilled="activeTab = 1"
                    >
                    </Categories>
                  </v-tab-item>
                  <v-tab-item>
                    b a
                  </v-tab-item>
                  <v-tab-item>
                    aac
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn icon>
                <v-icon>mdi-cancel</v-icon>
              </v-btn> -->
              <v-btn icon title="Akceptuj">
                <v-icon>mdi-check-outline</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="menus menus--legend">
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
    </v-row>
    <v-row class="menus menus--layers">
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
    </v-row>
  </v-container>
</template>

<script>
import Map from '@/components/Map.vue';
import Categories from '@/components/Categories.vue';

export default {
  name: 'Main',
  components: {
    Map,
    Categories,
  },
  data: () => ({
    mainMenuVisible: true,
    cardLoading: true,
    activeTab: 0,
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
  methods: {},
  mounted() {},
};
</script>

<style lang="scss">
.menus {
  position: absolute;
  z-index: 5;
}
.card--main {
  width: 500px;
}
.menus--main {
  top: 50px;
}
.menus--layers {
  top: 0;
  right: 0;
}
.menus--legend {
  bottom: 100px;
  right: 0;
}
</style>

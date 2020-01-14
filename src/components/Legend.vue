<template>
  <v-content>
    <v-row>
      <v-col>
        <v-list dense v-if="colorsBreaks">
          <v-list-item v-for="item in colorsBreaks" :key="item.color">
            <v-list-item-icon>
              <div
                class="legend__rectangle"
                :style="{backgroundColor: item.color}"
              ></div>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.range"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-subheader v-else>Wybierz dane</v-subheader>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  name: 'Legend',
  computed: {
    colorsBreaks() {
      const colorBrew = this.$store.getters.getColorBrew;
      try {
        const breaks = colorBrew.getBreaks();
        const colors = colorBrew.getColors();
        const colorsBreaks = [];
        for (let i = 0; i < colors.length; i++) {
          colorsBreaks.push({
            color: colors[i],
            range: `${breaks[i]} - ${breaks[i + 1]}`,
          });
        }
        return colorsBreaks;
      } catch {
        return false;
      }
    },
    variable: {
      get() {
        return this.$store.getters.getVariable;
      },
      set(value) {
        this.$store.commit('setVariable', value);
      },
    },
    chosenYears: {
      get() {
        return this.$store.getters.getChosenYears;
      },
      set(value) {
        this.$store.commit('setChosenYears', value);
      },
    },
  },
  methods: {
    getVariable() {
      this.$store.dispatch('getVariable', this.variable.id).then(r => {
        this.chosenVariable = r.data;
      });
    },
  },
};
</script>

<style>
.legend__rectangle {
  height: 20px;
  width: 20px;
}
</style>

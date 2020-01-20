<template>
  <v-content>
    <v-row>
      <v-col>
        <v-list dense v-if="colorsBreaks">
          <v-subheader style="height:auto;" class="py-1">
            <div style="text-transform: capitalize">
              <span>{{ variable.text }}</span> w roku
              <span
                >{{ currentYear }}
                <div>Jednostka: {{ variable.measureUnitName }}</div>
              </span>
            </div>
          </v-subheader>
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
        <v-subheader v-else>
          W celu wyświetlenia legendy wybierz zestaw danych
        </v-subheader>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
function fixValue(value, precision) {
  return !(value % 1) ? value : value.toFixed(precision);
}
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
            range: `${fixValue(breaks[i], 2)} - ${fixValue(breaks[i + 1], 2)}`,
          });
        }
        return colorsBreaks;
      } catch {
        return false;
      }
    },
    variable() {
      return this.$store.getters.getVariable;
    },
    currentYear() {
      return this.$store.getters.getCurrentYear;
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

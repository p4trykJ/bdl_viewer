<template>
  <v-content>
    <v-row>
      <v-col>
        <v-list dense v-if="statistics">
          <v-list-item v-for="item in statistics" :key="item.name">
            <v-list-item-content>
              <v-row>
                <v-col cols="auto">
                  <v-list-item-title
                    class="statistics"
                    v-text="item.name"
                    :title="item.name"
                  ></v-list-item-title>
                </v-col>
                <v-col>
                  <v-list-item-subtitle
                    class="statistics statistics__value"
                    v-text="item.value"
                    :title="item.value"
                  ></v-list-item-subtitle>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-subheader v-else>Wybierz dane</v-subheader>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
/* eslint-disable no-underscore-dangle */
function fixValue(value, precision) {
  return !(value % 1) ? value : value.toFixed(precision);
}
export default {
  name: 'Statistics',
  computed: {
    statistics() {
      const colorBrew = this.$store.getters.getColorBrew;
      try {
        const series = colorBrew.getSeries();
        return [
          {
            name: 'Średnia',
            value: fixValue(colorBrew._mean(series), 2),
          },
          {
            name: 'Suma',
            value: fixValue(colorBrew._sum(series), 2),
          },
          {
            name: 'Wariancja',
            value: fixValue(colorBrew._variance(series), 2),
          },
          {
            name: 'Odchylenie standardowe',
            value: fixValue(colorBrew._stdDev(series), 2),
          },
        ];
      } catch {
        return false;
      }
    },
  },
};
</script>

<style lang="scss">
.statistics {
  font-size: 0.99rem !important;
}
.statistics__value {
  text-align: end;
}
</style>

<template>
  <v-content>
    <v-row>
      <v-col>
        <v-list dense v-if="statistics">
          <v-list-item v-for="item in statistics" :key="item.name">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.value"></v-list-item-subtitle>
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
            value: colorBrew._mean(series),
          },
          {
            name: 'Suma',
            value: colorBrew._sum(series),
          },
          {
            name: 'Wariancja',
            value: colorBrew._variance(series),
          },
          {
            name: 'Odchylenie standardowe',
            value: colorBrew._stdDev(series),
          },
        ];
      } catch {
        return false;
      }
    },
  },
};
</script>

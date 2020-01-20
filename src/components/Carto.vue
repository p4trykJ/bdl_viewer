<template>
  <v-content>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="classesAmount"
          outlined
          label="Liczba klas"
          :rules="[
            rules.required,
            rules.number,
            rules.greaterThan2,
            rules.lessThan9,
          ]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="classifyMethod"
          :items="classifyMethods"
          outlined
          label="Podział"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="colorRamp"
          :items="colorRamps"
          outlined
          label="Paleta kolorów"
          :rules="[rules.required]"
          @change="$emit('cartoFilled')"
        />
      </v-col>
    </v-row>
    <v-row v-if="chosenYears.length > 1" class="pb-0">
      <v-col class="pb-0">
        <v-text-field
          v-model="timeout"
          outlined
          label="Interwał slajdów (s)"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  name: 'DataTab',
  components: {},
  data: () => ({
    // components data
    classifyMethods: [
      {
        value: 'equal_interval',
        text: 'Równe przedziały',
      },
      {
        value: 'quantile',
        text: 'Kwantyle',
      },
      {
        value: 'jenks',
        text: 'Jenksa',
      },
    ],
    colorRamps: [
      'OrRd',
      'PuBu',
      'BuPu',
      'Oranges',
      'BuGn',
      'YlOrBr',
      'YlGn',
      'Reds',
      'RdPu',
      'Greens',
      'YlGnBu',
      'Purples',
      'GnBu',
      'Greys',
      'YlOrRd',
      'PuRd',
      'Blues',
      'PuBuGn',
      'Spectral',
      'RdYlGn',
      'RdBu',
      'PiYG',
      'PRGn',
      'RdYlBu',
      'BrBG',
      'RdGy',
      'PuOr',
      'Set2',
      'Accent',
      'Set1',
      'Set3',
      'Dark2',
      'Paired',
      'Pastel2',
      'Pastel1',
    ],
    rules: {
      required: v => !!v || 'Pole wymagane',
      number: v => /\d/g.test(v) || 'Wartość parametru musi być liczbą',
      greaterThan2: v =>
        Number(v) >= 3 || 'Wartość parametru nie może być mniejsza niż 3',
      lessThan9: v =>
        Number(v) <= 9 || 'Wartość parametru nie może być większa niż 9',
    },
  }),
  filters: {
    variableTextFilter(text) {
      if (text.length > 150) {
        return text.slice(0, 150);
      }
      return text;
    },
  },
  computed: {
    colorRamp: {
      get() {
        return this.$store.getters.getColorRamp;
      },
      set(value) {
        this.$store.commit('setColorRamp', value);
      },
    },
    classifyMethod: {
      get() {
        return this.$store.getters.getClassifyMethod;
      },
      set(value) {
        this.$store.commit('setClassifyMethod', value);
      },
    },
    classesAmount: {
      get() {
        return this.$store.getters.getClassesAmount;
      },
      set(value) {
        this.$store.commit('setClassesAmount', value);
      },
    },
    chosenYears() {
      return this.$store.getters.getChosenYears;
    },
    timeout: {
      get() {
        return this.$store.getters.getTimeout;
      },
      set(value) {
        this.$store.commit('setTimeout', value);
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

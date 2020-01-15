<template>
  <v-content>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          v-model="variable"
          item-text="text"
          return-object
          outlined
          label="Zmienne"
          :rules="[rules.required]"
          :items="variables"
          @change="getVariable()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="chosenYears"
          :items="chosenVariable.years"
          :chips="false"
          outlined
          label="Lata"
          :multiple="false"
          @change="$emit('dataFilled')"
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
    // components v-models
    chosenVariable: {
      years: [],
    },

    rules: {
      required: v => !!v || 'Pole wymagane',
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
    variables() {
      const regex = /n[1-6]$/;
      return this.$store.getters.getVariables.map(variable => {
        variable.text = '';
        Object.keys(variable).forEach(key => {
          if (regex.test(key)) {
            variable.text += ` ${variable[key]}`;
          }
        });
        return variable;
      });
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

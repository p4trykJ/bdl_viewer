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
        >
          <!-- <template #item="{item}">
            {{ item.text | variableTextFilter }}
          </template> -->
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="chosenYears"
          :items="chosenVariable.years"
          chips
          outlined
          label="Lata"
          multiple
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="subgroupSubject"
          item-text="name"
          item-value="id"
          outlined
          label="Podgrupa tematyczna"
          :rules="[rules.required]"
          :items="subgroups"
          @change="onFormFilled"
        >
        </v-autocomplete>
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
    variable: undefined,
    chosenVariable: {
      years: [],
    },
    chosenYears: [],
    groupSubject: undefined,
    subgroupSubject: undefined,

    // components arrays
    mains: [],
    groups: [],
    subgroups: [],
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
  },
  methods: {
    getVariable() {
      this.$store.dispatch('getVariable', this.variable.id).then(r => {
        this.chosenVariable = r.data;
      });
    },
    onFormFilled() {
      this.$store
        .dispatch('getVariables', {
          'subject-id': this.subgroupSubject,
        })
        .then(r => {
          this.this.$emit('formFilled', r.data.results);
        });
    },
  },
  created() {},
};
</script>

<style></style>

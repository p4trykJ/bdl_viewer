<template>
  <v-content>
    <v-row>
      <v-col>
        <v-simple-table height="300px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Statystyka</th>
                <th class="text-left">Wartość</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in desserts" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  name: 'DataTab',
  components: {},
  data: () => ({
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
      },
      {
        name: 'Eclair',
        calories: 262,
      },
      {
        name: 'Cupcake',
        calories: 305,
      },
      {
        name: 'Gingerbread',
        calories: 356,
      },
      {
        name: 'Jelly bean',
        calories: 375,
      },
      {
        name: 'Lollipop',
        calories: 392,
      },
      {
        name: 'Honeycomb',
        calories: 408,
      },
      {
        name: 'Donut',
        calories: 452,
      },
      {
        name: 'KitKat',
        calories: 518,
      },
    ],
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

<style></style>

<template>
  <v-content>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          v-model="mainSubject"
          item-text="name"
          item-value="id"
          outlined
          label="Główny temat"
          :rules="[rules.required]"
          :items="mains"
          @change="getSubjects('groups', mainSubject)"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="groupSubject"
          item-text="name"
          item-value="id"
          outlined
          label="Grupa tematyczna"
          :rules="[rules.required]"
          :items="groups"
          @change="getSubjects('subgroups', groupSubject)"
        >
        </v-autocomplete>
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
  name: 'CategoriesTab',
  components: {},
  data: () => ({
    // components v-models
    mainSubject: undefined,
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
  computed: {},
  methods: {
    getSubjects(level, parentID = null) {
      this.$store.dispatch('getSubjects', {'parent-id': parentID}).then(r => {
        this[level] = r.data.results;
      });
    },
    onFormFilled() {
      this.$store
        .dispatch('getVariables', {
          'subject-id': this.subgroupSubject,
        })
        .then(r => {
          this.$store.commit('setVariables', r.data.results);
          this.$emit('categoriesFilled', r.data.results);
        });
    },
  },
  created() {
    this.getSubjects('mains');
  },
};
</script>

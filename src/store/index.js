import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import classyBrew from 'classybrew';

Vue.use(Vuex);

/* eslint-disable */
axios.interceptors.request.use(
  config => {
    config.baseURL = process.env.VUE_APP_BDL_API_URL;
    config.params = Object.assign(
      {format: 'json', 'page-size': 100},
      config.params
    );
    config.headers = Object.assign(
      {
        // 'X-ClientId': process.env.VUE_APP_BDL_API_KEY,
        // 'Access-Control-Allow-Origin': '*',
      },
      config.headers
    );
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  config => {
    if (config.statusText === 'OK') {
      return config;
    }
  },
  error => {
    vm.$root.$emit(
      'showSnackbar',
      error.response.data.errors[0].errorReason,
      'error'
    );
    return Promise.reject(error);
  }
);

export default new Vuex.Store({
  state: {
    drawerVisibility: false,
    variables: [],
    variable: undefined,
    chosenYears: [],
    colorRamp: undefined,
    classifyMethod: undefined,
    classesAmount: undefined,
    dataArray: [],
    colorBrew: new classyBrew(),
  },
  getters: {
    getDrawerVisibility(state) {
      return state.drawerVisibility;
    },
    getVariables(state) {
      return state.variables;
    },
    getVariable(state) {
      return state.variable;
    },
    getChosenYears(state) {
      return state.chosenYears;
    },
    getColorRamp(state) {
      return state.colorRamp;
    },
    getClassifyMethod(state) {
      return state.classifyMethod;
    },
    getClassesAmount(state) {
      return state.classesAmount;
    },
    getDataArray(state) {
      return state.dataArray;
    },
    getColorBrew(state) {
      return state.colorBrew;
    },
  },
  mutations: {
    setDrawerVisibility(state, value) {
      state.drawerVisibility = value;
    },
    setVariables(state, value) {
      state.variables = value;
    },
    setVariable(state, value) {
      state.variable = value;
    },
    setChosenYears(state, value) {
      state.chosenYears = value;
    },
    setColorRamp(state, value) {
      state.colorRamp = value;
    },
    setClassifyMethod(state, value) {
      state.classifyMethod = value;
    },
    setClassesAmount(state, value) {
      state.classesAmount = value;
    },
    setDataArray(state, value) {
      state.dataArray = value;
    },
  },
  actions: {
    getSubjects(ctx, payload) {
      return axios({
        method: 'get',
        url: 'subjects',
        params: payload,
      })
        .then(r => r)
        .catch(e => {
          return e;
        });
    },
    getVariables(ctx, payload) {
      return axios({
        method: 'get',
        url: 'variables',
        params: payload,
      })
        .then(r => r)
        .catch(e => {
          return e;
        });
    },
    getVariable(ctx, id) {
      return axios({
        method: 'get',
        url: `variables/${id}`,
      })
        .then(r => r)
        .catch(e => {
          return e;
        });
    },
    getData({state, commit}) {
      return axios({
        method: 'get',
        url: `data/by-variable/${state.variable.id}`,
        params: {
          'aggregate-id': 1,
          'unit-level': 2,
          year: state.chosenYears,
          // .join(','),
        },
      })
        .then(r => {
          commit(
            'setDataArray',
            r.data.results.map(r => r.values[0].val)
          );
          return r;
        })
        .catch(e => {
          return e;
        });
    },
  },
});

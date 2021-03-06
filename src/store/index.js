import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import ClassyBrew from 'classybrew';

Vue.use(Vuex);

axios.interceptors.request.use(
  config => {
    config.baseURL = process.env.VUE_APP_BDL_API_URL;
    config.params = Object.assign(
      {
        format: 'json',
        'page-size': 100,
      },
      config.params
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
    return false;
  },
  error => {
    window.vm.$root.$emit(
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
    colorBrew: new ClassyBrew(),
    currentYear: undefined,
    timeout: 5,
    isPresentationOnAuto: false,
    unitsLayerOpacity: 100,
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
    getColorBrew(state) {
      return state.colorBrew;
    },
    getCurrentYear(state) {
      return state.currentYear;
    },
    getTimeout(state) {
      return state.timeout;
    },
    getIsPresentationOnAuto(state) {
      return state.isPresentationOnAuto;
    },
    getUnitsLayerOpacity(state) {
      return state.unitsLayerOpacity;
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
    setCurrentYear(state, value) {
      state.currentYear = value;
    },
    setTimeout(state, value) {
      state.timeout = value;
    },
    setIsPresentationOnAuto(state, value) {
      state.isPresentationOnAuto = value;
    },
    setUnitsLayerOpacity(state, value) {
      state.unitsLayerOpacity = value;
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
    getData({state}) {
      let url = `data/by-variable/${state.variable.id}`;
      if (state.chosenYears.length > 0) {
        url += '?';
        state.chosenYears.forEach(year => {
          url += `year=${year}&`;
        });
        url = url.slice(0, -1);
      }
      return axios({
        method: 'get',
        url,
        params: {
          'aggregate-id': 1,
          'unit-level': 2,
        },
      })
        .then(r => {
          return r;
        })
        .catch(e => {
          return e;
        });
    },
  },
});

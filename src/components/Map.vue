<template>
  <v-container pa-0 fluid>
    <div id="map" class="map"></div>
  </v-container>
</template>

<script>
/* eslint-disable no-plusplus */

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {OSM, XYZ} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {GeoJSON} from 'ol/format';
import {
  Style,
  Stroke,
  Fill,
  // Circle
} from 'ol/style';
import {defaults as defaultControls} from 'ol/control';

export default {
  name: 'Map',
  data: () => ({
    indexStartFrom: 0,
    timeoutID: undefined,
    currentYearIndex: undefined,
  }),
  computed: {
    colorBrew() {
      return this.$store.getters.getColorBrew;
    },
    variableData() {
      return this.$store.getters.getVariableData;
    },
  },
  methods: {
    createMap() {
      this.map = new Map({
        target: 'map',
        view: new View({
          center: [1871831.8566897807, 6884288.3839664385],
          zoom: 6.6,
        }),
        controls: defaultControls(),
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source: new XYZ({
              url:
                'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicDR0cnlraiIsImEiOiJjazExeWNyN3cwankzM2JwNmNtOHgzNXg5In0.StjLw-qURyTLbAZKWxZl2g',
            }),
          }),
          new VectorLayer({
            name: 'units',
            source: new VectorSource({
              url:
                'https://api.mapbox.com/datasets/v1/p4trykj/ck5d02qdn00so2vqokg4i6h95/features?access_token=pk.eyJ1IjoicDR0cnlraiIsImEiOiJjazExeWNyN3cwankzM2JwNmNtOHgzNXg5In0.StjLw-qURyTLbAZKWxZl2g',
              format: new GeoJSON(),
            }),
            style: new Style({
              fill: new Fill({
                color: 'rgba(245, 245, 245, .1)',
              }),
              stroke: new Stroke({
                color: '#000000',
                width: 1,
              }),
            }),
          }),
        ],
      });
      window.map = this.map;
    },
    getColorInRangeHandler(value) {
      try {
        return this.colorBrew.getColorInRange(value);
      } catch {
        return 'rgba(245, 245, 245, .1)';
      }
    },
    getLayerByName(name) {
      return this.map
        .getLayers()
        .getArray()
        .find(layer => {
          return name === String(layer.get('name'));
        });
    },
    getLayerFeatures(name) {
      return this.getLayerByName(name)
        .getSource()
        .getFeatures();
    },
    prepareData() {
      return this.$store.dispatch('getData').then(r => {
        const variableData = {};
        // create object property for every single year
        r.data.results[0].values.forEach(val => {
          variableData[`value_${val.year}`] = [];
        });
        r.data.results.forEach(res => {
          const feature = this.getLayerFeatures('units').find(
            unit => unit.get('JPT_NAZWA_') === res.name.toLowerCase()
          );
          // fill array and add feature property for every single year
          res.values.forEach(obj => {
            const {year, val} = obj;
            variableData[`value_${year}`].push(val);
            feature.set(`value_${year}`, val);
          });
        });
        this.$store.commit('setVariableData', variableData);
        this.drawCartogram(0, true);
      });
    },
    drawCartogram(indexStartFrom, auto = true) {
      const variableDataKeys = Object.keys(this.variableData);
      this.currentYearIndex = indexStartFrom;
      const draw = () => {
        if (this.currentYearIndex < variableDataKeys.length) {
          const key = variableDataKeys[this.currentYearIndex];
          this.$store.commit('setCurrentYear', key.split('_')[1]);
          const data = this.variableData[key];
          this.colorBrew.setSeries(data);
          this.colorBrew.setNumClasses(
            Number(this.$store.getters.getClassesAmount)
          );
          this.colorBrew.setColorCode(this.$store.getters.getColorRamp);
          this.colorBrew.classify(this.$store.getters.getClassifyMethod);
          this.getLayerByName('units').setStyle(feature => {
            const styles = [];
            styles.push(
              new Style({
                fill: new Fill({
                  color: this.colorBrew.getColorInRange(feature.get(key)),
                }),
                stroke: new Stroke({
                  color: '#000000',
                  width: 1,
                }),
              })
            );
            return styles;
          });
          this.getLayerByName('units').changed();
          // eslint-disable-next-line no-plusplus
          this.currentYearIndex++;
          if (auto) {
            this.timeoutID = setTimeout(
              draw,
              Number(this.$store.getters.getTimeout * 1000)
            );
          }
        }
      };
      draw();
    },
    stopPresentation() {
      clearTimeout(this.timeoutID);
    },
    startPresentation() {
      this.drawCartogram(--this.currentYearIndex, true);
    },
    nextSlide() {
      if (this.currentYearIndex < Object.keys(this.variableData).length) {
        clearTimeout(this.timeoutID);
        this.drawCartogram(this.currentYearIndex, false);
      } else {
        this.$root.$emit(
          'showSnackbar',
          'Przejrzano wszystkie dostepne lata',
          'error'
        );
      }
    },
    previousSlide() {
      if (this.currentYearIndex > 1) {
        clearTimeout(this.timeoutID);
        this.currentYearIndex = this.currentYearIndex - 2;
        this.drawCartogram(this.currentYearIndex, false);
      } else {
        this.$root.$emit(
          'showSnackbar',
          'Przejrzano wszystkie dostepne lata',
          'error'
        );
      }
    },
  },
  mounted() {
    this.createMap();
    this.$root.$on('drawCartogram', this.prepareData);
    this.$root.$on('stopPresentation', this.stopPresentation);
    this.$root.$on('startPresentation', this.startPresentation);
    this.$root.$on('nextSlide', this.nextSlide);
    this.$root.$on('previousSlide', this.previousSlide);
  },
};
</script>

<style lang="scss">
.map {
  width: 100%;
  height: 100vh;
  .ol-zoom {
    left: unset;
    right: 0.5em !important;
  }
}
</style>

<template>
  <v-container pa-0 fluid>
    <div id="map" class="map"></div>
  </v-container>
</template>

<script>
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
    currentDataID: 0,
    intervalID: undefined,
  }),
  computed: {
    colorBrew() {
      return this.$store.getters.getColorBrew;
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
        r.data.results[0].values.forEach(val => {
          variableData[`value_${val.year}`] = [];
        });
        r.data.results.forEach(res => {
          const feature = this.getLayerFeatures('units').find(
            unit => unit.get('JPT_NAZWA_') === res.name.toLowerCase()
          );
          res.values.forEach(obj => {
            const {year, val} = obj;
            variableData[`value_${year}`].push(val);
            feature.set(`value_${year}`, val);
          });
        });
        this.$store.commit('setVariableData', variableData);
        return variableData;
      });
    },
    drawCartogram() {
      this.prepareData().then(variableData => {
        this.currentDataID = 0;
        const variableDataKeys = Object.keys(variableData);
        const draw = () => {
          if (this.currentDataID < variableDataKeys.length) {
            const key = variableDataKeys[this.currentDataID];
            this.$store.commit('setCurrentYear', key.split('_')[1]);
            const data = variableData[key];
            this.setColorBrewProperty('setSeries', data);
            this.setColorBrewProperty(
              'setNumClasses',
              Number(this.$store.getters.getClassesAmount)
            );
            this.setColorBrewProperty(
              'setColorCode',
              this.$store.getters.getColorRamp
            );
            this.setColorBrewProperty(
              'classify',
              this.$store.getters.getClassifyMethod,
              true
            );
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
            // eslint-disable-next-line no-plusplus
            this.currentDataID++;
            setTimeout(draw, 5000);
          }
        };
        draw();
      });
    },

    setColorBrewProperty(method, value, dispatch = false) {
      this.colorBrew[method](value);
      if (dispatch) {
        this.getLayerByName('units').changed();
      }
    },
  },
  mounted() {
    this.createMap();
    this.$root.$on('drawCartogram', this.drawCartogram);
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

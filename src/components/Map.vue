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
import ClassyBrew from 'classybrew';

export default {
  name: 'Map',
  data: () => ({
    brew: new ClassyBrew(),
  }),
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
                'https://api.mapbox.com/datasets/v1/p4trykj/ck122ks2h02po2jrori3gurg7/features?access_token=pk.eyJ1IjoicDR0cnlraiIsImEiOiJjazExeWNyN3cwankzM2JwNmNtOHgzNXg5In0.StjLw-qURyTLbAZKWxZl2g',
              format: new GeoJSON(),
            }),
            style: new Style({
              fill: new Fill({
                color: 'rgba(0, 110, 83, 0.2)',
              }),
              stroke: new Stroke({
                color: '#000000',
                width: 0.5,
              }),
            }),
          }),
        ],
      });
      window.map = this.map;
    },
    prepareData() {
      return this.$store.dispatch('getData').then(r => {
        const dataArray = [];
        r.data.results.forEach(res => {
          const value = res.values[0].val;
          const feature = this.getLayerFeatures('units').find(
            unit => unit.get('JPT_NAZWA_') === res.name.toLowerCase()
          );
          feature.set('value', value);
        });
        return dataArray;
      });
    },
    drawCartogram() {
      this.prepareData().then(() => {
        this.brew.setSeries(this.$store.getters.getDataArray);
        this.brew.setNumClasses(Number(this.$store.getters.getClassesAmount));
        this.brew.setColorCode(this.$store.getters.getColorRamp);
        this.brew.classify(this.$store.getters.getClassifyMethod);
        this.getLayerByName('units').setStyle(feature => {
          const styles = [];
          styles.push(
            new Style({
              fill: new Fill({
                color: this.brew.getColorInRange(feature.get('value')),
              }),
              stroke: new Stroke({
                color: '#000000',
                width: 1,
              }),
            })
          );
          return styles;
        });
      });
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

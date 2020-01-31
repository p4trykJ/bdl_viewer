<template>
  <v-container pa-0 fluid>
    <div id="map" class="map">
      <v-row class="popup__wrapper">
        <v-col>
          <v-card class="card--popup">
            <v-card-title>
              Właściwości
              <v-spacer></v-spacer>
              <v-btn icon @click="closePopup">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="prop in selectedFeaturePropArray"
                  :key="prop.name"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="auto">
                        <v-list-item-title
                          class="statistics"
                          v-text="prop.name"
                          :title="prop.name"
                        ></v-list-item-title>
                      </v-col>
                      <v-col>
                        <v-list-item-subtitle
                          class="statistics statistics__value"
                          v-text="prop.value"
                          :title="prop.value"
                        ></v-list-item-subtitle>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
/* eslint-disable no-plusplus */

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {XYZ} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import {GeoJSON} from 'ol/format';
import {
  Style,
  Stroke,
  Fill,
  // Circle
} from 'ol/style';
import {defaults as defaultControls, ScaleLine} from 'ol/control';

export default {
  name: 'Map',
  data: () => ({
    indexToStartFrom: 0,
    timeoutID: undefined,
    currentItem: undefined,
    variableData: {},
    overlay: undefined,
    selectedFeaturePropArray: [],
  }),
  computed: {
    colorBrew() {
      return this.$store.getters.getColorBrew;
    },
    // variableData() {
    //   return this.$store.getters.getVariableData;
    // },
  },
  methods: {
    closePopup() {
      this.overlay.setPosition(undefined);
    },
    createMap() {
      this.overlay = new Overlay({
        element: document.getElementsByClassName('popup__wrapper')[0],
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      this.map = new Map({
        target: 'map',
        view: new View({
          center: [1871831.8566897807, 6884288.3839664385],
          zoom: 6.6,
        }),
        overlays: [this.overlay],
        controls: defaultControls().extend([new ScaleLine()]),
        layers: [
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
      this.map.on('singleclick', e => {
        const {coordinate, pixel} = e;
        const featureAtPixel = this.map.getFeaturesAtPixel(pixel)[0];
        if (!featureAtPixel) {
          this.overlay.setPosition(undefined);
          return;
        }
        const featureProperties = featureAtPixel.getProperties();
        // eslint-disable-next-line camelcase
        const {JPT_NAZWA_} = featureProperties;
        this.selectedFeaturePropArray = [
          {
            name: 'Nazwa',
            value: JPT_NAZWA_,
          },
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(featureProperties)) {
          const [prefix, year] = key.split('@');
          if (prefix === 'value') {
            this.selectedFeaturePropArray.push({
              name: `Wartość ${year}`,
              value: featureProperties[key],
            });
          }
        }
        this.overlay.setPosition(coordinate);
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
    prepareDataset() {
      return this.$store.dispatch('getData').then(r => {
        const variableData = {};
        // create variableData property for every single year
        r.data.results[0].values.forEach(val => {
          variableData[`value@${val.year}`] = [];
        });
        // fill array and add feature property for every single year
        r.data.results.forEach(res => {
          const feature = this.getLayerFeatures('units').find(
            unit => unit.get('JPT_NAZWA_') === res.name.toLowerCase()
          );
          res.values.forEach(obj => {
            const {year, val} = obj;
            const propertyName = `value@${year}`;
            variableData[propertyName].push(val);
            feature.set(propertyName, val);
          });
        });
        this.variableData = variableData;
        this.drawCartogram(0, true);
      });
    },
    drawCartogram(indexToStartFrom, auto = true) {
      clearTimeout(this.timeoutID); // to be sure that there is no draw function waiting in the backgroud
      const variableDataKeys = Object.keys(this.variableData);
      this.currentItem = indexToStartFrom;
      const draw = () => {
        if (this.currentItem < variableDataKeys.length) {
          const key = variableDataKeys[this.currentItem];
          this.$store.commit('setCurrentYear', key.split('@')[1]);
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
          this.currentItem++;
          if (auto) {
            this.$store.commit('setIsPresentationOnAuto', true);
            this.timeoutID = setTimeout(
              draw,
              Number(this.$store.getters.getTimeout * 1000)
            );
          } else {
            this.$store.commit('setIsPresentationOnAuto', false);
          }
        }
      };
      this.$root.$emit('cartogramDrawn');
      draw();
    },
    stopPresentation() {
      clearTimeout(this.timeoutID);
      this.$store.commit('setIsPresentationOnAuto', false);
    },
    startPresentation() {
      this.drawCartogram(--this.currentItem, true);
    },
    nextSlide() {
      if (this.currentItem < Object.keys(this.variableData).length) {
        clearTimeout(this.timeoutID);
        this.drawCartogram(this.currentItem, false);
      } else {
        this.onNoMoreYears();
      }
    },
    previousSlide() {
      if (this.currentItem > 1) {
        clearTimeout(this.timeoutID);
        this.currentItem -= 2;
        this.drawCartogram(this.currentItem, false);
      } else {
        this.onNoMoreYears();
      }
    },
    onNoMoreYears() {
      this.$root.$emit(
        'showSnackbar',
        'Wyświetlono dane dla wszystkich wybranych lat',
        'error'
      );
    },
  },
  mounted() {
    this.createMap();
    this.$root.$on('prepareDataset', this.prepareDataset);
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

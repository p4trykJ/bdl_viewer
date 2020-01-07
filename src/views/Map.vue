<template>
  <v-container pa-0>
    <MapComponent></MapComponent>
  </v-container>
</template>

<script>
// @ is an alias to /src
import MapComponent from '@/components/MapComponent.vue'

export default {
  name: 'Map',
  components: {
    MapComponent,
  },
  mounted() {
    console.log(MapComponent)
  },
}
</script>

<template>
    <div class="onemap-page">
        <Mapview />
        <MapTools />
        <MapTree />
        <NavigationComponent />
    </div>
</template>

<script>
import Mapview from './../components/common/Mapview';
import MapTools from './../components/MapTools';
import MapTree from './../components/MapTree';
import NavigationComponent from './../components/NavigationComponent';

export default {
    name: 'OneMap',
    components: {
        Mapview,
        MapTools,
        MapTree,
        NavigationComponent,
    },
    methods: {},
};
</script>

<style>
.onemap-page {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>

<template>
    <div class="mapdata-visual-view">
        <div id="sceneview"></div>
        <div id="echarts01"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import * as echarts from 'echarts';
import config from './config';

export default {
    name: 'MapDataVisual',
    components: {},
    data() {
        return {
            data: '',
        };
    },
    mounted() {
        this.initMap();
        this.initEcharts();
    },
    methods: {
        //实例化三维底图
        async initMap() {
            const [Map, SceneView, Basemap, TileLayer] = await loadModules(
                ['esri/Map', 'esri/views/SceneView', 'esri/Basemap', 'esri/layers/TileLayer'],
                config.options,
            );
            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });
            const map = new Map({
                basemap,
            });
            const mapView = new SceneView({
                container: 'sceneview',
                map: map,
                // zoom: 15,
                // center: [104.152244, 30.680792],
            });
            mapView.ui.components = [];
        },

        //实例化图表
        initEcharts() {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('echarts01'));

            // 指定图表的配置项和数据
            const option = {
                title: {
                    text: '柱状图demo',
                },
                tooltip: {},
                legend: {
                    data: ['销量1'],
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
                },
                yAxis: {},
                series: [
                    {
                        name: '销量1',
                        type: 'bar',
                        label: {
                            show: true,
                        },
                        itemStyle: {
                            color: '#41E9DA',
                        },
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
    },
};
</script>

<style>
.mapdata-visual-view {
    position: relative;
    width: 100%;
    height: 100%;
}
#sceneview {
    width: 100%;
    height: 100%;
}
#echarts01 {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 300px;
    height: 200px;
    background-color: #fff;
}
</style>
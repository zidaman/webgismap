<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMapToolsitemClick" id="navigation">行政区导航</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="maptree">目录树管理</span>
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="distance">距离测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="area">面积测量</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">更多功能<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-search" command="spacequery">空间查询</el-dropdown-item>
                <el-dropdown-item icon="el-icon-film" command="morescreen">多屏对比</el-dropdown-item>
                <el-dropdown-item icon="el-icon-reading" command="swipanalyst">卷帘分析</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="clear">清除</span>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';

const options = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};

export default {
    name: 'MapTools',
    mounted: function () {
        const checkView = setInterval(() => {
            if (this.$store.getters._getDefaultView) {
                this._initSketchTool();
                clearInterval(checkView);
            }
        }, 200);
    },
    methods: {
        //0初始化绘制工具
        async _initSketchTool() {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            //1、绘制面状区域
            const [SketchViewModel, GraphicsLayer] = await loadModules(
                ['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer'],
                options,
            );
            //移除已添加图层
            const resultLayer = view.map.findLayerById('polygonGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);

            _self.graphicsLayer = new GraphicsLayer({
                id: 'polygonGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
            view.map.add(_self.graphicsLayer);

            const polygonSymbol = {
                type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                color: 'rgba(216,30,6, 0.4)',
                style: 'solid',
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: '#d81e06',
                    width: 1,
                },
            };

            _self.sketchViewModel = new SketchViewModel({
                updateOnGraphicClick: false,
                view,
                layer: _self.graphicsLayer,
                polygonSymbol,
            });
        },
        handleMapToolsitemClick(e) {
            switch (e.target.id) {
                case 'navigation':
                    this.openNavigate();
                    break;
                case 'maptree':
                    this.openMapTree();
                    break;
                case 'clear':
                    break;
                default:
                    break;
            }
        },
        handleCommand(command) {
            switch (command) {
                case 'distance':
                    break;
                case 'area':
                    break;
                case 'spacequery':
                    this.initSpaceQuery();
                    break;
                case 'morescreen':
                    break;
                case 'swipanalyst':
                    break;
                default:
                    break;
            }
        },

        openNavigate() {
            const currentVisible = this.$store.getters._getDefaultNavigateVisible;
            this.$store.commit('_setDefaultNavigateVisible', !currentVisible);
        },
        openMapTree() {
            const currentVisible = this.$store.getters._getDefaultMapTreeVisible;
            this.$store.commit('_setDefaultMapTreeVisible', !currentVisible);
        },

        //1初始化空间查询
        async initSpaceQuery() {
            const _self = this;
            const [Graphic] = await loadModules(['esri/Graphic'], options);
            _self.sketchViewModel.create('polygon');

            _self.sketchViewModel.on('create-complete', function (event) {
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: _self.sketchViewModel.grahic.symbol,
                });
                _self.graphicsLayer.add(graphic);
            });
            _self.sketchViewModel.on('create', function (event) {
                if (event.state == 'complete') {
                    // console.log(graphicsLayer);
                    // console.log(event);
                    //2、执行空间查询
                    _self.handleSpaceQuery(event.graphic);
                }
            });
        },

        //2 空间查询
        handleSpaceQuery(graphic) {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            //图层判断
            const resultLayer = view.map.findLayerById('layerid');
            if (!resultLayer) {
                _self.$message({
                    message: '尚未添加业务图层，不能进行空间查询',
                    type: 'warning',
                });
                return;
            }

            //FeaturnLayer的空间查询
            const queryPoint = resultLayer.createQuery();
            queryPoint.geometry = graphic.geometry;
            resultLayer
                .queryFeatures(queryPoint)
                .then(function (results) {
                    let currentData = [];
                    if (results.features.length > 0) {
                        //符号化渲染图层
                        _self.renderResultLayer(results.features);
                        //实例化表格数据
                        results.features.map((item, index) => {
                            currentData.push({
                                name: item.attributes.name,
                                type: item.attributes.type,
                                tieluju: item.attributes.tieluju,
                                address: item.attributes.address,
                                lon: item.attributes.lon,
                                lat: item.attributes.lat,
                                key: index,
                            });
                        });
                    } else {
                        currentData.length = 0;
                    }
                    _self.$message({
                        message: `查询成功,共查到${results.features.length}条数据`,
                        type: 'success',
                    });
                    _self.$store.commit('_setDefaultQueryResult', currentData);
                    _self.$store.commit('_setDefaultQueryResultVisible', true);
                })
                .catch(function (error) {
                    console.log(error);
                    _self.$message.error('空间查询失败，请联系管理员');
                });
        },

        //3符号化渲染图层
        async renderResultLayer(resultFeatures) {
            const view = this.$store.getters._getDefaultView;
            const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], options);
            //移除已添加图层
            const resultLayer = view.map.findLayerById('initResultLayer');
            if (resultLayer) view.map.remove(resultLayer);

            const resultData = this._translateLonLat(resultFeatures);
            //实例化弹窗
            let template = {
                title: '{name}-{tieluju}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'name',
                                label: '名称',
                            },
                            {
                                fieldName: 'type',
                                label: '类型',
                            },
                            {
                                fieldName: 'tieluju',
                                label: '铁路局',
                            },
                            {
                                fieldName: 'address',
                                label: '地址',
                            },
                        ],
                    },
                ],
            };
            //实例化FeatureLayer
            const queryResultLayer = new FeatureLayer({
                source: resultData,
                id: 'initResultLayer',
                objectIdField: 'ObjectID',
                renderer: {
                    type: 'simple', // autocasts as new SimpleRenderer()
                    symbol: {
                        type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                        url: 'static/icon/train.png',
                        width: '32px',
                        height: '32px',
                    },
                },
                fields: [
                    {
                        name: 'OBJECTID',
                        type: 'oid',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'type',
                        type: 'string',
                    },
                    {
                        name: 'tieluju',
                        type: 'string',
                    },
                    {
                        name: 'address',
                        type: 'string',
                    },
                ],
                popupTemplate: template,
            });
            view.map.add(queryResultLayer);
        },

        //4处理经纬度数据，返回features
        _translateLonLat(data) {
            const _self = this;
            if (data.length > 0) {
                _self.geoData = [];
                data.map((value, key) => {
                    _self.geoData.push({
                        geometry: {
                            type: 'point',
                            x: Number(value.attributes.lon),
                            y: Number(value.attributes.lat),
                        },
                        attributes: {
                            ObjectID: key + 1,
                            name: value.attributes.name,
                            type: value.attributes.type,
                            tieluju: value.attributes.tieluju,
                            address: value.attributes.address,
                        },
                    });
                });
            }
            return _self.geoData;
        },
    },
};
</script>

<style >
.maptools-view {
    position: absolute;
    padding: 0 15px;
    height: 30px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: black;
    font-size: 15px;
    cursor: pointer;
}
.maptools-item:hover {
    color: #409eff;
}
.maptools-item:first-child {
    margin-left: 0;
}
</style>

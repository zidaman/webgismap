<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMapToolsitemClick" id="navigation">行政区导航</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="maptree">目录树管理</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="distance">距离测量</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="area">面积测量</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="clear">清除</span>
    </div>
</template>

<script>
export default {
    name: 'MapTools',
    methods: {
        handleMapToolsitemClick(e) {
            console.log(e.target.id);
            switch (e.target.id) {
                case 'navigation':
                    this.openNavigate();
                    break;
                case 'maptree':
                    this.openMapTree();
                    break;
                case 'distance':
                    break;
                case 'area':
                    break;
                case 'clear':
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
    cursor: pointer;
}
.maptools-item:first-child {
    margin-left: 0;
}
</style>

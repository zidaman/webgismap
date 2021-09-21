<template>
    <div id="app">
        <el-container class="app-out-panel">
            <el-header class="sys-header">
                <span>项目系统</span>
                <div class="user-info">
                    <i class="el-icon-user"></i>
                    <span>当前用户：</span>
                    <span @click="handleUserLogin">{{ username }}</span>
                </div>
            </el-header>

            <el-container class="app-content-panel">
                <el-aside class="sys-menu">
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @select="handleMenuSelect"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :collapse="true"
                    >
                        <el-menu-item index="1">
                            <i class="el-icon-monitor"></i>
                            <span slot="title">首页大屏</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-picture-outline"></i>
                            <span slot="title">一张图显示</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>

                <el-main class="sys-content">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

        <el-dialog title="用户登录/注册" :visible.sync="loginDialogVisible" width="30%">
            <div class="login-content">
                <el-input placeholder="请输入用户名" v-model="userNameInput" clearable> </el-input>
                <el-input placeholder="请输入密码" v-model="userPsdInput" show-password></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userLogin">登录</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'App',
    components: {},
    data() {
        return {
            username: '未登录',
            loginDialogVisible: false,
            userNameInput: '',
            userPsdInput: '',
        };
    },
    methods: {
        handleMenuSelect(index) {
            if (index == '1') {
                //跳转到首页大屏
                this.$router.push('/');
            } else if (index == '2') {
                //跳转到一张图显示
                this.$router.push('/onemap');
            }
        },
        //用户登录界面弹出
        handleUserLogin() {
            this.loginDialogVisible = true;
        },
        //用户登录
        userLogin() {
            const _self = this;
            const name = this.userNameInput;
            const psd = this.userPsdInput;
            // Optionally the request above could also be done as
            axios
                .get('http://localhost:3001/user/get', {
                    params: {
                        name,
                    },
                })
                .then(function (response) {
                    if (response.data.status === 'success') {
                        const password = response.data.data[0].password;
                        if (password === psd) {
                            _self.$message({
                                message: '恭喜你，登录成功',
                                type: 'success',
                            });
                            _self.loginDialogVisible = false;
                            _self.username = response.data.data[0].username;
                        } else {
                            _self.$message.error('登录失败，用户名或密码错误');
                        }
                    }
                })
                .catch(function (error) {
                    _self.loginDialogVisible = false;
                    console.log(error);
                });
        },
    },
};
</script>

<style>
html,
body,
#app {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}

.app-out-panel,
.app-content-panel {
    height: 100%;
}

.sys-header {
    background-color: #32373e;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
}
.sys-menu {
    background-color: #545c64;
    width: 64px !important;
    overflow: hidden !important;
}
.sys-content {
    padding: 5px !important;
}
/* .morescreen-view {
    width: 100%;
    height: 820px;
} */
.user-info {
    font-size: 15px;
}
.user-info > span:last-child:hover {
    color: #409eff;
    cursor: pointer;
}
.login-content {
}
</style>

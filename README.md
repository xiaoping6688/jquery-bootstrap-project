# gulp-project
>基于gulp自动构建项目配置

### 实现功能
- 环境输出（根据当前环境生产配置）
- 本地开发服务器（自动重载、代理转发）
- 同步浏览器（根据文件变动自动刷新浏览器）
- 文件合并、压缩、版本号、预编译等（js、css、image、scss等）
- 自动远程部署（目前仅用于测试服务器的单机部署，未来可考虑cdn网络部署等）

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm start

# build for production with minification
npm run build:test/simu/prod (测试／仿真／生产)

# deploy the dist files to remote host
npm run deploy
```

# nodejs_learn

1、json-server ，一个js编写的工具包，可快速搭建 restful API 服务（搭建临时服务）
npm i -g json-server
运行：json-server --watch db.json

2、express-generator  快速搭建 Express 应用程序
npm i -g express-generator
express -h 查看可执行的命令

创建应用：express -e myapp
或者使用 npx express-generator -e myapp (使用npx就是不用全局安装 express-generator 到本地)

1）打开项目，npm i 安装依赖
2）npm run start 执行脚本，启动项目
3）脚本默认是 node ./bin/www，修改时没有热更新，需要重新跑项目
	可以修改为  nodemon ./bin/www  （得安装 nodemon【npm i -g nodemon】）



使用nodejs + vue 实现一个学生表的增删查改

1、安装mongodb，mongod 命令启动本地数据库（mongod命令出错，需要安装mongosh）
	视频参考：
	https://www.bilibili.com/video/BV1gM411W7ex?p=132&vd_source=	144c0d29d9a0109476f0b2f21406c141
2、express-generator 搭建基本框架，新建 db/db.js 连接数据库
3、实现对应功能

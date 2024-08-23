# nodejs_learn

1、json-server ，一个js编写的工具包，可快速搭建 restful API 服务（搭建临时服务）
npm i -g json-server
运行：json-server --watch db.json

2、express-generator  快速搭建 Express 应用程序
npm i  express-generator -g

使用nodejs + vue 实现一个学生表的增删查改

1、安装mongodb，mongod 命令启动本地数据库（mongod命令出错，需要安装mongosh）
	视频参考：
	https://www.bilibili.com/video/BV1gM411W7ex?p=132&vd_source=	144c0d29d9a0109476f0b2f21406c141
2、express-generator 搭建基本框架，新建 db/db.js 连接数据库
3、实现对应功能
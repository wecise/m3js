# 小应用规范



## 客户端与服务端的剥离

### 数据服务接口与界面的剥离

WebServer只提供API，不提供界面，包括登录界面

##### 服务端API

21组

| **odb**        |      |
| -------------- | ---- |
| **appcontext** |      |
| **message**    |      |
| **http**       |      |
| **concurrent** |      |
| **tagdir**     |      |
| **dfs**        |      |
| **graphalg**   |      |
| **aialg**      |      |
| **forward**    |      |
| **webcontext** |      |
| **nlp**        |      |
| **perm**       |      |
| **job**        |      |
| **depot**      |      |
| **policy**     |      |
| **zabbix**     |      |
| **consolelog** |      |
| **rule**       |      |
| **etcd**       |      |
| **nats**       |      |

##### 客户端API

40组(其中3组已废弃)

| **[CONFIG]**            | **配置管理**                |
| ----------------------- | --------------------------- |
| **[OMDB]**              | **对象库类管理**            |
| **[MQL]**               | **MQL** **访问对象库**      |
| **[EXPORT]**            | **ODB** **数据导出**        |
| **[IMPORT] **           | **ODB 数据导入**            |
| **[IMPORTCLASS] **      | **ODB 创建类模板导入**      |
| **[SEARCH]**            | **一键搜索访问对象库**      |
| **[OMDB SYSTEM]**       | **对象库系统表查询**        |
| **[USER]**              | **用户管理**                |
| **[DFS]**               | **分布式文件系统**          |
| **[STATIC]**            | **分布式文件静态资源访问**  |
| **[JOB]**               | **调度器任务**              |
| ~~**[ENTITY]**~~        | ~~**实体** (已废弃)~~       |
| ~~**[ENTITY RULES]**~~  | ~~**实体规则**  (已废弃)~~  |
| ~~**[WEB CONTEXT]**~~   | ~~**缓存**  (已废弃)~~      |
| **[OMDB TRIGGER]**      | **对象库触发器管理**        |
| **[RULES]**             | **对象库规则管理**          |
| **[SCRIPT API]**        | **接口方法列表**            |
| **[DFS PARSING]**       | **文件系统文件解析**        |
| **[APPCONTEXT]**        | **全局变量缓存**            |
| **[GROK] **             | **Grok样例管理**            |
| **[JOB GROUP]**         | **调度器组管理**            |
| **[SCRIPT]**            | **脚本调用及管理**          |
| **[MULTI-TENANT]**      | **多租户管理**              |
| **[NOTIFICATIONS]**     | **订阅消息通知**            |
| **[LICENSE]**           | **系统许可管理**            |
| **[HOST]**              | **主机管理**                |
| **[DEPOT]**             | **监控脚本管理**            |
| **[DEPLOY]**            | **监控脚本部署管理**        |
| **[POLICY]**            | **监控策略管理**            |
| **[ZABBIX] **           | **ZABBIX 监控脚本部署管理** |
| **[TAGS]**              | **标签管理**                |
| **[BASELINE]**          | **基线管理**                |
| **[CLUSTER INFO]**      | **集群信息**                |
| **[EXTEND MANAGEMENT]** | **扩展表管理**              |
| **[API PERMS] **        | **API 权限**                |
| **[GROUP PERMS]**       | **组权限**                  |
| **[APP PERMS]**         | **应用权限**                |
| **[CONSOLELOG]**        | **脚本控制台日志**          |
| **[APP]**               | **小程序**                  |

### 服务端JS

/script/matrix/[appname]/\*.js

### 客户端页面

/app/matrix/[appname]/\*.\*

### 客户端访问URL

/static/app/matrix/[appname]/\*.\*


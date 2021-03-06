#### Jxstar 

##### 版本

jxstar_cloud_install_v2.2.8 

环境：

Java jdk 1.6+

Tomcat 6.0

Mysql 5+

#### Jxstar官网：

http://www.jxstar.com/

#### 方式一：按照官网下载按说明操作

##### 下载 jxstar_cloud_install_v2.2.8

> 将下载的jxstar_cloud_install_v2.2.8 解压含有以下所需文件：

1. jxstar.war
2. 说明.txt
3. jxstar_mysql_v2.2.8.sql（Mysql数据文件）
4. MySQL5.5.22数据安装说明.txt
5. 按说明操作即可，另外修改Tomcat的`server.xml`文件，在<GlobalNamingResources>标签中加入：

```
 <GlobalNamingResources>
    <!-- Editable user database that can also be used by
         UserDatabaseRealm to authenticate users
    -->
    <DataSource memo="mysql数据源示例">
			<sourcename memo="数据源名">default</sourcename>
			<schemaname memo="数据库名，构建数据表用">jxstar_cloud</schemaname>
			<driverclass memo="驱动类">org.gjt.mm.mysql.Driver</driverclass>
			<jdbcurl memo="访问URL">jdbc:mysql://localhost/jxstar_cloud?useUnicode=true&characterEncoding=UTF-8&useOldAliasMetadataBehavior=true&autoReconnect=true&useServerPrepStmts=true&prepStmtCacheSqlLimit=512</jdbcurl>
			<username memo="数据库用户">root</username>
			<password memo="数据库密码">jxstar_cloud</password>
			<maxconnum memo="最大连接数">50</maxconnum>
			<maxwaittime memo="最大等待时间,ms">5000</maxwaittime>
			<validtest memo="是否检查连接有效性:[true|false]">true</validtest>
			<validquery memo="检查连接有效性的SQL">select count(*) from fun_base</validquery>
			<valididle memo="是否启用检查空闲连接的线程:[true|false]">true</valididle>
			<datasourcetype memo="数据源来源:[self|context],前者表示采用自带数据源,后者表示采用服务器数据源">self</datasourcetype>
			<datasourceprefix memo="服务器数据源的JNDI名称,如: jdbc/default">jdbc/default</datasourceprefix>
			<dbmstype memo="数据库类型">mysql</dbmstype>
    </DataSource>
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml" />
  </GlobalNamingResources>
```

* 根据个人数据库账户密码信息修改 

#### 将web项目War包导入Eclipse并部署到Tomcat中见文章：

https://www.jianshu.com/p/46e7d6a5c213 

#### 方式二：

######  你可以直接下载我的源码，将项目源码导入Eclipse中，Mysql,Tomcat配置同上文件所述。
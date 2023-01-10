---
title: MyBatis 
date: 2023-01-02
sidebarDepth: 3
publish: true
tags:
 - MyBatis
 - 数据库
categories:
 - 混口饭吃
---


Mybatis的前身是iBATIS，是2001年发起的开源项目，在2004年作者将它捐给了Apache软件基金会，在接下来6年中，开源世界的基础、许可及数据库技术等都发生了很大变化，到2010年，核心开发团队离开了Apache软件基金会，将iBATIS改名为Mybatis。和其它的ORM框架不同，Mybatis并没有将Java对象与数据表绑定，而是将Java对象的方法和SQL语句关联，所以说如果是需要对SQL语句有完全控制的需求，Mybatis是一个不错的选择

### 1. Mybatis的基础使用
在使用之前，明确以下两点原则，有助于提纲挈领

1. 在Java中通用的与数据库打交道的相关事情，都需要遵守`JDBC`，Mybatis也不例外
2. Mybatis的整个故事都开始于`SqlSessionFactory`

最简单的使用Mybatis只需要以下几个步骤：

1. 创建一个DAO对象，确保有对应库表
2. 创建一个XML，里面写一个和DAO对象有关系的语句
3. 创建mybatis-config，通过该配置文件生成`SqlSessionFactory`
4. 用`SqlSessionFactory`打开session，并执行相关调用

下面进行实际操作
#### 1.1 创建Maven项目
创建Maven项目过程无需多言，主要是除了mybatis本身之外，还须引入`mysql-connector-java`和[[log4j]]相关的依赖。注意连接器版本需要和mysql版本一致，否则可能会报无法创建连接

```xml
  <dependencies>  
	<dependency>  
	    <groupId>junit</groupId>  
	    <artifactId>junit</artifactId>  
	    <version>4.13</version>  
	    <scope>test</scope>  
	</dependency>
    <dependency>  
        <groupId>org.mybatis</groupId>  
        <artifactId>mybatis</artifactId>  
        <version>3.4.0</version>  
    </dependency>  
    <dependency>  
        <groupId>mysql</groupId>  
        <artifactId>mysql-connector-java</artifactId>  
        <version>8.0.27</version>  
    </dependency>  
    <dependency>  
        <groupId>org.slf4j</groupId>  
        <artifactId>slf4j-api</artifactId>  
        <version>1.7.12</version>  
    </dependency>  
    <dependency>  
        <groupId>org.slf4j</groupId>  
        <artifactId>slf4j-log4j12</artifactId>  
        <version>1.7.5</version>  
    </dependency>  
    <dependency>  
        <groupId>log4j</groupId>  
        <artifactId>log4j</artifactId>  
        <version>1.2.17</version>  
    </dependency>
</dependencies>
```

#### 1.2 创建DAO和Mapper.xml

DAO对象我们只用了简单的country对象

```java
package com.mastermybatis.dao;  
  
public class Country {  
    private Long id;  
    private String countryName;  
    private String countryCode;  
    ...
}
```

mapper中我们只选了一个selectAll方法。

- 注意，resultType中能直接使用Country是因为在配置文件中配置了typeAliase。
- namespace定义了当前xml的命名空间，如果是有对应接口的话，mybatis就是通过namespace与mapper接口产生联系，但是此处我们并没有使用接口。
- id是用来表示该条语句的，后面我们也会通过此id来调用sql

```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE mapper  
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="com.mastermybatis.dao.Country">  

    <resultMap id="resultMap" type="Country">  
        <id property="id" column="id"></id>  
        <result property="countryName" column="country_name"/>  
        <result property="countryCode" column="country_code"/>  
    </resultMap>  
      
    <select id="selectAll" resultMap="resultMap">  
        select * from country  
    </select>  
</mapper>

```

```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE configuration  
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"  
        "https://mybatis.org/dtd/mybatis-3-config.dtd">  
<configuration>  
      
    <typeAliases>  
        <package name="com.mastermybatis.dao"/>  
    </typeAliases>  
      
    <environments default="development">  
        <environment id="development">  
            <transactionManager type="JDBC"/>  
            <dataSource type="POOLED">  
                <property name="driver" value="com.mysql.jdbc.Driver"/>  
                <property name="url" value="jdbc:mysql://localhost:3306/test"/>  
                <property name="username" value="root"/>  
                <property name="password" value="12345678"/>  
            </dataSource>  
        </environment>  
    </environments>  
  
    <mappers>  
        <mapper resource="mapper/CountryMapper.xml"/>  
    </mappers>  
</configuration>
```
#### 1.4 测试方法
下面来调用一下`selectAll`方法
```java
public class Test {  
    private static SqlSessionFactory sqlSessionFactory;  
  
    @Before  
    public  void init(){  
        try {  
            Reader reader = Resources.getResourceAsReader("mybatis-config.xml");  
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);  
            reader.close();  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
  
    @Test  
    public void testSelectAll(){  
        SqlSession sqlSession = sqlSessionFactory.openSession();  
        try {  
            List<Country> countryList = sqlSession.selectList("selectAll");  
            System.out.println(countryList);  
        }finally {  
            sqlSession.close();  
        }  
    }  
}
```

### 2. Mybatis配置

#### 2.1 属性（properties）
就是正常的properties，可以在别的配置文件中写，也可以在mybatis的配置文件中写，写完之后可以在mybatis配置文件中的其它地方引用
```xml
<properties resource="org/mybatis/example/config.properties">
  <property name="username" value="dev_user"/>
  <property name="password" value="F2Fa3!33TYyg"/>
</properties>


<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>
```

另一种方式是在`SqlSessionFactoryBuilder.build()`中作为方法参数传递
```java
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, props);

// ... 或者 ...

SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment, props);
```

**如果在多个地方有重复配置，则加载顺序为：**

1. 先读取properties中设置的值
2. 根据properties中的resource指定的位置读取，遇到重复的就覆盖
3. 最后读取作为方法传递的值，遇到重复的就覆盖（最高优先级）

**默认值的配置：**<br />从mybatis3.4.2开始，你可以指定一个默认值，但是首先要开启默认值功能，该功能默认是关闭的
```xml
<properties resource="org/mybatis/example/config.properties">
  <!-- ... -->
  <!-- 启用默认值特性 -->
  <property name="org.apache.ibatis.parsing.PropertyParser.enable-default-value" value="true"/> 
</properties>

<dataSource type="POOLED">
  <!-- ... -->
  <!-- 如果属性 'username' 没有被配置，'username' 属性的值将为 'ut_user' -->
  <property name="username" value="${username:ut_user}"/> 
</dataSource>
```
[<br />](https://www.yuque.com/rray/qihlye/im42roayn016k1ga)
:::warning
有时候冒号分隔符可能会有其它的含义，比如在SQL中使用了[OGNL表达式](https://www.yuque.com/rray/qihlye/im42roayn016k1ga)的三目表达式，此时如果你还想继续使用默认值功能，就需要重新定义一下默认值的分割符，例如将其改为“?:”
:::
```xml
<properties resource="org/mybatis/example/config.properties">
  <!-- ... -->
  <!-- 修改默认值的分隔符 -->
  <property name="org.apache.ibatis.parsing.PropertyParser.default-value-separator" value="?:"/>
</properties>

<dataSource type="POOLED">
  <!-- ... -->
  <property name="username" value="${db:username?:ut_user}"/>
</dataSource>
```

#### 2.2 设置（settings）


#### 2.3 类型别名（typeAliases）
给Java的类型取一个别名，只用于XML文件中，意图是避免写全类名的麻烦。三种方式：

1. 在配置文件中单个类配置
2. 在配置文件中包配置
3. 用注解在类上配置

```xml
<typeAliases>
  <typeAlias alias="Author" type="domain.blog.Author"/>
  <typeAlias alias="Blog" type="domain.blog.Blog"/>
  <typeAlias alias="Comment" type="domain.blog.Comment"/>
  <typeAlias alias="Post" type="domain.blog.Post"/>
  <typeAlias alias="Section" type="domain.blog.Section"/>
  <typeAlias alias="Tag" type="domain.blog.Tag"/>
</typeAliases>
```
```xml
<typeAliases>
  <package name="domain.blog"/>
</typeAliases>
```
```java
//如果没有注解值，则默认取类名首字母小写
@Alias("author")
public class Author {
    ...
}
```

另外，还有一些内置好的类型别名，其中有些采用了特殊的命名方式，为的是避免与原始类型命名冲突

| 别名 | 映射的类型 |
| --- | --- |
| _byte | byte |
| _char (since 3.5.10) | char |
| _character (since 3.5.10) | char |
| _long | long |
| _short | short |
| _int | int |
| _integer | int |
| _double | double |
| _float | float |
| _boolean | boolean |
| string | String |
| byte | Byte |
| char (since 3.5.10) | Character |
| character (since 3.5.10) | Character |
| long | Long |
| short | Short |
| int | Integer |
| integer | Integer |
| double | Double |
| float | Float |
| boolean | Boolean |
| date | Date |
| decimal | BigDecimal |
| bigdecimal | BigDecimal |
| biginteger | BigInteger |
| object | Object |
| date[] | Date[] |
| decimal[] | BigDecimal[] |
| bigdecimal[] | BigDecimal[] |
| biginteger[] | BigInteger[] |
| object[] | Object[] |
| map | Map |
| hashmap | HashMap |
| list | List |
| arraylist | ArrayList |
| collection | Collection |
| iterator | Iterator |


#### 2.4 类型处理器（typeHandlers）
JDBC类型可以看：org.apache.ibatis.type.JdbcType

| **类型处理器** | **Java类型** | **JDBC类型** |
| --- | --- | --- |
| BooleanTypeHandler | java.lang.Boolean, boolean | 数据库兼容的 BOOLEAN |
| ByteTypeHandler | java.lang.Byte, byte | 数据库兼容的 NUMERIC 或 BYTE |
| ShortTypeHandler | java.lang.Short, short | 数据库兼容的 NUMERIC 或 SMALLINT |
| IntegerTypeHandler | java.lang.Integer, int | 数据库兼容的 NUMERIC 或 INTEGER |
| LongTypeHandler | java.lang.Long, long | 数据库兼容的 NUMERIC 或 BIGINT |
| FloatTypeHandler | java.lang.Float, float | 数据库兼容的 NUMERIC 或 FLOAT |
| DoubleTypeHandler | java.lang.Double, double | 数据库兼容的 NUMERIC 或 DOUBLE |
| BigDecimalTypeHandler | java.math.BigDecimal | 数据库兼容的 NUMERIC 或 DECIMAL |
| StringTypeHandler | java.lang.String | CHAR, VARCHAR |
| ClobReaderTypeHandler | java.io.Reader | - |
| ClobTypeHandler | java.lang.String | CLOB, LONGVARCHAR |
| NStringTypeHandler | java.lang.String | NVARCHAR, NCHAR |
| NClobTypeHandler | java.lang.String | NCLOB |
| BlobInputStreamTypeHandler | java.io.InputStream | - |
| ByteArrayTypeHandler | byte[] | 数据库兼容的字节流类型 |
| BlobTypeHandler | byte[] | BLOB, LONGVARBINARY |
| DateTypeHandler | java.util.Date | TIMESTAMP |
| DateOnlyTypeHandler | java.util.Date | DATE |
| TimeOnlyTypeHandler | java.util.Date | TIME |
| SqlTimestampTypeHandler | java.sql.Timestamp | TIMESTAMP |
| SqlDateTypeHandler | java.sql.Date | DATE |
| SqlTimeTypeHandler | java.sql.Time | TIME |
| ObjectTypeHandler | Any | OTHER 或未指定类型 |
| EnumTypeHandler | Enumeration Type | VARCHAR 或任何兼容的字符串类型，用来存储枚举的名称（而不是索引序数值） |
| EnumOrdinalTypeHandler | Enumeration Type | 任何兼容的 NUMERIC 或 DOUBLE 类型，用来存储枚举的序数值（而不是名称）。 |
| SqlxmlTypeHandler | java.lang.String | SQLXML |
| InstantTypeHandler | java.time.Instant | TIMESTAMP |
| LocalDateTimeTypeHandler | java.time.LocalDateTime | TIMESTAMP |
| LocalDateTypeHandler | java.time.LocalDate | DATE |
| LocalTimeTypeHandler | java.time.LocalTime | TIME |
| OffsetDateTimeTypeHandler | java.time.OffsetDateTime | TIMESTAMP |
| OffsetTimeTypeHandler | java.time.OffsetTime | TIME |
| ZonedDateTimeTypeHandler | java.time.ZonedDateTime | TIMESTAMP |
| YearTypeHandler | java.time.Year | INTEGER |
| MonthTypeHandler | java.time.Month | INTEGER |
| YearMonthTypeHandler | java.time.YearMonth | VARCHAR 或 LONGVARCHAR |
| JapaneseDateTypeHandler | java.time.chrono.JapaneseDate | DATE |


**自定义类型处理器**<br />如果你想自定义类型处理器来处理一些非标准类型，或者覆盖一些实现，按以下步骤执行

1. 写一个类型处理器，实现`org.apache.ibatis.type.TypeHandler`接口或者继承`org.apache.ibatis.type.BaseTypeHandler`类
2. 在mybatis配置文件中配置你自定义的处理类

下面自定义一个varchar和String类型的处理器
```java
@MappedJdbcTypes(JdbcType.VARCHAR)
public class TestHandler extends BaseTypeHandler<String> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter);
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return "hello world";
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return "hello world";
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return "hello world";
    }
}
```
配置自定义处理器
```xml
<typeHandlers>
  <typeHandler handler="tk.mybatis.simple.typehandler.TestHandler"/>
</typeHandlers>
```
之后查到的String类型的值都是“hello world”了<br />`Country{id=1, countryName='hello world', countryCode='CN'}`

有几点需要注意：

- Mybatis不会通过查询数据库元数据来判断类型，你需要在参数和结果字段中（resultmap）指明varchar以便于mybatis能完成绑定，这是因为mybatis是在运行时才能明确数据类型
- 对于java类型，Mybatis可以获取到，但是你可以指定参数来覆盖，在类型处理器配置中加javatype，或者在类型处理器上加注解MappedTypes，二者都有的话，配置文件的优先级高。如果配置的类型和实际处理的类型不一致会报错的（比如把Integer赋值给String）
- 对于JDBC类型，也是有两种方式，和上面类似，jdbctype和MappedJdbcTypes注解，也是配置文件优先级高。
   - 当resultmap中没有指定jdbc类型的时候，mybatis用javatype=[javatype] jdbctype=null来匹配处理器，你可以在MapperJdbcTypes注解里增加includeNullJdbcType=true，这样就可以匹配到
   - 从3.4.0开始，如果一个java类型只有一个处理器，那null也会默认给这个处理器处理
   - 如果多个处理器匹配到，后面的那个会执行（比如按config中的配置顺序）

**处理枚举类**
:::danger
TODO
:::

#### 2.5 对象工厂（objectFactory）
Mybatis在返回结果时会创建一个结果对象，默认是调用无参构造器或者根据参数选择对应的构造器，你可以覆盖这个工厂方法，通过继承`DefaultObjectFactory`这个类，之后在配置文件中增加相应的配置<br /> 
#### 2.6 插件（plugins）
Mybatis允许你在映射语句执行的某个节点进行拦截调用，默认情况下，这些拦截点包括：

- Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
- ParameterHandler (getParameterObject, setParameters)
- ResultSetHandler (handleResultSets, handleOutputParameters)
- StatementHandler (prepare, parameterize, batch, update, query)

使用时只需要实现Interceptor接口并指定相应的参数即可，下面是官方文档提供的样例
```java
/ ExamplePlugin.java
@Intercepts({@Signature(
    type= Executor.class,
    method = "update",
    args = {MappedStatement.class,Object.class})})
public class ExamplePlugin implements Interceptor {
    private Properties properties = new Properties();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // implement pre processing if need
        Object returnObject = invocation.proceed();
        // implement post processing if need
        return returnObject;
    }

    @Override
    public void setProperties(Properties properties) {
        this.properties = properties;
    }
}
```

:::danger
如果你要做的是除监控外的其余事情，请确保你知道你在做什么，因为这样做很可能会影响到Mybatis的核心模块功能
:::

#### 2.7 环境配置（environments）
配置多个环境可以用于test、st、prod等环境的隔离，但是每个SqlSessionFactory只能选一个环境，你想链接俩数据，就创建俩SqlSessionFactory
```xml
<environments default="development">
  <environment id="development">
    <transactionManager type="JDBC">
      <property name="..." value="..."/>
    </transactionManager>
    <dataSource type="POOLED">
      <property name="driver" value="${driver}"/>
      <property name="url" value="${url}"/>
      <property name="username" value="${username}"/>
      <property name="password" value="${password}"/>
    </dataSource>
  </environment>
</environments>
```

**事务管理器**<br />Mybatis中支持两种事务管理器：JDBC | MANAGED

- JDBC：直接使用了JDBC的提交和回滚功能，默认每次关闭连接时自动提交，从3.5.10开始，可通过skipSetAutoCommitOnClose设置为true关闭
- MANAGED：不会提交或回滚，而是让容器管理事务生命周期，默认情况下它会关闭链接，可通过closeConnection=false来阻止
:::success
如果你使用Spring+Maybatis，那无需配置事务管理器，因为Spring会用自带的事务管理器来覆盖前面的
:::

这两个值其实是别名，你可以实现自己的事务管理器，然后其全类名或者别名代替这两个值。想要实现事务管理器，实现TransactionFactory接口，在创建一个Transaction的实现类<br />可查看`org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory`
```java
public interface TransactionFactory {
    default void setProperties(Properties props) { // 从 3.5.2 开始，该方法为默认方法
        // 空实现
    }
    Transaction newTransaction(Connection conn);
    Transaction newTransaction(DataSource dataSource, TransactionIsolationLevel level, boolean autoCommit);
}

public interface Transaction {
    Connection getConnection() throws SQLException;
    void commit() throws SQLException;
    void rollback() throws SQLException;
    void close() throws SQLException;
    Integer getTimeout() throws SQLException;
}
```

**数据源**<br />去看通过Spring方式配置的吧
#### 2.8 数据库厂商标识（databaseIdProvier）

#### 2.9 映射器（mappers）
映射器的目的是告诉Mybatis去哪里找SQL语句
```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>

<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>

<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>

<!-- 将包内的映射器接口全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```

### 3. 映射器与动态SQL配置

当不使用接口方式的时候，mapper的namespace取一个不重复的值就行，当使用接口方式的时候，namespace需要和接口联系。
#### 3.1 resultMap
| **分类** | **字段** | **描述** |  |
| --- | --- | --- | --- |
| <br /><br /><br />属性 | id | 必填，唯一 |  |
|  | type | 必填，映射的java类型 |  |
|  | extends | 选填，继承的resultMap的id |  |
|  | autoMapping | 选填，ture or false，是否启用非映射字段（没有在resultMap中配置的）的自动映射功能。可覆盖全局的autoMappingBehavior |  |
| <br /><br /><br /><br /><br />标签 | constructor | 配置使用构造方法注入结果，包含两个子标签<br />- idArg：id参数，标记结果作为id（唯一），帮助提高性能<br />- arg：注入到构造方法的一个普通结果<br /> |  |
|  | id |  | id和result基本一样，只是id代表主键。它们的值通过setter方法注入。其标签：<br />- column：数据库列名或者列别名<br />- property：结果属性，可以是username这种简单的，也可以是嵌套的如user.name（看似要和java对象字段名完全相同，单实际上不区分大小写，MyBatis是全转大写再比较的）<br />- javaType：类的完全限定名或者别名，映射到javaBean的时候一般可以自动识别，映射到map的时候需要指定<br />- jdbcType：列对应的数据库类型，仅需要对插入、删除、更新可能为空的列做处理，这是jdbc的需要，不是mybatis的需要<br />- typeHandler：用于覆盖默认类型处理器，可用完全限定名或别名<br /> |
|  | result | 注入到java对象的普通结果 |  |
|  | association | 一个复杂的类型关联，许多结果将包成这种类型 |  |
|  | collection | 复杂类型的集合 |  |
|  | discriminator | 根据结果值来决定使用哪个结果映射 |  |
|  | case | 基于某些结果值的映射 |  |


#### 3.2 select

- 使用resultType的时候，sql语句中要把列名转成java对象字段名，或者开启mapUnderscoreToCamelCase配置，改配置默认false的。
- resultType和resultMap只能选一个
- 返回多个时，返回值可以是列表或者数组（一般用列表）

#### 3.3 insert
| **属性** | **含义** |
| --- | --- |
| id |  |
| parameterType | 入参类型。可以自动推断，建议不填 |
| flushCache | 默认为true，调用时清空一级缓存和二级缓存 |
| timeout |  |
| statementType | STATEMENT &#124; PREPARED &#124; CALLABLE，默认PREPARED |
| useGenaratedKeys | 默认false，是否调用getGeneratedKeys方法来获取数据生成的主键 |
| keyProperty | getGeneratedKeys生成的主键赋值给谁 |
| keyColumn |  |
| databaseId |  |

:::success
对于一些特殊的类型，建议指定具体的jdbcType，例如 img指定BLOB类型<br />data、time、datetime对应的jdbcType分别是DATA、TIME、TIMESTAMP
:::

> 获取数据库主键的方式



#### 3.4 if
```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE
  <if test="state != null">
    state = #{state}
  </if>
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```
注意几点：

- 如果title是基本数据类型（有默认值），那title!=null会永远为true
- 只用if可能造成语法错误（当state==null时，where开头有个and），一般配合where或者trim等使用
- test支持OGNL表达式
#### 3.5 trim、where、set
现在用解决上面if中提到的那个语法错误的问题
```xml
<select id="findActiveBlogLike" resultType="Blog">
  SELECT * FROM BLOG
  <trim prefix="WHERE" prefixOverrides="AND |OR ">
    <if test="state != null">
      AND state = #{state}
    </if>
    <if test="title != null">
      AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
      AND author_name like #{author.name}
    </if>
	</trim>
</select>
```
四个属性：

- prefix：前缀
- prefixOverrides：需要干掉的开头
- suffix：后缀
- suffixOverrides：需要干掉的结尾

where和set都是trim的某种表现形式，算是快捷使用方式
```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>


<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>
```
```xml
<update id="updateAuthorIfNecessary">
  update Author
    <set>
      <if test="username != null">username=#{username},</if>
      <if test="password != null">password=#{password},</if>
      <if test="email != null">email=#{email},</if>
      <if test="bio != null">bio=#{bio}</if>
    </set>
  where id=#{id}
</update>
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```
#### 3.6 choose、when、otherwise
类似java的switch
```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```
#### 3.7 foreach
```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  <where>
    <foreach item="item" index="index" collection="list"
        open="ID in (" separator="," close=")" nullable="true">
          #{item}
    </foreach>
  </where>
</select>
```
当集合是列表和数组等可迭代对象时，index是序号，item是值，当是map的时候，index是key，item是value
#### 3.8 bind
```xml
<select id="selectBlogsLike" resultType="Blog">
  <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />
  SELECT * FROM BLOG
  WHERE title LIKE #{pattern}
</select>
```
### 4. Mybatis与Spring配合
Spring是支持iBATIS的，在Mybatis时期，Spring3.0本打算继续整合Mybatis，但是那时候Mybatis3.0还不是稳定版，所以Spring3.0最终没有整合Mybatis3, 后来Mybatis社区的人搞了一个项目来整合Spring和Mybatis，这就是Mybatis-Spring项目，地址如下:

与Spring整合后，使用方式发生的变化：

1. 需要引入mybatis-spring的依赖包
2. SqlSessionFactory以SqlSessionFactoryBean的形式注入，且将原来的config内容拆成几部分分别配置到bean中
3. 使用Mapper扫描的方式注入Mapper的bean，不在是通过Session获取
### 5. Mybatis与SpringBoot配合


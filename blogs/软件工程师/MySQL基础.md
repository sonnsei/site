---
title: MySQL基础 
date: 2022-12-29
sidebarDepth: 3
tags:
 - MySQL
categories:
 - 软件工程师
---

## 1. 数据库操作
数据库操作主要包括查看数据库、创建数据库以及删除数据库
```sql
#查看数据库
SHOW DATABASES;

#创建数据库
CREATE DATABASE database_name;

#删除数据库
DROP DATABASE  database_name;
```
## 2. 数据表操作
### 2.1 创建数据表
数据表属于数据库，在创建数据表前，应先使用`USE <数据库名>`来选择数据库。创建数据表的语法规则为：
```sql
CREATE TABLE <表名>
(
  字段1 数据类型 [列级别约束条件] [默认值],
  字段2 数据类型 [列级别约束条件] [默认值],
  字段3 数据类型 [列级别约束条件] [默认值],
  ...
)
```

#### 2.1.1 主键约束
主键要求非空、唯一，可分为单字段主键和多字段联合主键，可在定义列的同时指定主键，也可以在定义完所有列之后再定义主键，其语法规则为：
```sql
#在定义列的同时指定主键
字段名 数据类型 PRIMARY KEY [默认值]
#在定义完所有列之后再定义主键，可以定义多字段联合主键
[CONSTRAINT <约束名>] PRIMARY KEY [字段1,字段2,...,字段n]
```

示例：
```sql
#在定义列的同时指定主键
CREATE TABLE test
(
  id INT(11) PRIMARY KEY,
  name VARCHAR(25)
)

#在定义完所有列之后再定义主键，可以定义多字段联合主键
CREATE TABLE test
(
  id INT(11),
  name VARCHAR(25),
  CONSTRAINT 主键名一般不用 PRIMARY KAY(id,name)
)
```

#### 2.1.2 外键约束
外键表示的是两个表之间的数据链接，可以是一列或者多列，一个表可以有一个或多个外键。外键可以为空值，但如果不为空时，其值必须等于另一个表中主键的某个值。外键的主要作用是保证引用数据的一致性、完整性，定义外键后，不允许另一个表中中具有关联关系的行。创建外键的语法为：
```sql
[CONSTRAINT <外键名>] FOREIGN KEY 字段1[,字段2,...] 
REFERENCES <主表名> 主键列1[,主键列2,...]
```
注意区分主表和从表，主表指的是用主键参与这个约束的那张表。删除数据时需要先删子表数据再删主表数据。

示例：员工表中部门id字段关联到部门表的主键id
```sql
CREATE TABLE tb_emp
(
  id INT(11) PRIMARY KEY,
  name VARCHAR(25),
  deptId INT(11),
  CONSTRAINT fk_emp_dept FOREIGN KEY(deptId) REFERENCE tb_dept(id)
)
```
#### 2.1.3 非空约束
非空约束指的是字段值不能为空，对于非空字段，添加数据时如果没有指定值则会报错，其语法规则为：
```sql
字段名 数据类型 NOT NULL
```
示例：指定员工名称不能为空
```sql
CREATE TABLE tb_emp
(
  id INT(11) PRIMARY KEY,
  name VARCHAR(25) NOT NULL
);
```
#### 2.1.4 唯一约束
唯一约束标识该列的值在表中唯一，可以为空但只能有一条记录的值为空，其语法规则为：
```sql
#定义完列之后直接指定唯一约束
字段名 数据类型 UNIQUE

#定义完所有列之后再指定唯一约束
[CONSTRAINT <约束名>] UNIQUE(<字段名>)
```

示例：给部门表的name和age字段添加唯一约束
```sql
CREATE TABLE tb_dept
(
  id INT(11) PRIMARY KEY,
  name VARCHAR(50),
  age INT(3),
  CONSTRAINT STH UNIQUE(name,age)
)
```

#### 2.1.5 默认约束
默认约束是在没有给某个字段赋值（区别于赋null值）的时候，系统自动补充默认值，其语法是：
```sql
字段名 数据类型 DEFAULT 默认值
```
示例：部门id默认用111
```sql
CREATE TABLE tb_emp
(
  id INT(11) PRIMARY KEY,
  depId INT(11) DEFAULT 111
);
```
注意，`not null`是检查字段是否为`null`，而`default`是在没有给字段显示赋值的时候填充默认值，这两个并不冲突。约束条件不只是在字段插入的时候生效，在数据修改的时候也会进行校验。
#### 2.1.6 属性值自增
一个表只能有一个自增的字段，该字段必须是主键的一部分，字段类型可以是任意整数类型（TINYINT\SMALLINT\INT\BIGINT），其语法是：
```sql
字段名 数据类型 AUTO_INCREMENT
```
示例：常用的id自增
```sql
CREATE TABLE tb_emp
(
  id INT(11) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(25) NOT NULL,
  salary FLOAT
)
```

之后执行插入语句：<br />注意下面这个不是SQL的标准语法，MySQL之外的数据库不一定支持。
```sql
INSERT INTO tb_emp(name, salary) VALUES('Lucy',1000),('Lura',1200);
```

### 2.2 查看数据表结构
可以查看数据表的基本信息和详细信息，示例如下：
```sql
DESCRIBE 表名; #查看表的字段信息
DESC 表名; #describe的简写
SHOW CREATE TABLE <表名\G>; #查看创建表的语句，后面的\G是为了让输出更易读
```

### 2.3 修改数据表
#### 2.3.1 修改表名
```sql
#语法规则如下，其中TO可以不用，不影响结果
ALTER TABLE <旧表名> RENAME [TO] <新表名>

#示例：
ALTER TABLE tb_old_name RENAME TO tb_new_name;
```
#### 2.3.2 修改字段数据类型
```sql
#语法规则
ALTER TABLE <表名> MODIFY [COLUMN] <字段名> <数据类型> [新默认值] [新注释]

#示例
ALTER TABLE table1 MODIFY column1 VARCHAR(11);
ALTER TABLE table1 MODIFY  COLUMN column1  DECIMAL(10,1) DEFAULT NULL COMMENT '注释';

```
数据库中已有数据时，勿要修改数据类型，除非你很明确知道你在做什么
#### 2.3.3 修改字段名
```sql
#语法规则，新数据类型填和原来的一样，但是必须要有
ALTER TABLE <表名> CHANGE <旧字段名> <新字段名> <新数据类型>

#示例
ALTER TABLE tb_name CHANGE old_col_name new_col_name INT(11);
```
也可以使用`CHANGE`只修改数据类型来完成和`MODIFY`一样的效果。<br />数据库中已有数据时，勿要修改数据类型，除非你很明确知道你在做什么
#### 2.3.4 添加字段
添加新字段时，可以添加相应的约束，以及在一定程度上指定其顺序
```sql
#语法规则
ALTER TABLE <表名> ADD <新字段名> <新字段类型> [约束条件] [FIRST|AFTER 已存在字段名]

#示例
ALTER TABLE tb ADD new_col INT(11) FIRST;
ALTER TABLE tb ADD new_col INT(11) AFTER exist_col;
```

#### 2.3.5 删除字段
```sql
#语法规则
ALTER TABLE <表名> DROP <字段名>

#示例,删除表中name字段
ALTER TABLE tb DROP name;
```
#### 2.3.6 修改字段的排列位置
同样还是使用`MODIFY`
```sql
#语法
ALTER TABLE <表名> MODIFY <字段1> <数据类型> FIRST|AFTER<字段2>

#示例：把age放到name后面
ALTER TABLE tb MODIFY age TINYINT AFTER name;
```
#### 2.3.7 更改表的存储引擎
可以使用`SHOW ENGINES`查看支持的引擎
```sql
ALTER TABLE <表名> ENGINE=<更改后的存储引擎名>
```
#### 2.3.8 删除表的外键约束
```sql
ALTER TABLE <表名> DROP FOREIGN KEY <外键约束名>
```
### 2.4 删除数据表
使用`DROP TABLE`可以一次删除一个或多个没有被其它表关联的表
```sql
DROP TABLE [IF EXISTS] 表1,表2,...,表n
```
当不使用`IF EXISTS`时，遇到不存在的表会报错，使用之后则会继续执行，但是依然会有`warn`提示。<br />如果表被其它的表关联了，那么就需要先删除子表或者删除关联。
### 2.5 8.0新特性

## 3. 数据类型
### 3.1 整数类型
| **类型名称** | **说明** | **存储需求（字节）** | **默认显示宽度（位）** |
| --- | --- | --- | --- |
| **TINYINT** | 很小的整数 | 1 | 4 |
| **SMALLINT** | 小的整数 | 2 | 6 |
| **MEDIUMINT** | 中等大小的整数 | 3 | 9 |
| **INT（INTEGER）** | 普通大小的整数 | 4 | 11 |
| **BIGINT** | 大整数 | 8 | 20 |


**显示宽度**：<br />比如在语句`id INT(11)`，INT的存储需求是已经确定4字节的，这里的11是一个展示宽度的概念，表示查询结果会以11位宽度展示，当结果不足11位时，左边默认以空格填充，而当有`ZEROFILL`属性时则会用0填充。当建表时不指定显示宽度的时候，数据库默认会给整型增加上一个显示宽度，其值为范围内位数最大值（可以用desc语句查看）。

个人理解，显示宽度主要是为了让输出格式化，但是目前我们一般不会在控制台直接查询数据了，都是通过一些工具访问数据库，所以这个属性可有可无。

### 3.2 浮点数类型和定点数类型

### 3.3 日期与时间类型
| **类型名称** | **日期格式** | **日期范围** | **存储需求(字节)** |
| --- | --- | --- | --- |
| **YEAR** | YYYY | 1901~2155 | 1 |
| **TIME** | HH:MM:SS | -838:59:59~838:59:59 | 3 |
| **DATE** | YYYY-MM-DD | 1000-01-01~9999-12-3 | 3 |
| **DATETIME** | YYYY-MM-DD HH:MM:SS | 1000-01-01 00:00:00<br />~9999-12-31 23:59:59 | 8 |
| **TIMESTAMP** | YYYY-MM-DD HH:MM:SS | 1970-01-01 00:00:01 UTC<br />~2038-01-19 03:14:07 UTC | 4 |

#### 3.3.1 YEAR：

- 使用4位字符串或者数字的时候都能插入，当数值不在有效范围内的时候会报错无法插入
- 使用2位字符串的时候，有效范围是“00”-“99”，其中“00”-“69”会被映射到2000-2069，“70”-“99”会被映射到1970-1999，“0”和“00”相同
- 使用2位数字的时候，有效范围是1-99，其中1-69被映射到2001-2069,70-99被映射到1070-1999，**而0会被映射成0000，而不是2000**

结论：直接使用4位数字或字符串就行了

#### 3.3.2 TIME
Time不仅可以用于表示当天的时间，还用于表示两个时间之间的间隔，所有数值才会这么大。<br />Time可以接受以下格式的值：

- “D HH:MM:SS”格式的字符串。可以接受以下几种非严格的格式：“HH:MM:SS”、“HH:MM”、“SS”、“D HH:MM”或“D HH”，这里的D代表的是日，可以取0-34之间的值，在插入会转化成小时加到HH上
- HHMMSS格式的没有间隔符的字符串或者数字，如“101112”被理解为“10:11:12”，但需要是合法的时间，对于不合法的时间比如“109712”在存储时则会变成“00:00:00”

注意，当你给出一个没有冒号或者空格的数字或字符串时，MySQL会把最右边理解成为秒，比如“1112”会被理解成“00:11:12”，如果加上冒号“11:12”则符合“HH:MM”后会被理解成“11:12:00”。

#### 3.3.3 DATE
Date类型用于只需要日期部分，不需要时间部分，日期格式为“YYYY-MM-DD”，可以接受以下方式的输入

- 以“YYYY-MM-DD”或者“YYYYMMDD”字符串格式表示的日期。标准格式，正常解析。
- 以“YY-MM-DD”或者“YYMMDD”字符串格式表示的日期。两位的年份按以下方式解析：00-69解释为2000-2069,而70-99解释为1970-1999.
- 以YY-MM-DD或者YYMMDD数字格式表示的日期，与类似的字符串格式的解析方式相同。
- 使用`CURRENT_DATE()`或者`NOW()`函数插入系统当前时间。NOW()返回的是带时间的，插入时时间会被忽略。

MySQL允许不严格的语法，任意标点符号都可以用于分割日期和时间，比如“98-11-31 11:30:45”、“98.11.31 1-30-45”都可以被正确插入到数据库
#### 3.3.4 DATETIME
用于同时包含日期和时间的值，日期格式为“YYYY-MM-DD HH:MM:SS”，输入方式可以为：

- “YYYY-MM-DD HH:MM:SS”或者“YYYYMMDDHHMMSS”格式的字符串表示的值。标准格式标准解析
- “YY-MM-DD HH:MM:SS”或者“YYMMDDHHMMSS”格式的字符串表示的值，两位的年份按以下方式解析：00-69解释为2000-2069,而70-99解释为1970-1999。
- YYYYMMDDHHMMSS或者YYMMDDHHMMSS格式数字，前者标准解析，后者注意年份

MySQL允许不严格的语法，任意标点符号都可以用于分割日期和时间，比如“98-11-31 11:30:45”、“98.11.31 1-30-45”都可以被正确插入到数据库
#### 3.3.5 TIMESTAMP
Timestamp的显示格式和Datetime一样，都是固定19个字符宽度，不过timestamp表示的范围比datetime要小。其输入与datetime一样，但是需要保证时间在允许范围内。

TIMESTAMP和DATETIME除了支持范围和存储字节不同外，有一个最大的区别是：DATETIME在存储时，直接按输入的内容存储，即你输入的是什么时间，它存储的就是什么时间，而TIMESTAMP存储的是UTC格式，即你存储的时候会按照时区进行转换，你读取的时候也会按照时区进行转化，不同时区读取到的值是不同的。
### 3.4 文本字符串类型

| **类型名称** | **说明** | **存储需求** |
| --- | --- | --- |
| CHAR(M) | 固定长度非二进制字符串 | M字节，1<=M<=255 |
| VARCHAR(M) | 变长非二进制字符串 | L+1字节，其中L<=M和1<=M<=255 |
| TINYTEXT | 非常小的非二进制字符串 | L+1字节，其中L<2^8 |
| TEXT | 小的非二进制字符串 | L+2字节，其中L<2^16 |
| MEDIUMTEXT | 中等大小的非二进制字符串 | L+3字节，其中L<2^24 |
| LONGTEXT | 大的非二进制字符串 | L+4字节，其中L<2^32 |
| ENUM | 枚举类型，只能有一个枚举字符串值 | 1或2字节，取决于枚举值的数目（最大值65535） |
| SET | 字符串对象可以有零个或多个SET成员 | 1、2、3、4或8字节，取决于集合成员的数量（最多64个成员） |

### 3.5 二进制字符串类型

### 3.6 如何选择数据类型

### 3.7 运算符

## 4. 数据操作
MySQL8.0开始支持了DDL原子化，这是什么意思呢，比如我有以下一个DDL语句
```sql
DROP TABLE tb1,tb2;
```
我要一次删除两个表，但是数据库中并不存在`tb2`这张表，于是这条语句执行的时候会报错，但是在MySQL5.7中并没有DDL原子化，所有`tb1`依然是被删除了，而如果是在MySQL8.0中，`tb1`则不会被删除，即这条语句要么全部执行成功，要么全部执行失败
### 4.1 插入
掌握三种方式：

- 单条记录插入
- 多条记录插入
- SELECT+INSERT
```sql
-- 单条记录插入,没显示赋值的走默认值
INSERT INTO tb(字段列表) VALUES(字段值列表);

-- 多条记录插入
INSERT INTO tb(字段列表) VALUES(字段值列表1),(字段值列表2),(字段值列表3);

-- SELECT+INSERT
INSERT INTO tb1(字段列表) SELECT(字段值列表) FROM tb2 WHERE(删选条件);
```

MySQL使用单条`INSERT`插入多条数据时比分开使用`insert`处理效率要高
### 4.2 删除
```sql
DELETE FROM table_name [WHERE <condition>]
```
其中，`WHERE`语句是可选的，当没有WHERE语句的时候将删除表中所有的数据。<br />如果想直接删除表中全部数据的时候，可以使用`TRUNCATE`，它的执行逻辑是直接删表后创建一个新表，而不是逐条删除记录，因此其执行速度比`DELETE`快不少。其语法为：
```sql
TRUNCATE TABLE table_name;
```
###  4.3 修改
```sql
UPDATE tb SET col1=value1, col2=value2, ...,coln=valuen WHERE(condition);
```
### 4.4 查询


## 5. MySQL索引


## 6. MySQL函数、存储过程与视图
### 6.1 数学函数

### 6.2 字符串函数

### 6.3 日期和时间函数

### 6.4 条件判断函数

### 6.5 系统信息函数

### 6.6 加密函数（8.0新特性）

### 6.7 其它函数
### 6.8 存储过程
### 6.9 视图

## 问题排查

### Explain
| column | JSON name | meaning |
| --- | --- | --- |
| id | select_id | SELECT标识符 |
| select_type |  |  |
| table |  |  |
| partitions |  |  |
| type |  |  |
| possible_keys |  |  |
| key |  |  |
| key_len |  |  |
| ref |  |  |
| rows |  |  |
| filtered |  |  |
| Extra |  |  |


#### id

#### select_type

#### table

#### partitions

#### type


## 附录
[MySQL5.7手册](https://dev.mysql.com/doc/refman/5.7/en/)

---
title: ElasticSearch 
date: 2023-01-02
sidebarDepth: 3
publish: false
tags:
 - MySQL
categories:
 - 混口饭吃
---

目标：
开发：基本使用、底层原理、数据建模
运维：容量规划、性能优化、问题诊断、滚动升级
方案：

背后公司上市
github用es搜索，维基百科也是es

DBMS排名

ES VS Solr  都是起源于Lucene

Lucene的局限：Java、原生类库不支持水平扩展（非常重要）、接口学习曲线陡峭

04年compass，10年重写后改名es，支持了水平扩展，减低学习曲线，支持多语言
 
分布式架构

接入方式：
- SDK
- restful api 以及 transport api
- JDBC和ODBC 


功能：搜索和聚合

版本迭代，567的新特性

04讲的生态圈

用ES做存储：频繁更新不要，需要事务不要

---
title: Spring AOP
date: 2022-12-29
tags:
 - Spring
categories:
 - 混口饭吃
---

本文的主要目的是整理总结SpringAOP相关的知识，理解掌握文中内容后，日常开发工作中大多数与SpringAOP使用相关的内容应不再成为阻碍，同时本文对`ProxyFactoryBean`的使用做了简单介绍，帮助大家了解一些基于Spring的框架中代理的实现

本文内容分为三部分

- 第一部分介绍AOP相关基本概念，描述SpringAOP、AspectJ在AOP中的定位以及二者之间的关系
- 第二部分讲述SpringAOP使用相关的内容，具体来说是介绍了@AspectJ的使用，并未提及XML配置方式的AOP使用
- 第三部分以创建RPC代理为例，简单介绍`ProxyFactoryBean`的使用
## 1. 基本概念
关于AOP（Aspect-oriented Programming）本身的编程思想，假定读者已经知悉，本文不再赘述，但仍强调一点，**AOP是对OOP的补充，它适用于特定的场景，不要让它做它职责范围外的事情**。阅读本部分之后应明确：

- AOP相关术语的概念
- SpringAOP在AOP中的定位
- Spring与AspectJ之间的关系
### 1.1 AOP相关术语
下面列举一下AOP中的一些基本概念：

| **概念** | **解释** |
| --- | --- |
| 连接点（Join Point ） | 连接点指的是程序执行的某个位置，比如类的初始化前后，方法的执行前后等。连接点是切面可以经过的地方，当你选择了一个连接点并创建了切面之后，该连接点就可以成为下文中的切点。<br />注意，Spring只支持方法的连接点，即Spring只你能辅助你在方法执行前后、异常抛出等场景下执行AOP |
|  增强（Advice） | 增强可以理解为你在连接点上做的事情，它包含两个部分，一是定位链接点的信息，二是你要增加的处理逻辑。 |
|  切点（Pointcut） | 如上文所述，切点就是特定场景下的连接点，可以理解为“切点=被切的连接点” |
|  引介（Introduction） | 引介是一类特殊的增强，它为类增加一些属性和方法，能动态让业务类实现某个接口 |
| 目标对象（Target Object） | 增强逻辑织入的目标类 |
|  代理（Proxy） | 一个类被AOP织入增强后，它会产生一个代理类，你之后操作的也就是这个代理类。根据不同的实现，代理类可能是和原类具有相同接口的实现，也能是原类的子类。 |
|  织入（Weaving） | 你通过AOP的手段给某个切点增加了一些逻辑，这个过程就是织入。根据不同的技术实现，有三种方式的织入：<br />- 编译期织入，这要求使用特殊的java编译期<br />- 类装载期织入，这要求使用特殊的类装载器<br />- 动态代理织入，在运行期为目标类增加增强的方式<br />
Spring采用动态代理织入，而AspectJ采用编译期织入和类装载期织入 |
|  切面（Apect） | 切面是由切点和增强组成的，既包括连接点的定义，也包括横切逻辑的定义，即你选择了什么以及你要做什么 |

### 1.2 Sping AOP与AOP
个人认为，整个代码世界都是基于协议运作的，AOP作为其中一员，也必然会有相关组织来指定维护相关协议规范。[AOP联盟](https://aopalliance.sourceforge.net/)是众多开源AOP项目的联合组织，该组织负责制定AOP规范，定义AOP接口。本来这种事情是Sun来干，但是Sun运作比较拉胯，被AOP联盟捷足先登了，所有AOP这块就被AOP联盟管了。

既是协议规范，那就可能有不同实现，如同JVM规范有Hotspot、JRockit以及J9等实现，AOP也有AspectJ、JBossAOP以及SpringAOP等具体实现。虽然SpringAOP遵守AOP规范，但是其目的并非是对AOP的完整实现，而是希望以便捷的方式帮助开发者去覆盖最通用的业务场景，该理念的具体表现为：

- SpringAOP只支持方法类型的连接点，包括前置、后置、环绕、异常抛出、finally
- SpringAOP的实现是纯Java的，不依赖特殊的编译器或者类加载器

如果遇到SpringAOP无法支持的场景，你可以考虑使用AspectJ来实现目的。
### 1.3 SpringAOP与AspectJ
[AspectJ](https://www.eclipse.org/aspectj/)也是AOP的实现之一，与SpringAOP不同的是，AspectJ的目的就是实现AOP规范（我怀疑除了SpringAOP，其余的实现都是抱着这个目的），所以它对AOP的功能支持是比较完整的。AspectJ2001年由Xerox PARC的AOP小组发布的。AspectJ扩展了Java，定义了AOP语法，能够在编译器提供代码的织入，它有一个专门的编译器用于生成遵守Java虚拟机字节码规范的Class文件。

在SpringAOP的具体中，其实是有借助AspectJ的现有功能的，当使用@AspectJ方式时，SpringAOP实际上是用了AspectJ的表达式解析，此外，当SpringAOP的功能无法满足需求时，它也允许你直接使用AspectJ。
## 2. SpringAOP的使用
该部分主要介绍@AspectJ方式SpringAOP的使用，内容分为：

- 定义切点，包括PCD（PointCut Designer）切点设计器相关，明确准确捕获你想要的连接点
- 定义增强，明确Spring支持的五种增强分别如何定义、使用
- 如何以方法入参的形式将切点信息传递给增强方法
- 补充内容

### Before we start
SpringAOP默认会使用JDK动态代理来实现，但受限于JDK动态代理的要求（代理对象至少需要实现一个接口），当你代理类没有实现任何接口的时候，Spring则被迫借助CGLIB来实现代理，当然，你也可以让Spring强制使用CGLIB。<br />当你使用CGLIB时，注意以下两点：

- `final`的方法是无法被代理的，因为它们在运行时无法被子类覆盖
- 从Spring 4.0开始，代理对象的构造函数不再被调用两次，因为CGLIB代理实例是通过objesis创建的。只有当您的JVM不允许构造函数绕过时，您可能会看到来自Spring AOP支持的双重调用和相应的调试日志条目（机翻，尚未理解）

```xml
<!--使用配置方式声明切面时，在config元素中增加proxy-target-class属性-->
<aop:config proxy-target-class="true">
    <!-- other beans defined here... -->
</aop:config>

<!--开始注解方式使用切面时，在aop元素中增加proxy-target-class属性-->
<aop:aspectj-autoproxy proxy-target-class="true"/>
```

注：注意，当配置了多个`<aop:config/>`标签时，最终只会生成一个代理创建者，它选取的参数会是集合了各个配置之后限制最多的那些（博采众长）

---

当我们谈到**@AspectJ**的时候，我们指的是“**通过使用注解的方式，将一个java类声明成一个切面**”，@AspectJ是AspectJ项目中引入的，Spring借用的同样的注解，并且使用了AspectJ的工具包来进行切点的解析和匹配，但是在运行时的AOP还是纯Spring的。<br />@AspectJ既然是AspectJ项目的东西，那它的目的肯定是支持完整AOP功能的，但如上文所述，SpringAOP志不在此，所以，当你用@AspectJ声明了一些SpringAOP不支持的PCD（pointcut designer，就是声明切点的表达式）时，SpringAOP会抛出**IllegalArgumentException**

要想使用@AspectJ，需要手动开启，有两种方式可供选择，请确保`aspectjweaver.jar`存在于你的依赖路径中。
```xml
<!-- 添加如下 -->
<aop:aspectj-autoproxy/>
```

```java
@Configuration
@EnableAspectJAutoProxy
public class AppConfig {
}
```

开启之后就可以使用@Aspect注解来声明一个切面。切面和普通的类一样可以有字段和方法声明，除此之外，切面还可以声明切点、通知和引介。注意，@Aspect注解只是声明切面，并不能完成bean注入，你还需要使用@Conponent或者有相同功能的注解（不加没法生效），此外，在Spring中，一个切面无法成为目标对象，当Spring检测到一个bean是切面类型时，将不会自动为它创建代理。
### 2.1 定义切点
一个切点声明应包含两个部分：

- 一个有名称和参数组成的签名（一个返回void类型的方法定义）
- 一个切点表达式，用于确认连接点

一个简单的切点定义的例子：
```java
@Pointcut("execution(* transfer(..))") // the pointcut expression
private void anyOldTransfer() {} // the pointcut signature
```

#### 2.1.1 切点设计器
引入概念PCD：PointCut Designators，可以理解为切点表达式的类型。Spring支持的PDC如下：

| **类别** | **PCD** | 入参 | **description** |
| --- | --- | --- | --- |
| **方法切点函数** | **execution** | 方法匹配模式串 | 匹配方法。使用Spring AOP时候的首选<br />格式：<br />execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern)throws-pattern?) |
|  | **@annotation** | 方法注解类名 | 有特定注解的目标类方法。打在类上不行 |
| **方法入参切点函数** | **args** | 类名 | 参数类型，示例：<br />@Pointcut("args(java.lang.String,java.lang.Integer)") |
|  | **@args** | 类型注解类名 | 和args类似，不过入参是类型注解 |
| **目标类切点函数（匹配后对类中所有切点生效）** | **within** | 类名匹配串 | 示例：<br />@Pointcut("within(com.test.*)") |
|  | **target** | 方法执行类的类名 | 和within类似，within是aoe，target是单体供给。比如：<br />@Pointcut("target(com.alibaba.druid.Constants)") |
|  | **@target** | 类型注解 | 二者类似，都是接受一个注解类型之后进行匹配，需要区分的是当使用@target进行匹配时，只是目标类的所有连接点会被匹配上，而如果使用@within去匹配的话，目标类及其所有的实现类的连接点都会被匹配（可以理解成@within打在接口上，@target打在具体类上） |
|  | **@within** | 类型注解 |  |
| **代理类切点函数** | **this** |  | 在Spring中this和target基本等效（没太明白，没有深究） |
| **Spring自己的** | **bean** |  | 根据beanName确定连接点，*、&&、&#124;&#124;、！这些操作符是支持的，但因为是Spring自己的，所以你在Spring框架里用用就行。 |

AspectJ支持了一些SpringAOP不支持的PCD： call, get, set, preinitialization, staticinitialization, initialization, handler, adviceexecution, withincode, cflow, cflowbelow, if, @this, 以及 @withincode. <br />使用这些PCD的时候，SpringAOP会抛出**IllegalArgumentException**

注意一点，Spring AOP是基于代理实现的，不管什么PCD，首先Spring AOP需要能拦截到这个连接点才能有故事发生。对于JDK动态代理，只能拦截接口的public方法，对于CGLIB，只能拦截public和protect方法，如果无法满足你的需求，建议使用原生的AspectJ织入

#### 2.1.2 使用common pointcut以及组合切点
类似于我们会建立一个`CommonConstant`来存放常量，切点也是可以放到一个地方，方便之后组合、复用的。使用方式非常简单，也是创建一个切面，里面只定义切点，注意把切点方法定义成`public`，之后在别的切面里面就可以直接引用了，也可以自由组合。
```java
//common pointcut就不需要使用component了
@Aspect
public class CommonPointcuts {

    @Pointcut("within(com.xyz.myapp.web..*)")
    public void inWebLayer() {}

    @Pointcut("within(com.xyz.myapp.service..*)")
    public void inServiceLayer() {}
}

//在另一个切面中使用
@Aspect
@Component
public class AnotherAspect{
    @Before(value = "CommonPointcuts.inWebLayer() && CommonPointcuts.inServiceLayer(context)")
    public void before(){}
}
```

#### 2.1.3 定义切点的良好习惯
在编译过程中AspectJ通常会将切点以的方式进行重新，目的是优化匹配性能，代价最小的条件将最先用于匹配。无论是动态还是静态的连接点匹配检查开销都是非常大的，所有我们需要尽量给它提供线索以缩小扫描范围，就类似于数据库索引。<br />通常PDC可以分为以下三类：

1. 类型选择：比如`execution, get, set, call, handler`
2. 范围选择：比如`within`
3. 上下文选择：比如`target、this、@annotation`

一个定义良好的切点应该至少包含前两种PCD。如果单纯使用类型选择或者上下文选择的话，由于需要额外的过程和分析，织入的时间和空间开销都会增加；范围选择是一个非常高效的选择器，能用则用。

A well written pointcut should include at least the first two types (kinded and scoping).
### 2.2 定义增强
Spring支持的五种增强：`@Before``@AfterRetuning``@AfterThrowing``@After``@Around`<br />增强由两部分组成：切点表达式+处理逻辑，其中切点表达式可以引用一个切点定义，也可以直接使用PDC描述
#### 2.2.1 Before
方法执行前触发
```java
@Aspect
public class BeforeExample {

    @Before("com.xyz.myapp.CommonPointcuts.dataAccessOperation()")
    public void doAccessCheck() {
        // ...
    }

     @Before("execution(* com.xyz.myapp.dao.*.*(..))")
    public void doAccessCheck2() {
        // ...
    }
}
```
#### 2.2.2 After Returning
在**正常**返回时触发。最基本的使用方式
```java
@Aspect
public class AfterReturningExample {

    @AfterReturning("com.xyz.myapp.CommonPointcuts.dataAccessOperation()")
    public void doAccessCheck() {
        // ...
    }
}
```
如果你需要获取到返回的对象，则按如下方式使用
```java
@Aspect
public class AfterReturningExample {

    @AfterReturning(
        pointcut="com.xyz.myapp.CommonPointcuts.dataAccessOperation()",
        returning="retVal")
    public void doAccessCheck(Object retVal) {
        // ...
    }
}
```
其中需要注意的是：

- 声明中的returning的值必须和方法参数名一致
- 方法参数类型相当于一个过滤器，只会过滤出返回值类型匹配的方法（例子中用了Object，也就是全部都可以匹配）
- 在AfterReturning中你是没办法返回一个不同类型的值的（改成null也不行，但你可以修改里面的值）。
#### 2.2.3 After Throwing
和After Returning的使用方式很类似
```java
@Aspect
public class AfterThrowingExample {

    @AfterThrowing("com.xyz.myapp.CommonPointcuts.dataAccessOperation()")
    public void doRecoveryActions() {
        // ...
    }
}

@Aspect
public class AfterThrowingExample {

    @AfterThrowing(
        pointcut="com.xyz.myapp.CommonPointcuts.dataAccessOperation()",
        throwing="ex")
    public void doRecoveryActions(DataAccessException ex) {
        // ...
    }
}
```
值得注意的是，After Throwing只会捕获原生方法的异常，而不会捕获`@After``@AfterReturning`中抛出的异常
#### 2.2.4 After（Finally）Advice
After中你需要处理正常和异常返回（区别于AfterReturning），其使用场景通常是释放资源
```java
@Aspect
public class AfterFinallyExample {

    @After("com.xyz.myapp.CommonPointcuts.dataAccessOperation()")
    public void doReleaseLock() {
        // ...
    }
}
```
#### 2.2.5 Around
Around的处理方法的返回值类型**应该**是`Object`（如果你定义成void，那就会一直给调用者返回null），并且方法的第一个参数**必须**是`ProceedingJoinPoint`类型（其实JoinPoint也不会报错），在你的处理逻辑中，必须调用`ProceedingJoinPoint`的`proceed()`方法以保证逻辑正常进行（可以调用任意次）。<br />当使用`proceed()`方法不指定参数时，默认使用原方法的入参，或者你也可以用`Object[]`自定你的参数。<br />当你使用AspectJ编译器的时候，`proceed()`方法的入参有一些可能不符合你预期的规定，如果你真的遇到这种情况，可重新翻阅SpringFramework文档中关于Around Advice的部分。
```java
@Aspect
public class AroundExample {

    @Around("com.xyz.myapp.CommonPointcuts.businessService()")
    public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
        // start stopwatch
        Object retVal = pjp.proceed();
        // stop stopwatch
        return retVal;
    }
}
```

> Always use the least powerful form of advice that meets your requirements.
> For example, do not use around advice if before advice is sufficient for your needs.


### 2.3 获取切面参数
对于Spring支持的五种增强来说，你都可以在增强的方法入参里加上一个`JoinPoint`参数（注意是AspectJ的JoinPoint,不是AOP联盟的Joinpoint），通过该对象你可以获取到关于切面的一些基本信息（详情可参考）。<br />特别的，当使用的是环绕增强时，请用`ProceedingJoinPoint`代替，这是因为`JoinPoint`是没有<br />`proceed()`方法的，如此你就无法完成对象的方法调用了，但如果你非要用的话也不会报错。

除了以上通用方法外，还有一些PCD可以快捷地将连接点的信息绑定到增强方法入参上：
#### args()
```java
@Before("com.xyz.myapp.CommonPointcuts.dataAccessOperation() 
        && args(account,..)")
public void validateAccount(Account account) {
    // ...
}
-------------------------------------------------
    
@Pointcut("com.xyz.myapp.CommonPointcuts.dataAccessOperation() && args(account,..)")
private void accountDataAccessOperation(Account account) {}

@Before("accountDataAccessOperation(account)")
public void validateAccount(Account account) {
    // ...
}
    
```
方法签名中写类型，args里填写对应的参数名，其实际运作过程就是根据PCD中的参数名去方法签名中找到对应的类型，然后再回到PCD中进行相关过滤逻辑。<br />🤔我测试的时候args只有配合其它的pcd才能生效

#### this()、target()
```java
@After(value = "this(service)")
public void test2(ServiceImpl  service){
    System.out.println(service);
}

@After(value = "target(service)")
public void test2(ServiceImpl  service){
    System.out.println(service);
}
```
记得这俩是要指定到具体的实现类的
#### @target()、@within()、@args()、@annotation()
[举一反三](https://baike.baidu.com/item/%E4%B8%BE%E4%B8%80%E5%8F%8D%E4%B8%89/823529)

注意，当你在绑定参数的时候是无法处理泛型的，其因有二：

1. 为了做个匹配得检查集合元素的具体类型，不合理
2. 无法定义null值的类型
### 2.4 增强的执行顺序
你可以使用`@Order`来指定一个顺序，在进入的时候，高优先级的先执行，而在离开的时候，高优先级的会后执行。如果两个增强优先级一样，那他们的相对顺序并未得到保障。<br />数字越小优先级越高

## 3. `ProxyFactoryBean`的使用
本部分的内容主要编写一个玩具级别的ServiceMesh的sidebar，意在帮助理解RPC框架执行原理（部分）,在这里我们只选模拟了日志上报与负载均衡。<br />内容主要有三个角色：

- 拦截器：用于拦截方法执行
- 代理类：用于创建SpringBean的时候填在class的位置上，但是其实际调用时可以执行被代理的方法
- 被代理接口：就是RPC中的远程服务定义的接口

### 3.1 拦截器
我们可以通过实现`MethodInterceptor `接口来创建一个拦截器，在其执行逻辑中，我们做了一下事情：

1. 日志上报，可以对应RPC的全链路追踪功能
2. 负载均衡，在这里我们只模拟了一个随机选择的过程，并未真正创建连接对象，在实际使用中连接对象需要包含接口信息、地址信息等，若配合较为复杂的负载均衡算法，还会有响应时间等附加信息
```java
public class TestInterceptor implements MethodInterceptor {
    private List<Integer> connections;

    public TestInterceptor(List<Integer> connections){
        this.connections = connections;
    }

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable{
        System.out.println("进入代理执行逻辑");
        startLog();
        selectConnectionAndRevoke();
        endLog();
        System.out.println("离开代理执行逻辑");
        return "hello world";
    }

    private void endLog(){
        System.out.println("在方法调用后进行打点");
    }

    private void startLog(){
        System.out.println("在方法调用前进行打点");
    }

    private void selectConnectionAndRevoke(){
        Random random = new Random();
        int index = random.nextInt(connections.size());
        System.out.println("负载均衡选择了链接，并且执行了方法调用,这次选择的是"+connections.get(index)+"号链接");
    }
}
```
### 3.2 代理类
在SpringIOC中，你可以通过使用`ProxyFactoryBean`或者`FactoryBean`来创建一个bean，其最终注入的类型和对象是由其`getObjectType ()`、`getObject()`方法确定的。<br />在使用`ProxyFactoryBean`的时候，有两个重要的参数需要确定，一个是接口，一个是拦截器，在这里我们注册了Spring的事件监听，在Bean创建完成后初始化连接列表、负载均衡器、日志追踪器以及设置接口和拦截器。
```java
public class TestProxy extends ProxyFactoryBean implements InitializingBean {
    private String interfaceName;
    private List<Integer> connections;

    public void setInterfaceName(String interfaceName) throws ClassNotFoundException{
        this.interfaceName = interfaceName;
    }

    @Override
    public void afterPropertiesSet() throws Exception{

        initConnections();
        initBalancer();
        initTraceLogger();

        this.addInterface(Class.forName(interfaceName));
        this.addAdvice(new TestInterceptor(connections));

        //还有一些别的工作...
    }

    private void initTraceLogger(){
        System.out.println("初始化了全链路追踪器");
    }

    private void initBalancer(){
        System.out.println("创建一个负载均衡，假装我们有了");
    }

    private void initConnections(){
        System.out.println("根据服务、链路等信息从注册中心获取到一个链接列表，这里我们只用一个Integer的List表示");
        connections = new ArrayList<>();
        for (int i = 0; i < 10; i++){
            connections.add(i);
        }
    }
}
```
### 3.3 被代理接口
被代理接口只是一个接口定义而已，这里我们定义了一个简单接口，也只有一个简单方法
```java
public interface TestTarget {
    public String getString();
}
```

### 3.4 实现调用
此时，我们便可以以如下方式声明SpringBean，并在之后完成调用
```xml
<bean id="testProxy" class="com.test.TestProxy">
       <property name="interfaceName" value="com.test.TestTarget"/>
</bean>
```
创建测试类进行接口调用
```java
public class Maintest {
    @Test
    public void test(){
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        TestTarget testProxy = (TestTarget) applicationContext.getBean("testProxy");
        String ret = testProxy.getString();
        System.out.println(ret);
    }
}
```
执行后我们得到的输入如下
```shell
根据服务、链路等信息从注册中心获取到一个链接列表，这里我们只用一个Integer的List表示
创建一个负载均衡，假装我们有了
初始化了全链路追踪器
进入代理执行逻辑
在方法调用前进行打点
负载均衡选择了链接，并且执行了方法调用,这次选择的是2号链接
在方法调用后进行打点
离开代理执行逻辑
hello world
```

(全文终)

# create project
# depencies (better no use latest version,  because the jdk and java not latest)
    不同依赖可能只支持特定的 JDK 版本，尤其是 Spring Boot、第三方库等。
    建议查看依赖官方文档或 Maven 仓库说明，确保兼容性，避免运行时或编译错误
    demo for freemaker
        controller
        a ftl file
        open the file
# application config
    mysql
    redis
    minio
    the swagger
        to config swagger in config class

# entity

# spring security config
   passwordencode
   UserDetails -> UserDetailsService
   
   用户发起登录请求
    Security 过滤器链拦截请求，调用 AuthenticationManager
    AuthenticationManager 调用 AuthenticationProvider
    AuthenticationProvider 用 UserDetailsService 加载用户信息，并用 PasswordEncoder 校验密码
    校验通过则认证成功，失败则抛出异常


# spring security
    请求进入 → 经过过滤器链。
         请求到达过滤器链
        Spring Security 的核心是一系列过滤器（Filter），这些过滤器按顺序处理请求。以下是典型的过滤器链顺序：

        ChannelProcessingFilter

        决定是否需要 HTTPS 重定向（如配置了 requiresChannel() ）。
        SecurityContextPersistenceFilter

        从存储（如 HTTP Session 或 JWT）中加载 SecurityContext （用户认证信息）。
        请求完成后，保存 SecurityContext 回存储。
        HeaderWriterFilter

        添加安全相关的 HTTP 头（如 X-Content-Type-Options 、 X-Frame-Options ）。
        CsrfFilter

        检查 CSRF 令牌（如果是 POST/PUT/DELETE 请求且启用了 CSRF 防护）。
        LogoutFilter

        处理注销请求（匹配 /logout 路径）。
        UsernamePasswordAuthenticationFilter

        处理表单登录请求（默认路径 /login ）。
        解析用户名和密码，调用 AuthenticationManager 进行认证。
        DefaultLoginPageGeneratingFilter

        生成默认登录页面（如果未自定义登录页）。
        BasicAuthenticationFilter

        处理 HTTP Basic 认证（解析 Authorization: Basic 头）。
        RequestCacheAwareFilter

        恢复用户原始请求（如登录前访问的页面）。
        SecurityContextHolderAwareRequestFilter

        包装请求对象，提供 Spring Security 相关方法（如 isUserInRole() ）。
        AnonymousAuthenticationFilter

        如果用户未认证，赋予一个匿名用户身份（ ROLE_ANONYMOUS ）。
        SessionManagementFilter

        处理会话固定攻击防护（如 sessionFixation().migrateSession() ）。
        ExceptionTranslationFilter

        捕获 AuthenticationException 和 AccessDeniedException ，触发登录或拒绝访问逻辑。
        FilterSecurityInterceptor

        最终检查请求是否有权限访问目标资源（基于 SecurityConfig 配置）。
        如果权限不足，抛出 AccessDeniedException 。
        自定义过滤器（如 JWT 过滤器）

        如果添加了自定义过滤器（如 JwtAuthenticationFilter ），会在链中插入。
    认证 → 解析用户身份（表单/JWT/Basic）。
        如果请求需要认证（如访问受保护资源），Spring Security 会执行以下步骤：

         认证管理器（ AuthenticationManager ）

        调用 authenticate() 方法，委托给 AuthenticationProvider （如 DaoAuthenticationProvider ）。
        用户详情服务（ UserDetailsService ）

        从数据库或缓存加载用户信息（ UserDetails ）。
        密码校验（ PasswordEncoder ）

        比对请求密码和存储密码的哈希值。
        生成认证对象

        认证成功后，返回 Authentication 对象（包含用户角色和权限）。
        设置安全上下文

        将 Authentication 存入 SecurityContextHolder ，标记用户已认
    授权 → 检查权限规则。
        FilterSecurityInterceptor

        检查 SecurityConfig 中配置的权限规则（如 .hasRole("ADMIN") ）。
        如果用户角色匹配，放行请求；否则抛出 AccessDeniedException 。
        ExceptionTranslationFilter

捕获 AccessDeniedException ，返回 403 Forbidden 或重定向到登录页
    Controller → 处理业务逻辑。
    响应返回 → 经过过滤器链返回。



# redis session config
    spring session set expiration time in application and @Bean config did not work(?)
    but with this works @EnableRedisHttpSession(maxInactiveIntervalInSeconds = 3000)
    then start session auth step
    1. 登录成功后，在 Session 中设置登录标识（如 userAccount）。login api
    2. 每次接口请求，先获取 Session 并检查登录标识是否存在。every api
    3. 如果 Session 过期或未登录，返回 401（未认证）。every api
    4. 前端拦截 401，自动跳转登录页或清理本地登录状态。frontend global main.tsx
    this 1,2,3 step can use spring security replace . login
    Spring Security 使用 Session 检查认证状态的原理如下：
        登录成功后，认证信息存入 Session
        用户登录成功，Spring Security 会将 Authentication 对象（包含用户信息和权限）存入 Session（默认是 HttpSession），并在 SecurityContextHolder 里保存。
        每次请求自动读取 Session 认证信息
        后续请求时，Spring Security 的过滤器链会自动从 Session 读取 Authentication，判断用户是否已认证。
        未认证时自动跳转或返回未登录响应
        如果 Session 里没有认证信息（比如 Session 过期或未登录），访问受保护接口时会触发 AuthenticationEntryPoint，返回未登录提示或跳转到登录页。
        Session 失效即丢失认证状态
        用户登出或 Session 超时，认证信息会被清除，后续请求即视为未登录
    流程简述：
        登录成功：SecurityContextHolder.getContext().setAuthentication(...)，并存入 Session。
        每次请求：Spring Security 自动检查 Session 是否有认证信息。
        无认证信息：触发未登录处理逻辑。
    这种机制适合传统 Web 应用（如表单登录），前后端分离场景常用 JWT 替代 Session。
    so the only need to do is to set the  in SecurityFilterChain bean
               .exceptionHandling(
                        except->
                                except.authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("未登录或会话已过期");
                })
                );
# redis caffeine cache config
# thread



# regist logic:
   securityFilterChain pass(not do)
    controller api
    api service
        check username and others
        encoded password ( PasswordEncode.class)
        save to database
     synchronized (userAccount.intern()) explain StringLockExample
     4 ways create thread 
     ConcurrentHashMapExampleThread
    ConcurrentHashMapExampleRunnable
        can not get return value,  with callable get
    ConcurrentHashMapExampleCallable
    ConcurrentHashMapExample
        submit can accept callable or runnable, default is callable
        callable vs runnable
    return

# login logic:(HttpOnly is safer than just send 2 tokens)
    securityFilterChain pass(not do)
    controller api
    api service
        check username 
        password with encoded password in database( PasswordEncode.class)
        generate jwt token (JwtTokenUtils.class) and refresh token
    can set cookie with session
    return json(accessToken and refreshToken)
    refreshToken is long time 7 days , if accessToken expired, can use refreshToken to get new accessToken


# other requests logic(with jwt token,  check accesstoken,  if accesstoken expire by refreshtoken, neither , login):
    spring security
        步骤 1：令牌解析与认证JWT 过滤器：
            如果使用 JWT，自定义的 JwtAuthenticationFilter 会解析令牌，验证其有效性（如签名、过期时间）。

            无效令牌：返回 401 Unauthorized 。
            有效令牌：提取用户信息（如 username 和 roles ），构建 Authentication 对象。
            设置安全上下文：
            将 Authentication 对象存入 SecurityContextHolder ，标记当前用户已认证。   
        步骤 2：授权检查
            SecurityFilterChain ：
            检查 /api/user/findallusers 的访问权限配置    
            .requestMatchers("/api/user/findallusers").hasRole("ADMIN") // 需要 ADMIN 角色
        如果用户角色不满足要求（如非 ADMIN ），返回 403 Forbidden 。
    go to controller



TODO try 
可以用 Redisson。
Redisson 是 Redis 的高级 Java 客户端，除了基本的 KV 操作，还支持分布式锁、集合、队列等高级功能。
区别如下：
RedisTemplate：Spring 官方提供的 Redis 操作工具，适合简单的 KV 存储和基本操作，API 接近原生 Redis。
Redisson：功能更丰富，支持分布式锁、限流器、集合、异步操作等，适合需要分布式同步、限流、队列等场景

# Backend monolithic version:

- Api gateway: spring gateway
- services communite: spring cloud openfeign + gRPC
- circuit breaking and degradation: resillence4j
- mointering and visulization: prometheus, grafana

# core tech stacks
| tech type  |  tech select | version | description |
|---------|---------|------|------|
| base frame | Spring Boot | 3.5.6 | bash framework|
| database | MySQL | 8.x | relational |
| connect pool | HikariCP | 1.2.24 | database connect pool |
| ORM FRAMEWORK | JPA(Hibernate) | 3.5.5 | persistence api |
| cache | Redis | latest | distribational cache |
| cache | Caffeine | latest | cache |
| session | redis | latest | session cookie |
| rate limit | redis | latest | login rate |
| concurrent | threadpool |  | thread |
| file save | MINIO | - | distribute save service |
| monitering | prometheus | latest | API, Host monitor |
| visulization  | grafana | latest | for prometheus |
| containerization | Docker | - |  |
| test | junit | latest | inner test |
| test | postman | latest | api test |
| ratelimit | redission | - |  redission lib |

| AI | Langchain4j | - | all |
| Tools | Hutool | 5.8.40 | Java tools |

| communicate | kafka | latest | api message communicate |
|  openapi | swagger3 | latest | api document |
|  fault tolerance | resillence4j |latest| circuitbreaker and retry|



frontend:
register 
    /api/user/register/
        request
            private String userAccount;
            private String userPassword;
            private String checkPassword;
        return
            Long result
    /api/user/login/
     to do 
          "tokenTimeout": 3600,       // Token 有效期：1 小时
  "sessionTimeout": 86400,   // 全局会话有效期：24 小时
  "tokenSessionTimeout": 7200 /

# readme

设想：
使用 pm2 起一个服务，为主进程，接收http请求

设计几个子服务

主进程收到服务开启的请求后，运行pm2命令，开启对应的进程，并返回启动结果

收到关闭请求，则关闭进程。
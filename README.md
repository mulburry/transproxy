# transproxy
a proxy for google translate api, to avoid CORS issue

## 简介
在向ChatGPT请教数据分析相关问题时，无意中得到的一个小知识，就是可以在浏览器书签中写入一段JavaScript，浏览器会自动执行这段脚本。具体的实现就是利用它来实现无插件划词翻译。

原本ChatGPT给出的代码是直接调用google translate API，试用下来会产生CORS问题，于是在ChatGPT的帮助下实现了一个简单的python代理，实测可用。

代码80%由ChatGPT提供，我修改了极少部分。

提交到这里只是为了记录防丢失。

## 部署
可部署到vps服务器或cf、aws的某些免费服务上。

1. python环境  

因为仅仅使用了flask的非常基础的功能，对python版本应该没有严格要求，我本人的环境是：
- Python 3.11.2
- pip    23.0.1

2. 安装依赖  

一样应该没有严格的版本要求：  
```bash
pip install Flask requests flask-cors gunicorn
```  

我使用的版本
- Flask              3.0.3
- Flask-Cors         4.0.1
- gunicorn           22.0.0
- requests           2.32.3

3. 运行  

首先需要一个简单的配置，在代码所在目录下的keys.txt中填入任意的key（建议长度16位以上），用于校验访问合法性，防止资源滥用。  
可以配置多个key，一行一个即可。  

开发模式（试用）：  
```bash
python app.py
```  

生产模式：  
```bash
./run.sh
```

4. nginx  

也算是标准玩法了，对外服务通过nginx提供，配置仅供参考：  
```conf
server {
    listen 80;
    server_name your_domain_or_ip;

    location /transproxy/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 使用  
首先需修改bookmark.js中的  
var key = ...   
var serverUrl = ...  
行以符合自己的情况，然后全选复制。  

打开浏览器，在浏览器中新建书签，将代码粘贴到“网址”栏，标题自定即可。  

本人在Firefox和chrome中均已测试过可用。

## 其他  
- 以上所有命令都应该在代码所在目录下执行，否则可能会因为找不到相关文件造成错误  
- 如果服务器无法访问google翻译服务，可以改用国内翻译服务，具体代码可以请AI辅助提供  
- 因为使用的是GET方式调用，太长的文本翻译可能有问题，整段翻译建议用“流畅阅读”，我用过感觉不错
- 界面美观度和交互性有限，有能力的可以自己修改  
- 目前已知的情况，在Firefox的阅读器模式以及github网站下使用时，仍然会有安全策略问题，暂不折腾了，有知道解法的欢迎补充  
- 关于AI，确实如达人们所说，想要让AI好好干活，自己真的得懂一点才行

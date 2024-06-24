# gunicorn.conf.py
bind = "127.0.0.1:5000"
workers = 2 
accesslog = "logs/access.log"
errorlog = "logs/error.log"


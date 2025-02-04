# gunicorn_config.py
bind = "0.0.0.0:5000"
workers = 3
timeout = 120
keepalive = 5
worker_class = "sync"
accesslog = "access.log"
errorlog = "error.log"

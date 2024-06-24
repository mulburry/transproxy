gunicorn -c gunicorn.conf.py app:app > logs/gunicorn.log 2>&1 &


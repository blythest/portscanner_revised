from flask import Flask, render_template, redirect, request, g, session, url_for, flash
import portscanner
import subprocess
import daemon
import os
from portscanner import LOCKFILE
from datetime import datetime, timedelta
import psutil

app = Flask(__name__)

@app.route("/")
def index():
    message = 'Portscanner is not running.' 
    try:
        pid = os.readlink(LOCKFILE)
        print 'pid ', pid
        if psutil.pid_exists(int(pid)):
            message = 'Portscanner already running.'
    except OSError:
        print str(Exception)
    return render_template("index.html", message=message)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/scan")
def scan():
    daemon.main("python portscanner.py")
    return redirect("/", code=302)

if __name__ == "__main__":
    app.run()

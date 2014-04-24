'''
Created on Mar 03, 2014

@author: haijun
'''

import os
import json
import requests
import gitapi
from flask import Flask
from flask import request
from flask import render_template
from flask import url_for

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/getProjectList')
def projectList():
    fobj = file("static/projects.json")
    plist = json.load(fobj)
    ptlist = []
    for pname in plist:
        prj = {}
        prj['name'] = pname
        prj['contributors'] = gitapi.getContributors(pname)
        prj['commits'] = gitapi.getCommits(pname)
        prj['repo'] = gitapi.getRepo(pname)
        prj['heroku'] = gitapi.getHeroku(pname)
        ptlist.append(prj)
        
    response = {
                "status" : "success", 
                "results" : ptlist
                }
    return json.dumps(response)

@app.route('/projects', methods = ['POST'])
def addnewuser():
    newuser = json.loads(request.data)
    if (len(newuser["name"]) > 40):
        response = {
                    "status" : "failure"
                    }
        return json.dumps(response)
    
    fobj = file("static/projects.json")
    projectList = json.load(fobj)
    projectList.append(newuser)
    with open("static/projects.json", "w") as fobj:
        json.dump(projectList, fobj, indent = 4)
    response = {
               "status" : "success"
               }
    return json.dumps(response)
    
if __name__ == '__main__':
    app.run()
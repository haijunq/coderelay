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
from flask import redirect

app = Flask(__name__)

num = 2

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/logout')
def logout():
    return render_template('login.html')

@app.route('/coderelay', methods = ['GET', 'POST'])    
def coderelay():
    username=request.form['login']
    fobj = file('db/userlist.json')
    ulist = json.load(fobj)
    for user in ulist:
        if user['username'] == username:
            user['visits'] += 1;
            with open("db/userlist.json", "w") as fobj:
                json.dump(ulist, fobj, indent = 4)
            return render_template('index.html', curuser = username, curvisit = user['visits'], totalvisit = sum([user['visits'] for user in ulist]))
            
    return render_template('login.html')


@app.route('/users/list')
def getUserList():
    fobj = file('db/userlist.json')
    ulist = json.load(fobj)
    response = {
                "status" : "success", 
                "results" : ulist
                }
    return json.dumps(response)

@app.route('/users/visit', methods = ['POST'])
def incrementVisit():
    usernamejson = json.loads(request.data)
    username = usernamejson['name']
    fobj = file("db/userlist.json")
    userlist = json.load(fobj)
    for user in userlist:
        if user['username'] == username:
            user['visits'] += 1 
    with open("db/userlist.json", "w") as fobj:
        json.dump(userlist, fobj, indent = 4)
    response = {"status" : "success" }
    return json.dumps(response)

@app.route('/projects/list')
def getProjectList():
    fobj = file("db/projects.json")
    plist = json.load(fobj)
    prjlist = [prj['name'] for prj in plist if prj['active'] == True]
    ptlist = []
    for pname in prjlist:
        prj = {}
        prj['name'] = 'PROJ_' + pname[-2:]
        prj['contributors'] = gitapi.getContributors(pname)
        prj['commits'] = gitapi.getCommits(pname)
        prj['repo'] = gitapi.getRepo(pname)
        prj['heroku'] = gitapi.getHeroku(pname).replace('_', '-')
        ptlist.append(prj)
    response = { 
                "status" : "success", 
                "results" : ptlist
                }
    return json.dumps(response)

@app.route('/projects/init', methods = ['POST'])
def initProject():
    newprj = json.loads(request.data)  
    fobj = file("db/projects.json")
    prjList = json.load(fobj)
    for prj in prjList: 
        if prj['name'] == newprj['name']:
            prj['active'] = True
    with open("db/projects.json", "w") as fobj:
        json.dump(prjList, fobj, indent = 4)
    response = {
               "status" : "success"
               }
    return json.dumps(response)

@app.route('/projects/delete', methods = ['POST'])
def deleteProject():
    delprj = json.loads(request.data)  
    fobj = file("db/projects.json")
    prjList = json.load(fobj)
    for prj in prjList: 
        if prj['name'] == delprj['name']:
            prj['active'] = False
    with open("db/projects.json", "w") as fobj:
        json.dump(prjList, fobj, indent = 4)
    response = {
               "status" : "success"
               }
    return json.dumps(response)
    
if __name__ == '__main__':
    app.run()
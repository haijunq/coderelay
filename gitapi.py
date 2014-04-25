'''
Created on Mar 23, 2014

@author: haijun
'''
import json
import requests

GITAPIPRE = 'https://api.github.com/repos/eece518/'
GITPRE = 'https://github.com/eece518/'
DOTGIT = '.git'
# projectName = 'dblike'
COMMITACTIVITY = '/stats/commit_activity'
CONTRIBUTORS = '/stats/contributors'
HTTP = 'http://'
HEROKU = '.herokuapp.com'

def getCommits(projectName):
    url = GITAPIPRE + projectName + COMMITACTIVITY
    resp = doGet(url)
    commits = 0
    for res in resp:
        commits += res['total']
    return commits

def getContributors(projectName):
    url = GITAPIPRE + projectName + CONTRIBUTORS
    resp = doGet(url)
    return len(resp)

def getRepo(projectName):
    return GITPRE + projectName + DOTGIT

def doGet(url):
    response = requests.get(url, auth=('eece518@gmail.com','Hit518Project'))
    resp = json.dumps(response.json(), indent=4)
    return json.loads(resp)

def getHeroku(projectName):
    return HTTP + projectName + HEROKU

"use strict";
var basename = "coderelayprj_";
var prjbasename = "static/projects/coderelayprj_";
var currentUser = "";
var currentGitUser = "";
var currentProject = "";
var deleteProject = "";
var LOGIN = "/login";
var GETPROJECTLIST = "/projects/list";
var ADDPROJECT = "/projects/init";
var DELPROJECT = "/projects/delete";
var GETUSERLIST = "/users/list";
var INCREMENTVISIT = "/users/visit";	
var userlist = [];
var prjlist = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

$(document).ready(function() {
	getAndShowVisits();
	getAndShowTable();
	$("#start_new_button").on("click", addNewProject);
	$("#initial_button").on("click", initCode);
	$("#start_new_button").attr('disable', true);
	$(document).on("click", "a.delete", deleteTRNode);
	$(document).on("click", "a.changeFrame", changeFrame);
	currentUser = $("#logininfo td:last-child").html();
});

function addNewProject() {
	if ($("#start_new_button").attr("disable") == "true") {
		alert("Please choose an initial code snippet first.")
		return;
	}
	var prj = {};
	prj.name = "PROJ_" + currentProject.substr(currentProject.length-2,currentProject.length-1);
	prj.contributors = 0;
	prj.commits = 0;
	prj.repo = "https://github.com/eece518/" + currentProject + ".git";
	prj.heroku = "http://" + currentProject.replace("_", "-") + ".herokuapp.com";
	$("#projects tr:last").after(makeTableRow(prj));
	addPrjAjax();
	$("#start_new_button").attr('disable', true);
}

function initCode() {
	if ($("#iframe").attr('src') !== 'blank.html') {
		$("#iframe").attr('src', 'blank.html');
		// $("#iframe").contents().find('html').find('head').remove();
	}
	$("#iframe").contents().find('html').find('body')
			.attr('bgcolor', "#E6E6FA");
	var ranindex = Math.floor(Math.random() * prjlist.length);
//	$("#iframe").contents().find('html').find('body').html(
//			"<pre>" + prjlist[ranindex] + "</pre>");
	$("#iframe").attr('src', prjbasename + prjlist[ranindex] + "/index.html");
	currentProject = basename + prjlist[ranindex];
	$("#start_new_button").attr('disable', false);
	console.log(currentProject);
}

function alertme() {
	alert("me");
}

function makeSimpleDOMNode(tagName, text) {
	var simpleNode = document.createElement(tagName);
	simpleNode.innerHTML = unescape(text);
	return simpleNode;
}

function makeIdDOMNode(tagName, id) {
	var idNode = document.createElement(tagName);
	idNode.setAttribute("id", id);
	return idNode;
}

function deleteTRNode(event) {
	confirm
	event.preventDefault();
	var r = confirm("Are you sure to delete this project?");
	if (r == true) {
		var repo = $(this).parent().prev().prev().children().attr('href');
		var repostr = repo.split("/");
		var prj = repostr[repostr.length-1].split(".");
		deleteProject = prj[0];
		$(this).parent().parent().remove();
		delPrjAjax();
	}
}

function changeFrame(event) {
	event.preventDefault();
	var url = $(this).attr('href');
	$("#iframe").attr('src', url);
	var ifr = document.getElementById("iframe");
	ifr.src = ifr.src;
}

function getAndShowTable(event) {
	$.ajax({
		type : "GET",
		url : GETPROJECTLIST,
	}).done(function(ajax) {
		var resp = $.parseJSON(ajax);
		if (resp.status == "success") {
			var prjlist = resp.results;
			populateTable(prjlist);
		}
	});
}

function populateTable(projectList) {
	for (var i = 0; i < projectList.length; i++) {
		$("#projects tr:last").after(makeTableRow(projectList[i]));
	}
}

function makeTableRow(project) {
	var str = "<tr><td>" + project.name + "</td><td>"
	+ project.contributors + "</td><td>"
	+ project.commits + "</td><td><a target='_blank' href="
	+ project.repo
	+ ">GIT REPO</a></td><td><a class='changeFrame' href="
	+ project.heroku + ">PREVIEW</a></td><td><a class='delete' href=''>X</a></td></tr>";
	return str;
}

function getAndShowVisits(event) {
	$.ajax({
		type : "GET",
		url : GETUSERLIST,
	}).done(function(ajax) {
		var resp = $.parseJSON(ajax);
		if (resp.status == "success") {
			var userlist = resp.results;
			var userstats = getUserStats(userlist);
//			$('#logininfo td:eq(1)').html(userstats.name);
//			$('#logininfo td:eq(3)').html(userstats.visit);
//			$('#logininfo td:eq(5)').html(userstats.total);
		}
	});	
}

function incrementVisits(event) {
	$.ajax({
		type : "POST",
		url : INCREMENTVISIT,
		dataType : "json",
		contentType : 'application/json;charset=UTF-8',
		data : JSON.stringify({
			"name" : currentUser
		})
	}).done(function(ajax) {

	});		
}

function getUserStats(userlist) {
	var userstats = {};
	var totalvisits = 0;
	for (var i=0; i<userlist.length; i++) {
		totalvisits += userlist[i].visits;
		if (userlist[i].username == currentUser) {
			userstats.visit = userlist[i].visits;
		}
	}
	userstats.name = currentUser;
	userstats.total = totalvisits;
	return userstats;
}

function addPrjAjax(event){
	$.ajax({
		type : "POST",
		url : ADDPROJECT,
		dataType : "json",
		contentType : 'application/json;charset=UTF-8',
		data : JSON.stringify({
			"name" : currentProject
		})
	}).done(function(ajax) {

	});		
}

function delPrjAjax(event){
	$.ajax({
		type : "POST",
		url : DELPROJECT,
		dataType : "json",
		contentType : 'application/json;charset=UTF-8',
		data : JSON.stringify({
			"name" : deleteProject
		})
	}).done(function(ajax) {

	});		
}

function showLoadAjax() {
	$('#loadingDiv').hide().ajaxStart(function() {
		$(this).show(); // show Loading Div
	}).ajaxStop(function() {
		$(this).hide(); // hide loading div
	});
}
"use strict";
var basename = "Code Relay Project ";
var baseid = "code_relay_project_";
var projectList = [];
var count = 6;
var LOGIN = "/login";
var PROJECTLIST = "/getProjectList";

$(document).ready(function() {
	getAndShowTable();
	$("#start_new_button").on("click", addNewProject);
	$("#initial_button").on("click", initCode);
	$("#start_new_button").attr('disable', true);
	$(document).on("click", "a.delete", deleteTRNode);
	$(document).on("click", "a.changeFrame", changeFrame);
});

function addNewProject() {
	if ($("#start_new_button").attr("disable") == "true") {
		alert("Please choose an initial code snippet first.")
		return;
	}
	var node = makeIdDOMNode("li", baseid + count);
	node.innerHTML = "<a href=\"\" class='changeFrame'>" + basename + count
			+ "</a><a class=\"delete\" href=\"\">X</a>";
	$("#projectList").append(node);
	count++;
	$("#iframe").attr('src', 'blank.html');
	$("#start_new_button").attr('disable', true);
}

function initCode() {
	if ($("#iframe").attr('src') !== 'blank.html') {
		$("#iframe").attr('src', 'blank.html');
		// $("#iframe").contents().find('html').find('head').remove();
	}
	$("#iframe").contents().find('html').find('body')
			.attr('bgcolor', "#E6E6FA");
	var ranindex = Math.floor(Math.random() * rcodearray.length);
	$("#iframe").contents().find('html').find('body').html(
			"<pre>" + rcodearray[ranindex] + "</pre>");
	$("#start_new_button").attr('disable', false);
	console.log(ranindex);
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
	if (r == true)
		$(this).parent().remove();
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
		url : PROJECTLIST,
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
		$("#projects tr:last").after(
				"<tr><td>" + projectList[i].name + "</td><td>"
						+ projectList[i].contributors + "</td><td>"
						+ projectList[i].commits + "</td><td><a href="
						+ projectList[i].repo
						+ ">GIT REPO</a></td><td><a href="
						+ projectList[i].heroku + ">GOTO WEB</a></td></tr>");
	}
}

function showLoadAjax() {
	$('#loadingDiv').hide().ajaxStart(function() {
		$(this).show(); // show Loading Div
	}).ajaxStop(function() {
		$(this).hide(); // hide loading div
	});
}
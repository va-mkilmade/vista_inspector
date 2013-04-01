/*
 */

//var url = "http://10.1.17.116:57772/csp/cpm/TestPull.cls";
var username = "xxx";
var password = "yyy";
var params = "";
var ip = "";

$("document").ready(function() {
	$("#vi-ip-go-btn").click(onGo);	//buildPaths();
});

$(document).bind("mobileinit", function() {
	$.mobile.page.prototype.options.addBackBtn = true;
});



function buildPaths() {
	$("#vi-content").html("");
	var url = buildUrl("paths");
	$.getJSON(url, function(data) {
		// build html for content role
		var x = '<ul data-role="listview" data-inset="true">';
		for (var i = 0; i < data.areas.length; i++) {
			var areaPageId = 'vi-' + data.areas[i].id;
			var areaContentId = 'vi-' + data.areas[i].id + '-content';
			x = x + '<li><a href="#' + areaPageId + '">' + data.areas[i].text + '</a></li>';
			if (data.areas[i].hasOwnProperty("items")) {
				var y = '<ul data-role="listview" data-inset="true">';
				for (var j = 0; j < data.areas[i].items.length; j++) {
					var text = "";
					var id = "";
					for (key in data.areas[i].items[j]) {
						if (data.areas[i].items[j].hasOwnProperty(key)) {
							if (key === "text") {
								text = data.areas[i].items[j][key];
							} else {
								if (key === "id") {
									id = "vi-" + data.areas[i].items[j][key];
								} // if id
							} // else
						}// hasOwnProperty (key)
					} // for key
				y = y + '<li><a id="' + id + '-item" href="#' + id + '">' + text + '</a></li>';
				} // for j
			y = y + "</ul>"
			$("#" + areaContentId).html(y);
			/*  needed?
			$('#' + areaPageId).on('pageinit', function(event) {
			    $("#areaContentId").trigger("create");
			});
			*/
			} // hasOwnProperty (items)
		};// for i
		x = x + "</ul>";
		$("#vi-content").html(x);
		$("#vi-content").trigger('create');
		// bind functions after html inserted
		for (var i = 0; i < data.areas.length; i++) {
			if (data.areas[i].hasOwnProperty("items")) {
				for (var j = 0; j < data.areas[i].items.length; j++) {
					var func = "";
					var id = "";
					for (key in data.areas[i].items[j]) {
						if (data.areas[i].items[j].hasOwnProperty(key)) {
							if (key === "function") {
								func = data.areas[i].items[j][key];
							} else {
								if (key === "id") {
									id = "vi-" + data.areas[i].items[j][key] + '-item';
								} // if id
							} // else
						}// if hasOwnProperty (key)
					} // for key
				if (window[func]) {
					$("#" + id ).click(window[func]);
				} // click binding
				} // for j
			} // hasOwnProperty (items)
		} // for i
	});//getJSON
}

function onGo() {
	ip =$("#vi-ip").val();
	buildPaths();
	$.mobile.changePage("#vi-main");
}

function buildUrl(area) {
	var port = "57772";
	var rest = "csp/cpm/vi." + area + ".cls";
	return "http://" + ip + ":" + port + "/" + rest;
}

function buildCredentials(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

function doHttpRequest() {
	$("#vi-taskman-results").html("");
	var request = $.ajax({
		beforeSend : function(xhrObj) {
			xhrObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			//xhrObj.setRequestHeader("Authorization", buildCredentials(username, password));
		},
		url : buildUrl("taskman"),
		type : "post",
		data : params
	});

	// callback handler that will be called on success
	request.done(function(response, textStatus, jqXHR) {
		console.log("Result for request received");
		obj = $.parseJSON(jqXHR.responseText);
		var node = "";
		var value = "";
		var x = ""
		x = x + "Run date/time: " + obj[0].date
		x = x + "<table id='table-4'>"
		x = x + "<thead><tr><th>Global</th><th>Status</th></tr></thead>";
		for (var i = 0; i <= obj.length; i++) {
			for (key in obj[i]) {
				if (obj[i].hasOwnProperty(key)) {
					if (key === "node") {
						node = obj[i][key];
					} else {
						value = obj[i][key];
					}
				}
			}
			x = x + "<tr><td>" + node + "</td><td>" + value + "</td></tr>";
		}
		x = x + "</table>"
		$("#vi-taskman-results").html(x);
	});

	// callback handler that will be called on failure
	request.fail(function(jqXHR, textStatus, errorThrown) {
		var msg = "The following request error occured: " + textStatus
		console.error(msg, errorThrown);
		alert(msg);
	});

}

function doTaskMan() {
	$("#vi-taskman-results").html("");
	var url = buildUrl("taskman");
	$.getJSON(url, function(data) {
		var x = ""
		x = x + "Run date/time: " + data.date
		x = x + "<table id='table-2'>"
		x = x + "<thead><tr><th>Global</th><th>Status</th></tr></thead>";
		for (var i = 0; i < data.nodes.length; i++) {
			for (key in data.nodes[i]) {
				if (data.nodes[i].hasOwnProperty(key)) {
					if (key === "node") {
						var node = data.nodes[i][key];
					} else {
						if (key === "value") {
							var value = data.nodes[i][key];
						} // if value
					} // if node
				} // if hasOwnProperty
			} // for key
			x = x + "<tr><td>" + node + "</td><td>" + value + "</td></tr>";
		}; // for i
		x = x + "</table>";
		$("#vi-taskman-results").html(x);
	}); //getJSON
}


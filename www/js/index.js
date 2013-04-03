// url for reference "http://10.1.17.116:57772/csp/cpm/vi.paths.cls";

var deflt = {"ip" : "10.1.17.116", "port" : "57772", "namespace" : "cpm"};
var site = {"ip" : "", "port" : "", "namespace" : ""};

$(document).bind("mobileinit", function() {
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.loader.prototype.options.text = "Loading VistA Inspector...";
	$.mobile.loader.prototype.options.textVisible = "true";
	$.mobile.loader.prototype.options.theme = "b";
});

$("document").ready(function() {
	$("#vi-ip-go-btn").click(onGo);
});

function onGo() {
	site.ip = $("#vi-ip").val();
	if (site.ip === "") {
		site.ip = deflt.ip;
		$("#vi-ip").val(site.ip);
	}
	site.port = $("#vi-port").val();
	if (site.port === "") {
		site.port = deflt.port;
		$("#vi-port").val(site.port);
	}
	site.namespace = $("#vi-namespace").val();
	if (site.namespace === "") {
		site.namespace = deflt.namespace;
		$("#vi-namespace").val(site.namespace);
	}
	buildPaths();
	$.mobile.changePage("#vi-main");
}

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
			$('#' + areaPageId).on('pagebeforeshow', {value : areaContentId}, function(event) {
			    $("#" + event.data.value).trigger("create");
			});
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

function buildUrl(area) {
	return "http://" + site.ip + ":" + site.port + "/csp/" + site.namespace + "/vi." + area + ".cls";
}

function doTaskMan() {
	$("#vi-taskman-results").html("");
	var url = buildUrl("taskman");
	$.getJSON(url, function(data) {
		var x = ""
		x = x + "Run date/time: " + data.date
		x = x + "<table><thead><tr><th>TM OS Item</th><th>Status</th></tr></thead>";
		// insert os env properties
		x = x + "<tr><td>OS</td><td>" + data.os.os + "</td></tr>";
		x = x + "<tr><td>Volume Set</td><td>" + data.os.volset + "</td></tr>";
		x = x + "<tr><td>Cpu:Volume Pair</td><td>" + data.os.cpuvol + "</td></tr>";
		x = x + "<tr><td>TM Files UCI,Volume Set</td><td>" + data.os.ucivol + "</td></tr>";
		x = x + "<tr><td>Log Tasks?</td><td>" + data.os.logtasks + "</td></tr>";
		if (data.os.hasOwnProperty("partsize")) {
		x = x + "<tr><td>Task Partition Size</td><td>" + data.os.partsize + "</td></tr>";
		}
		x = x + "<tr><td>Submgr Retention</td><td>" + data.os.retention + "</td></tr>";
		x = x + "<tr><td>Min# Submgrs</td><td>" + data.os.minsubmgrs + "</td></tr>";
		x = x + "<tr><td>Hang Between New Jobs</td><td>" + data.os.hangtime + "</td></tr>";
		x = x + "<tr><td>TM Run Type</td><td>" + data.os.runtype + "</td></tr>";
		if (data.os.hasOwnProperty("vaxenv")) {
			x = x + "<tr><td>TM VAX enviroment</td><td>" + data.os.vaxenv + "</td></tr>";
		}
		if (data.os.hasOwnProperty("loadbalancing")) {
			x = x + "<tr><td>TM Load Balancing Type</td><td>" + data.os.loadbalancing + "</td></tr>";
		}
		if (data.os.hasOwnProperty("balanceinterval")) {
			x = x + "<tr><td>Balance Interval</td><td>" + data.os.balanceinterval + "</td></tr>";
		}
		x = x + "<tr><td>Logons Inhibited?</td><td>" + data.os.inhibited + "</td></tr>";
		x = x + "<tr><td>TM Job Limit</td><td>" + data.os.limit + "</td></tr>";
		if (data.os.hasOwnProperty("max")) {
			x = x + "<tr><td>Max sign-ons</td><td>" + data.os.max + "</td></tr>";
		}
		x = x + "<tr><td>Active Jobs</td><td>" + data.os.activejobs + "</td></tr>";
		x = x + "<tr><td>Linked VolSets</td><td>" + data.os.linkedvolsets + "</td></tr>";
		// insert TM global node statuses
		x = x + "<thead><tr><th>TM Global</th><th>Status</th></tr></thead>";
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

/* Not used code
function buildCredentials(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

function doHttpRequest() {
	$("#vi-taskman-results").html("");
	var username = "xxx";
	var password = "yyy";
	var request = $.ajax({
		beforeSend : function(xhrObj) {
			xhrObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			//xhrObj.setRequestHeader("Authorization", buildCredentials(username, password));
		},
		url : buildUrl("taskman"),
		type : "post",
		data : ""
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
Not used code */
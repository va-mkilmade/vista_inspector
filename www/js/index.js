// url for reference "http://10.1.17.116:57772/csp/cpm/vi.paths.cls";
"use strict";
var deflt = {"ip" : "10.1.17.116", "port" : "57772", "namespace" : "cpm"};
var site = {"ip" : "", "port" : "", "namespace" : ""};

$(document).bind("mobileinit", function() {
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.loader.prototype.options.text = "Loading VistA Inspector...";
	$.mobile.loader.prototype.options.textVisible = "true";
	$.mobile.loader.prototype.options.theme = "b";
});

function buildUrl(area) {
    return "http://" + site.ip + ":" + site.port + "/csp/" + site.namespace + "/vi." + area + ".cls";
}

function triggerCreate(event) {
    $("#" + event.data.value).trigger("create");
}

function buildPaths() {
    $("#vi-content").html("");
    var url = buildUrl("paths");
    $.getJSON(url, function(data) {
        // build html for content role
        var x, key, i , j, text, id, y, areaPageId, areaContentId, func;
        x = '<ul data-role="listview" data-inset="true">';
        for (i = 0; i < data.areas.length; i++) {
            areaPageId = 'vi-' + data.areas[i].id;
            areaContentId = 'vi-' + data.areas[i].id + '-content';
            x = x + '<li><a href="#' + areaPageId + '">' + data.areas[i].text + '</a></li>';
            if (data.areas[i].hasOwnProperty("items")) {
                y = '<ul data-role="listview" data-inset="true">';
                for (j = 0; j < data.areas[i].items.length; j++) {
                    text = "";
                    id = "";
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
            y = y + "</ul>";
            $("#" + areaContentId).html(y);
            $('#' + areaPageId).on('pagebeforeshow', {value : areaContentId}, triggerCreate);
            } // hasOwnProperty (items)
        } // for i
        x = x + "</ul>";
        $("#vi-content").html(x);
        $("#vi-content").trigger('create');
        // bind functions after html inserted
        for (i = 0; i < data.areas.length; i++) {
            if (data.areas[i].hasOwnProperty("items")) {
                for (j = 0; j < data.areas[i].items.length; j++) {
                    func = "";
                    id = "";
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

$("document").ready(function() {
	$("#vi-ip-go-btn").click(onGo);
});

function buildRow(caption, value) {
    return "<tr><td>" + caption + "</td><td>" + value + "</td></tr>";
}
function doTaskMan() {
	$("#vi-taskman-results").html("");
	var url = buildUrl("taskman");
	$.getJSON(url, function(data) {
		var x, node, value, i, key;
		x = "";
		x = x + "Run date/time: " + data.date;
		x = x + "<table><thead><tr><th>TM OS Item</th><th>Status</th></tr></thead>";
		// insert os env properties
		x = x + buildRow("OS",data.os.os);
		x = x + buildRow("Volume Set",data.os.volset);
		x = x + buildRow("Cpu:Volume Pair<",data.os.cpuvol);
		x = x + buildRow("TM Files UCI,VolSet",data.os.ucivol);
		x = x + buildRow("Log Tasks?",data.os.logtasks);
		if (data.os.hasOwnProperty("partsize")) {
					x = x + buildRow("TM Partition Size",data.os.partsize);
		}
		x = x + buildRow("Submgr Retention",data.os.retention);
		x = x + buildRow("Min# Submgrs",data.os.minsubmgrs);
		x = x + buildRow("Hang Between New Jobs",data.os.hangtime);
		x = x + buildRow("TM Run Type",data.os.runtype);
		if (data.os.hasOwnProperty("vaxenv")) {
					x = x + buildRow("TM VAX enviroment",data.os.vaxenv);
		}
		if (data.os.hasOwnProperty("loadbalancing")) {
					x = x + buildRow("TM Load Balancing Type",data.os.loadbalancing);
		}
		if (data.os.hasOwnProperty("balanceinterval")) {
					x = x + buildRow("Balance Interval",data.os.balanceinterval);
		}
		x = x + "<tr><td>Logons Inhibited?</td><td>" + data.os.inhibited + "</td></tr>";
		x = x + "<tr><td>TM Job Limit</td><td>" + data.os.limit + "</td></tr>";
		if (data.os.hasOwnProperty("max")) {
					x = x + buildRow("Max sign-ons",data.os.max);
		}
		x = x + buildRow("Active Jobs",data.os.activejobs);
		x = x + buildRow("Linked VolSets",data.os.linkedvolsets);
		// insert TM global node statuses
		x = x + "<thead><tr><th>TM Global</th><th>Status</th></tr></thead>";
		node = "";
		value = "";
		for (i = 0; i < data.nodes.length; i++) {
			for (key in data.nodes[i]) {
				if (data.nodes[i].hasOwnProperty(key)) {
					if (key === "node") {
						node = data.nodes[i][key];
					} else {
						if (key === "value") {
							value = data.nodes[i][key];
						} // if value
					} // if node
				} // if hasOwnProperty
			} // for key
			x = x + buildRow(node,value);
		} // for i
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
describe("VistA Inspector", function() {
 
    // Put function in ECMA Script 5 "strict" operating context
    "use strict";
   
   function getIp() { return "10.1.17.116"; }
   function getUrl() { return "http://10.1.17.116:57772/csp/cpm/vi.paths.cls"; }
    
    beforeEach(function() {
        buildSite();
    });
    
    it("deflt should be defined", function() {
        expect(deflt).toBeDefined();
    });
     
    it("site.ip should be equal to " + getIp(), function() {
        expect(site.ip).toEqual(getIp());
    }); 
    
    it("url should equal " + getUrl(), function() {
        expect(buildUrl("paths")).toContain(getUrl());
    }); 
    
    it("Kernel items should contain TaskMan from Async call", function() {
        buildSite();
        var url, output;
        url = buildUrl("paths");
        output = "";
        $.getJSON(url, function(data) {
            var index, node;        
            // build areas
            for (index = 0; index < data.areas.length; index++) {
                node = data.areas[index];
                if (node.id === "kernel") {
                    output = buildArea(node);
                    break;                   
                }
             }
        });
    
        waitsFor(function() {
            return ( output.length > 0 );
            }, "obtaining paths data never completed", 10000);

        runs(function () {
            expect(output).toContain("TaskMan");
        });
     });


    it("TaskMan data should be defined and formated correctly", function() {
        var props, globals, url;
        
        props = "";
        globals = "";
        url = buildUrl("taskman");
        
        $.getJSON(url, function(data) {
            props = getTaskManPropertiesText(data);
            globals = getGlobalStatusesText(data);
        }); //getJSON
        
        waitsFor(function() {
            return ( globals.length > 0 );
            }, "obtaining TaskMan data never completed", 10000);

        runs(function () {
            expect(props).toContain("CPM,ROU");
            expect(globals).toContain("ZTSCH");
        });
    }); 

});  
      
describe("VistA Inspector Tools", function() {
 
    // Put function in ECMA Script 5 "strict" operating context
    "use strict";
   
   function getRow() { return "<tr><td>caption</td><td>value</td></tr>"; }
   
    it("buildRow should be equal to " + getRow(), function() {
        expect(buildRow("caption", "value")).toEqual(getRow());
    }); 
    
});        

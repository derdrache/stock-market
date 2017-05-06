app.controller('homeController', function($scope, $http, $cookies, $route) {

    var colors = ["steelblue", "red", "green", "gold", "indigo", "lightGreen"];
    const monthArray=["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    var heute = new Date().toString().split(" ");
   
    var heuteFormat =[heute[3], monatUmwandlung(heute[1]) ,"1"]
    var oneYear = [heute[3]-1, monatUmwandlung(heute[1]) ,"1"];

         
    if (!$cookies.get("aktien")){
        $cookies.put("aktien", ["gold"])
    }

    

    console.log($cookies.get("aktien"))
       
    /* Websocket */
    
    var sock = new WebSocket("wss://dynamic-web-application-projects-derdrache.c9users.io:8081");
   
    sock.onmessage = function(event){
        $cookies.put("aktien", event.data)
        $route.reload();
    }
    
   
    
   $scope.aktienShow = $cookies.get("aktien").split(",");

    /* DiagramZeichnung*/
            
            var svg = d3.select("svg")
            var margin = {top: 20, right: 20, bottom: 80, left: 50};
            var width = document.querySelector("svg").clientWidth - margin.left- margin.right;
            var height = document.querySelector("svg").clientHeight - margin.top - margin.bottom;
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
            
           var parseTime = d3.timeParse("%Y-%m-%d");

           
            var x = d3.scaleTime()
                .range([0,width]);
                
            var y = d3.scaleLinear()
                .range([height, 0]);
                
            
            var line = d3.line()
                .x(function(d) { return x(d.Date); })
                .y(function(d) { return y(d.Close); });
        
            d3.csv("https://www.quandl.com/api/v3/datasets/wiki/"+$scope.aktienShow[0]+".csv?collapse=monthly&start_date="+oneYear.join("-"), function(d){
                d.Date = parseTime(d.Date);
                      return d;
                    }, function(error, data) {
                        
                x.domain(d3.extent(data, function(d) { return d.Date; })); // 1. Pos -> Von wann die skala anfängt
                 
                y.domain([0,900]); // festen Wert für linke Spalte
                    
                    
                  g.append("g")
                      .attr("transform", "translate(0," + height + ")")
                      .call(d3.axisBottom(x))
                      .append("text")
                      .attr("fill", "#000")
                      .attr("x", width+5)
                      .attr("y", 17)
                      .text("heute")
                      
                      
                      
                
                  g.append("g")
                      .call(d3.axisLeft(y))
                    .append("text")
                      .attr("fill", "#000")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", "0.71em")
                      .attr("text-anchor", "end")
                      .text("Price ($)");
                
            });

                      
            
            
        /* DiagrammDaten*/
        
        
        
        var farbIndex = -1;
        for (var i = 0; i<$scope.aktienShow.length; i++){
            
        
          d3.csv("https://www.quandl.com/api/v3/datasets/wiki/"+$scope.aktienShow[i]+".csv?collapse=monthly&start_date="+oneYear.join("-"), function(d){
                d.Close = +d.Close;
                d.Date = parseTime(d.Date)  
                return d;
            }, function (data){

                    g.append("path")
                      .datum(data)
                      .attr("fill", "none")
                      .attr("stroke", function(){ farbIndex++; return colors[farbIndex]; })
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 1.5)
                      .attr("d", line)
                      .on("mouseover", function(d){
                          $scope.anzeige = "test"
                      })
                      .on("mouseout", function(d){
                          $scope.anzeige = "";
                      })    
                
                
            })  
            
        }
    
    
    
    /* Interaktion auf der Seite */ 
    
    $scope.deleteAktie = function(aktie){
        var aktien = $cookies.get("aktien").split(",");
        for (var i = 0; i<aktien.length; i++){
            if (aktien[i]== aktie){
                aktien.splice(i,1)
            }
        }
        sock.send(aktien)
    }
    
    $scope.aktienAdd = function(aktie, event){
        if (event.key == "Enter" || event.type =="click"){
        
            /* Prüfung ob es die Aktie gibt*/
            $http.get("https://www.quandl.com/api/v3/datasets/wiki/"+aktie)
            .error(function(){$scope.fehlerAusgabe="Diese Aktie gibt es nicht"})
            .success(function(){
                                var check= "good";
                                /* Prüfung ob die Aktie schon gelistet ist*/
                                var aktien = $cookies.get("aktien").split(",");
                                for (var i= 0; i<aktien.length; i++){
                                    if (aktien[i]== aktie){
                                        check = "schon vorhanden";
                                    }
                                }  
                                
                                if (check == "good"){
                                    var newAktie = [$cookies.get("aktien")];
                                    newAktie.push(aktie);
                            
                                    sock.send(newAktie)
                                    
                                }       
                                else{
                                    $scope.fehlerAusgabe = check;
                                }            
                            })
         
       }
    }

    
    
    
    /* Allgemeine Funktionen*/
    
    function monatUmwandlung(monat){ 
    var index = -1;
    
    for(var i=0; i<monthArray.length; i++){
        
        if (monat == monthArray[i]){
            index = i;
            break;
        }
    }

    
    if (index <10){
        index = "0"+index;
    }
    
    return index;
    
}

    
});






app.controller('homeController', function($scope, $http, $cookies, $route) {
    
    if (!$cookies.get("aktien")){
        $cookies.put("aktien", ["amazon", "google", "gold"])
    }
    
    $scope.aktienShow = $cookies.get("aktien").split(",");
    var aktienDaten =[];
    for (var i = 0; i<$scope.aktienShow.length; i++){
        $http.get("https://www.quandl.com/api/v3/datasets/wiki/"+$scope.aktienShow[i]+".csv?collapse=monthly").success(function(res){
            aktienDaten.push(res);
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
        $cookies.put("aktien", aktien)
        $route.reload();
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
                                    $cookies.put("aktien", newAktie)
                                    $route.reload();
                                }       
                                else{
                                    $scope.fehlerAusgabe = check;
                                }            
                            })
     
       }
    }
    
    

    
});
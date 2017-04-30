app.controller('homeController', function($scope, $http, $cookies, $route) {
    
    if (!$cookies.get("aktien")){
        $cookies.put("aktien", ["amazon", "google", "gold"])
    }
    
    var test = $cookies.get("aktien").split(",");
    
    $scope.aktienShow = $cookies.get("aktien").split(",");
   
    /*
    $http.get("https://www.quandl.com/api/v3/datasets/OPEC/ORB.csv?collapse=monthly").success(function(res){
        console.log(res);
    })
    */
    
    
    
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
           
            var double = false;
            var aktien = $cookies.get("aktien").split(",");
            for (var i= 0; i<aktien.length; i++){
                if (aktien[i]== aktie){
                    double = true;
                }
            }  
        
        
        
            if (double === false){
                var newAktie = [$cookies.get("aktien")];
                newAktie.push(aktie);
                $cookies.put("aktien", newAktie)
                $route.reload();
            }       
            else{
                $scope.fehlerAusgabe = "fehler";
            }
       
       }
    }
    
    
    
    
});
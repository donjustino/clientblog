$(document).ready(function () {
    getData();
});

var getData = function() {  
    $.ajax({  
        url: "http://localhost:8080/Blog/resources/article.entities.article",  
                type: "GET",  
        headers: {  
            Accept: "application/json"  
        }  
    }).success(function(data, status, jq) {  
   //Cette fonction indique à knockout d'appliquer les données aux éléments de la page   
    //Elle est toujours appelée quand les données sont pretes et est appelée qu'une fois   
    if(status){      
        ko.applyBindings(new ViewModelArticle(data));  
    }
        else{  
          //alert(data.message)  
        }  
    }).error(function(jq, status, error) {  
        $(".error").text(JSON.stringify(status + " " + error));  
  
    });  
};  

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    getData();
});

var getData = function() {  
    var id = getCookie("idutil");
    $.ajax({  
        url: "http://localhost:8080/Blog/resources/article.entities.article/auteur/" + id ,  
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
self.account = function () {
     var cook = getCookie("utilisateur");
     $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/mod/" + cook ,
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {  
        setCookie("idutil", data[0].id);
        document.getElementById("account-body").innerHTML = "<label class=\"col-md-4 control-label\" for=\"content\">Nom d'utilisateur :</label>"
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + data[0].username + " </ul>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Nom :</label>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<input id=\"nom\" name=\"nom\" type=\"text\" class=\"form-control input-sm\" value='" + data[0].lastname + "'>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Prenom :</label>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<input id=\"prenom\" name=\"prenom\" type=\"text\" class=\"form-control input-sm\" value='" + data[0].firstname + "'>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Mot de passe :</label>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<input id=\"password\" name=\"password\" type=\"password\" class=\"form-control input-sm\" value='" + data[0].password + "'>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">A propos :</label>";
        document.getElementById("account-body").innerHTML = document.getElementById("account-body").innerHTML + "<input id=\"apropos\" name=\"apropos\" type=\"text\" class=\"form-control input-sm\" value='" + data[0].about + "'>";
    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
   
};
self.edituser = function(){
    var id = getCookie("idutil");
    var lastname = document.getElementById("nom").value;
    var firstname = document.getElementById("prenom").value;
    var login = getCookie("utilisateur");
    var password = document.getElementById("password").value;
    var about = document.getElementById("apropos").value;

    var JSONObject = {
        "id" :id,
        "firstname": firstname,
        "lastname": lastname,
        "username": login,
        "password": password,
        "about":about
     };
      $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/" + id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(JSONObject),
        dataType: 'JSON'
    })
            .success(function (data) {
               
            })
            .error(function (jq, status, error) {
                $(".error").text(JSON.stringify(status + " " + error));
            });
       
};

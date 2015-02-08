var self = this;
var picture = "null";

var art = function (article) {
    this.id = ko.observable(article.id);
    this.title = ko.observable(article.title);
    this.keyword = ko.observable(article.keyword);
    this.content = ko.observable(article.content);
    this.ecritpar = ko.observable(article.ecritpar.username);
    this.published_on = ko.observable(article.published_on);
    this.photo = ko.observable(article.photo);
    
    
    //this.comments = ko.observable(article.comments.comment);
    $('#fic').on('change', function (e) {
                    var file = e.originalEvent.target.files[0],
                            reader = new FileReader();
                 
                       reader.onload = function (evt) {
                        $('#imageSelected').attr('src', evt.target.result);
                        $('#selectedImageConainer').css('display', '');
                        var jsonObject = {
                            'imageData': evt.target.result
                        }
                        // send a custom socket message to server
                       picture =jsonObject.imageData;
                    };
                    reader.readAsDataURL(file);

     });

};
var ViewModelArticle = function (articles) {

    //représente la liste des catégories  
    //La fonction prend la réponse obtenue du serveur en paramètre  
    //Ici nous supposons que vous avez chargé la liste des catégories  
    //ko.utils.arrayMap itère sur la collection et pour chaque objet trouvé, elle crée une instance de categorie   
    self.articles = ko.observableArray(ko.utils.arrayMap(articles, function (article) {
        return new art(article);
    }));
};



self.added = function (article) {
    var title = document.getElementById("titre").value;
    var keyword = document.getElementById("mc").value;
    var content = document.getElementById("contenu").value;
    var photo = document.getElementById("fic").value;



    var JSONObject = {
        "title": title,
        "keyword": keyword,
        "content": content,
        "photo": picture
    };
    var cook = getCookie("utilisateur");
    alert(cook);

    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(JSONObject),
        dataType: 'JSON',
        xhrFields: {
            withCredentials: false
        },
        crossDomain: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Users", cook);
        },
    })
            .success(function (data) {
             
              

            })
            .error(function (jq, status, error) {
                $(".error").text(JSON.stringify(status + " " + error));
            });

};
self.updated = function (article) {
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article" + article.id(),
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(ko.toJS(article), null, 2),
        headers: {
            Accept: "application/json"
        }
    })
            .success(function (data, status, jq) {

            })
            .error(function (jq, status, error) {
                $(".error").text(JSON.stringify(status + " " + error));

            });
};


self.removed = function (article) {
    self.articles.remove(article);
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/" + article.id(),
        type: "DELETE",
        contentType: "application/json",
        headers: {
            Accept: "application/json"
        }
    })
            .success(function (data, status, jq) {


            })
            .error(function (jq, status, error) {
                alert("ok");
            });
};

self.write = function () {
    var cook = getCookie("utilisateur");
    if (cook == null) {
        alert("Veuillez vous connecter pour écrire un article");
    }
    else {
        document.location.href = "create.html";
    }
}
self.myarticle = function () {
    var cook = getCookie("utilisateur");
    if (cook == null) {
        alert("Veuillez vous connecter pour voir vos articles");
    }
    else {
        document.location.href = "myarticle.html";
    }
}

self.comment = function (article) {
    var id = ko.toJSON(article.id);
    setCookie("idart", id);
    $.ajax({
        url: "http://localhost:8080/Blog/resources/commentaire.comment/search/" + id,
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {
        //Cette fonction indique à knockout d'appliquer les données aux éléments de la page   
        //Elle est toujours appelée quand les données sont pretes et est appelée qu'une fois 
        document.getElementById("modal-body").innerHTML = "<table  class=\"table table-striped\">"
        document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<tbody>"
        for (var i = 0; i < data.length; i++) {
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<tr>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<td>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<div class=\"container\">";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<div class=\"form-group\">";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + data[i].commentepar.username + "</ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + data[i].commented_date + "</ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + data[i].comment + "</ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "</ul>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "</div>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "</div>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "</td>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "</tr>";
            document.getElementById("modal-body").innerHTML = document.getElementById("modal-body").innerHTML + "<HR>";
        }
        document.getElementById("tablecom").innerHTML = document.getElementById("tablecom").innerHTML + " </tbody>";
        document.getElementById("tablecom").innerHTML = document.getElementById("tablecom").innerHTML + " </table>";
    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });


};
self.sendcomment = function (article) {
    if (getCookie("utilisateur") == null) {
        alert("Veuillez vous connecter pour poster");
    } else {
        var content = document.getElementById("sendc").value;
        var cook = getCookie("utilisateur");
        var id = getCookie("idart");
        var JSONObject = {
            "comment": content,
            "commentepar": cook
        };
        $.ajax({
            url: "http://localhost:8080/Blog/resources/commentaire.comment/" + id,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(JSONObject),
            dataType: 'JSON',
        })
                .success(function (data) {
                    alert("Commentaire posté, en attente de validation...");
                    window.location.reload(true);

                })
                .error(function (jq, status, error) {
                    $(".error").text(JSON.stringify(status + " " + error));
                });
    }
}

function setCookie(sName, sValue) {
    var today = new Date(), expires = new Date();
    expires.setTime(today.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
}

function getCookie(sName) {
    var cookContent = document.cookie, cookEnd, i, j;
    var sName = sName + "=";

    for (i = 0, c = cookContent.length; i < c; i++) {
        j = i + sName.length;
        if (cookContent.substring(i, j) == sName) {
            cookEnd = cookContent.indexOf(";", j);
            if (cookEnd == -1) {
                cookEnd = cookContent.length;
            }
            return decodeURIComponent(cookContent.substring(j, cookEnd));
        }
    }
    return null;
}
self.bphoto = function (article) {
   alert("test");
   //alert(ko.toJSON(article.id));
}
function test(){
 //document.getElementById("photo").innerHTML = "<IMG SRC=" + article.photo +" ALT=\"Texte remplaçant l'image\" TITLE=\"Texte à afficher\">";
 
 
  document.getElementById('test').click();

}
self.account = function () {
     var cook = getCookie("utilisateur");
     $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/mod/" + cook ,
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {  
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
    var lastname = document.getElementById("nom").value;
    var firstname = document.getElementById("prenom").value;
    var login = getCookie("utilisateur");
    var password = document.getElementById("password").value;
    var about = document.getElementById("apropos").value;
    alert(lastname + " " + firstname + " " +login + " "  + password + " " +about);

    var JSONObject = {
        "firstname": firstname,
        "lastname": lastname,
        "username": login,
        "password": password,
        "about":about
     };
      $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users",
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

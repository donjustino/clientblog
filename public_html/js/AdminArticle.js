/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
    this.statut = ko.observable(article.status);


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
            picture = jsonObject.imageData;
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

self.sendedit = function (article) {
    var id = getCookie("idart");
    var util = getCookie("idutil");
    var title = document.getElementById("titre").value;
    var keyword = document.getElementById("mc").value;
    var content = document.getElementById("contenu").value;
    var photo = document.getElementById("fic").value;

    var JSONObject = {
        "id": id,
        "title": title,
        "keyword": keyword,
        "content": content,
        "photo": picture
    };
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/" + id + "/" + util,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(JSONObject),
        dataType: 'JSON'
    })
            .success(function (data) {
                alert("ok");
            })
            .error(function (jq, status, error) {
                $(".error").text(JSON.stringify(status + " " + error));
            });


};
self.see = function (article) {
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/" + article.id(),
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {


        document.getElementById("modal-article").innerHTML = " ";
        document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<label>" + data.title + "</label>";
        document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<label>" + data.keyword + "</label>";


        if (data.photo != null) {
            document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<label>Photo : </label>";
            document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<center><img src=" + data.photo + " alt=\"photo\" height=\"300\" width=\"200\"></center>";
        }
        document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<label>" + data.content + "</label>";
        document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<label>Publiée le : </label>";
        document.getElementById("modal-article").innerHTML = document.getElementById("modal-article").innerHTML + "<label>" + data.published_on + "</label>";

        if (data.status != null) {
            document.getElementById("modal-footer").innerHTML = " <button class=\"btn btn-success\" data-bind=\"click: activate\">Publier</button>";

        } else {
            document.getElementById("modal-footer").innerHTML = "<a href=\"#\" class=\"btn btn-danger\">Retirer publication</a>";
        }



    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
};
self.activate = function (article) {
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/valid/" + article.id(),
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {

        alert("ok");



    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });

};
self.disabled = function (article) {
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/disabled/" + article.id(),
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {

        alert("ok");



    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });

};

self.edit = function (article) {
    setCookie("objutil", article.ecritpar());
    setCookie("idart", article.id());
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/" + article.id(),
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {


        document.getElementById("modal-articleEdit").innerHTML = "<label class=\"col-md-4 control-label\" for=\"content\">Titre:</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<input id=\"titre\" name=\"titre\" type=\"text\" class=\"form-control input-sm\" value = " + data.title + " >";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label>Tag : </label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<input id=\"mc\" name=\"mc\" type=\"text\" class=\"form-control input-sm\" value = " + data.keyword + " >";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label>Contenu : </label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<input id=\"contenu\" name=\"contenu\" type=\"text\" class=\"form-control input-sm\" value = " + data.content + " >";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label>Photo : </label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<center><img src=" + data.photo + " alt=\"photo\" height=\"300\" width=\"200\"></center>";



    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
};

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
self.stat = function (article) {
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/count",
        type: "GET",
     
    }).success(function (data, status, jq) {

        document.getElementById("modal-articleEdit").innerHTML = "<label class=\"col-md-4 control-label\" for=\"content\">Nombre d'article créer:</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">" + data + "</label>";
   


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
    var t;
     $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article/stat",
        type: "GET",
     
    }).success(function (data, status, jq) {

        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Nombre d'article publié:</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">" + data + "</label>";
   


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
    var j;
     $.ajax({
        url: "http://localhost:8080/Blog/resources/commentaire.comment/count",
        type: "GET",
     
    }).success(function (data, status, jq) {

        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Nombre de commentaire :</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">" + data + "</label>";
   


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
    var d;
    $.ajax({
        url: "http://localhost:8080/Blog/resources/commentaire.comment/stat",
        type: "GET",
     
    }).success(function (data, status, jq) {

        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Nombre de commentaire publié :</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">" + data + "</label>";
   


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
    var e;
      $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/count",
        type: "GET",
     
    }).success(function (data, status, jq) {

        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Nombre d'utilisateur :</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">" + data + "</label>";
   


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
    var p;
       $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/stat",
        type: "GET",
     
    }).success(function (data, status, jq) {

        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">Nombre d'utilisateur activé:</label>";
        document.getElementById("modal-articleEdit").innerHTML = document.getElementById("modal-articleEdit").innerHTML + "<label class=\"col-md-4 control-label\" for=\"content\">" + data + "</label>";
   


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });
    
};


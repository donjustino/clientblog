var self = this;
var art = function (article) {
    this.title = ko.observable(article.title);
    this.keyword = ko.observable(article.keyword);
    this.content = ko.observable(article.content);
    this.ecritpar = ko.observable(article.ecritpar.username);
    this.id = ko.observable(article.id);
    this.published_on = ko.observable(article.published_on);
    //this.comments = ko.observable(article.comments.comment);


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
    var JSONObject = {
        "title": title,
        "keyword": keyword,
        "content": content
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
                alert("ok");
                self.articles.update(article);

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

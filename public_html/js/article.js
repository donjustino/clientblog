var self = this;
var art = function (article) {
    this.title = ko.observable(article.title);
    this.keyword = ko.observable(article.keyword);
    this.content = ko.observable(article.content);
    
};
var com = function (commentaire) {
    //this.title = ko.observable(article.title);
    //this.keyword = ko.observable(article.keyword);
    this.contentcom = ko.observable(commentaire.commentaire);
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

var ViewModelCommentaire = function (commentaires) {
   
    //représente la liste des catégories  
    //La fonction prend la réponse obtenue du serveur en paramètre  
    //Ici nous supposons que vous avez chargé la liste des catégories  
    //ko.utils.arrayMap itère sur la collection et pour chaque objet trouvé, elle crée une instance de categorie   
    self.commentaires = ko.observableArray(ko.utils.arrayMap(commentaires, function (commentaire) {
        return new com(commentaire);
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
    
    $.ajax({
        url: "http://localhost:8080/Blog/resources/article.entities.article",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(JSONObject),
        dataType: 'JSON'
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

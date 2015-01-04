var self = this;
var art = function (article) {
    this.title = ko.observable(article.title);
    this.keyword = ko.observable(article.keyword);
    this.content = ko.observable(article.content);
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
    var title = document.getElementById("title").value;
    var keyword = document.getElementById("keyword").value;
    var content = document.getElementById("content").value;
    var JSONObject = {
        "title": title,
        "keyword": keyword,
        "content": content
     };
    
    $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.utilisateur/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(JSONObject),
        dataType: 'JSON'
    })
            .success(function (data) {
                self.articles.update(article);

            })
            .error(function (jq, status, error) {
                $(".error").text(JSON.stringify(status + " " + error));
            });

};
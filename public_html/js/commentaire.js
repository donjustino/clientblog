/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var self = this;
var com = function (commentaire) {
    //this.title = ko.observable(article.title);
    //this.keyword = ko.observable(article.keyword);
    this.content = ko.observable(commentaire.commentaire);
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

self.added = function (commentaire) {
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





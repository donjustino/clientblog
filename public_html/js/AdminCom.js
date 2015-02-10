/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var self = this;
var com = function (commentaire) {
    this.id = ko.observable(commentaire.id);
    this.comment = ko.observable(commentaire.comment);
    this.commented_date = ko.observable(commentaire.commented_date);
    this.commentepar = ko.observable(commentaire.commentepar.username);
    this.a_article = ko.observable(commentaire.a_article.title);
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

self.removed = function (commentaire) {
    self.commentaires.remove(commentaire);
    $.ajax({
        url: "http://localhost:8080/Blog/resources/commentaire.comment/" + commentaire.id(),
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
self.activate = function (commentaire) {
    alert("test");
    $.ajax({
        url: "http://localhost:8080/Blog/resources/commentaire.comment/valid/" + commentaire.id(),
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
self.disabled = function (commentaire) {
   
    $.ajax({
        url: "http://localhost:8080/Blog/resources/commentaire.comment/disabled/" + commentaire.id(),
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







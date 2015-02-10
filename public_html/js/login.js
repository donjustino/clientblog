var self = this;
var usr = function (utilisateur) {
    this.id = ko.observable(utilisateur.id);
    this.login = ko.observable(utilisateur.username);
    this.password = ko.observable(utilisateur.password);
    this.nom = ko.observable(utilisateur.lastname);
    this.prenom = ko.observable(utilisateur.firstname);
    this.apropos = ko.observable(utilisateur.about);
};

var ViewModelUtilisateur = function (utilisateurs) {

    //représente la liste des catégories  
    //La fonction prend la réponse obtenue du serveur en paramètre  
    //Ici nous supposons que vous avez chargé la liste des catégories  
    //ko.utils.arrayMap itère sur la collection et pour chaque objet trouvé, elle crée une instance de categorie   
    self.utilisateurs = ko.observableArray(ko.utils.arrayMap(utilisateurs, function (utilisateur) {
        return new usr(utilisateur);
    }));
};

self.adduser = function (utilisateur) {
    var lastname = document.getElementById("nom").value;
    var firstname = document.getElementById("prenom").value;
    var login = document.getElementById("login").value;
    var password = document.getElementById("password").value;
    var about = document.getElementById("apropos").value;
    var JSONObject = {
        "firstname": firstname,
        "lastname": lastname,
        "username": login,
        "password": password,
        "about": about
    };
    $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(JSONObject),
        dataType: 'JSON'
    })
            .success(function (data) {
                setCookie("utilisateur", login);
                alert("Votre compte à été créer avec succès... redirection...");
                document.location.href = "index.html";

            })
            .error(function (jq, status, error) {
                $(".error").text(JSON.stringify(status + " " + error));
            });

}
self.send = function (article) {
    var login = document.getElementById("user").value;
    var password = document.getElementById("password").value;
    var JSONObject = {
        "login": login,
        "password": password
    };
    var cook = getCookie("utilisateur");
    alert(login);

    $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/" + login + "/" + password + "",
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
                if (data != null) {

                    if (data[0].status == true) {

                        setCookie("utilisateur", login);
                        setCookie("idutil", data[0].id);
                         $('#login').modal('hide');

                    }
                    else {
                        alert("Votre compte est en attente de modération, veuillez vous reconnecter plus tard...");
                        $('#login').modal('hide');
                    }


                }
                else {
                    alert("Utilisateur inconnu, ou mauvais mot de passe");
                }


            })
            .error(function (jq, status, error) {
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

self.activate = function (utilisateur) {
    alert(utilisateur.id());
    $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/valid/" + utilisateur.id(),
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {

        



    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });

};
self.disabled = function (utilisateur) {
    $.ajax({
        url: "http://localhost:8080/Blog/resources/utilisateur.entities.users/disabled/" + utilisateur.id(),
        type: "GET",
        headers: {
            Accept: "application/json"
        }
    }).success(function (data, status, jq) {

      


    }).error(function (jq, status, error) {
        $(".error").text(JSON.stringify(status + " " + error));

    });

};
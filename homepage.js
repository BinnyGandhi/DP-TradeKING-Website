/**
 * Created by Binny Gandhi on 19-07-2016.
 */


var wrongUsernamePassword = $('#wrongUsernamePassword');
var wrongUsername = $('#wrongUsername');
var wrongPassword = $('#wrongPassword');

$(document).ready(function () {
    wrongUsernamePassword.addClass('mdl-textfield__error');
    wrongUsername.addClass('mdl-textfield__error');
    wrongPassword.addClass('mdl-textfield__error');
});

function loginValidation() {
    wrongUsernamePassword.addClass('mdl-textfield__error');
    wrongUsername.addClass('mdl-textfield__error');
    wrongPassword.addClass('mdl-textfield__error');

    var username = $('#username');
    var usernamePattern = /^\w[\w\s]*$/;

    var password = $('#password');
    var passwordPattern = /^\w{6,}$/;

    if (usernamePattern.test(username)) {
        if (passwordPattern.test(password)) {
            var userDetails = {
                username: username.val(),
                password: password.val()
            };

            $.ajax({
                url: config.baseUrl + config.api.loginUser,
                data: userDetails,
                type: 'POST',
                success: function (result, xhr, status) {
                    if (result.status === '200') {
                        localStorage.setItem('token', result.message);
                        //ToDo: page redirection
                        window.location.replace('dashboard.html');
                    }
                    else {
                        //ToDo: if result.message != '200'
                        window.alert(JSON.stringify(result, null, 2));
                        username.val('');
                        password.val('');
                        wrongUsernamePassword.removeClass('mdl-textfield__error');
                    }
                },
                error: function (xhr, status, error) {
                    //ToDo: handle error
                    window.alert(JSON.stringify(error, null, 2));
                },
                dataType: 'json'
            });
        } else {
            wrongPassword.removeClass('mdl-textfield__error');
        }
    } else {
        wrongUsername.removeClass('mdl-textfield__error');
    }
}
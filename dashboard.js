/**
 * Created by Binny Gandhi on 23-07-2016.
 */

var app = {
    template: {},
    data: {}
};

$(document).ready(function () {
    fetchAllData();
    app.currentTab = "headOffice";
    document.title = "Head Office";
    app.template.headOffice = Handlebars.compile(document.getElementById('handlebars-headoffice-template').innerHTML);
    app.template.branches = Handlebars.compile(document.getElementById('handlebars-branches-template').innerHTML);
    app.template.subBrokers = Handlebars.compile(document.getElementById('handlebars-subbrokers-template').innerHTML);
});

function mainTabHandler(tab) {
    var template;
    var data;
    switch (tab.innerText) {
        case "Head Office":
            app.currentTab = "headOffice";
            document.title = "Head Office";
            template = app.template.headOffice;
            data = app.data.headOffice;
            break;
        case "Branches":
            app.currentTab = "branches";
            document.title = "Branches";
            template = app.template.branches;
            data = app.data.branches;
            break;
        case "Sub Brokers":
            app.currentTab = "subBrokers";
            document.title = "Sub Brokers";
            template = app.template.subBrokers;
            data = app.data.subBrokers;
            break;
    }

    removeNavigationFocus(tab);
    fillData(template, data);
}

function fetchAllData() {
    $.ajax({
        url: config.baseUrl + config.api.fetchData,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function (result, xhr, status) {
            if (result.status === 200) {
                var headOffice = result.message.headOffice;
                var branches = result.message.branches;
                var subBrokers = result.message.subBrokers;

                //ToDo: Set appropriate data for head-office and branches
                app.data.headOffice = headOffice;
                app.data.branches = branches;
                app.data.subBrokers = categorizeSubBrokers(subBrokers);

                fillData(app.template.headOffice, app.data.headOffice);
            } else {
                //ToDo: Display user-friendly error
                document.alert('Error Occurring');
                console.log(JSON.stringify(result, null, 2));
            }
        },
        error: function (error, xhr, status) {
            //ToDo: Display user-friendly error
            // document.alert(JSON.stringify(error, null, 2));
            console.log(JSON.stringify(error, null, 2));
        }
    });
}

function fillData(template, data) {
    var templateData = template({message: data});
    var contentContainer = document.querySelector('.mdl-layout__content');
    var headerContainer = document.querySelector('.mdl-layout__tab-bar');

    var element = document.createElement('dp-template');
    element.innerHTML = templateData;
    var headerText = element.getElementsByTagName('dp-header')[0].innerHTML;
    var contentText = element.getElementsByTagName('dp-content')[0].innerHTML;

    headerContainer.innerHTML = headerText;
    contentContainer.innerHTML = contentText;

    var layout = document.querySelector('.mdl-js-layout');
    var tabs = document.querySelectorAll('.mdl-layout__tab');
    var panels = document.querySelectorAll('.mdl-layout__tab-panel');
    for (var i = 0; i < tabs.length; i++) {
        new MaterialLayoutTab(tabs[i], tabs, panels, layout.MaterialLayout);
    }
}

function categorizeSubBrokers(subBrokersList) {
    var alphabets = {};
    var subBrokers = [];
    for (var i in subBrokersList) {
        var alphabet = subBrokersList[i].name.charAt(0).toUpperCase();
        if (!(alphabet in alphabets)) {
            alphabets[alphabet] = subBrokers.length;
            subBrokers.push({
                alphabet: alphabet,
                subBrokers: []
            });
        }
        subBrokers[alphabets[alphabet]].subBrokers.push(subBrokersList[i]);
    }
    subBrokers.sort(function (s1, s2) {
        if (s1.alphabet < s2.alphabet) {
            return -1;
        } else if (s1.alphabet > s2.alphabet) {
            return 1;
        } else {
            return 0;
        }
    });
    return subBrokers;
}

function deleteContact(contactId) {
    var dialog = document.querySelector('.dialog-delete-' + contactId);
    var showDialogButton = document.querySelector('.delete-contact-' + contactId);
    callDialog(dialog, showDialogButton);
}

function editContact(contactId) {
    var dialog = document.querySelector('.dialog-edit-' + contactId);
    var showDialogButton = document.querySelector('.edit-contact-' + contactId);
    callDialog(dialog, showDialogButton);
}

function showHeadOfficeOptions() {
    document.getElementById('fab-options').innerHTML += document.getElementById('fab-head-office-options').innerHTML;
}

function showBranchesOptions() {
    // var element = document.getElementById('fab-branches-options').childNodes[0];
    // var buttonNode = document.getElementById('lower-right-button');
    // document.getElementById('lower-right-button').parentNode.insertBefore(element, buttonNode.nextSibling);
    // document.getElementById('fab-options').innerHTML = document.getElementById('fab-branches-options').innerHTML;
}
function showSubBrokersOptions() {
    var dialog = document.querySelector('.dialog-add-contact-for-subBroker');
    var showDialogButton = document.querySelector('.add-contact');
    callDialog(dialog, showDialogButton);
    addContactSubBroker();
}

function addContactSubBroker() {
    var name = document.getElementById('name-for-add');
    var address = document.getElementById('address-for-add');
    var contactNumber = document.getElementById('contactNumber-for-add');
    var email = document.getElementById('email-for-add');
    var regNumber = document.getElementById('regNumber-for-add');

    var data = {
        name: name,
        address: address,
        contactNumber: contactNumber,
        email: email,
        regNumber: regNumber
    };

    $.ajax({
        url: config.baseUrl + config.api.addContactSubBroker,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        data: data,
        //ToDo: if result succeeds
        success: function (result, xhr, status) {
            if (result.status === 200) {

            } else {

            }
        },
        error: function (error, xhr, status) {
            //ToDo: Display user-friendly error
            // document.alert(JSON.stringify(error, null, 2));
            console.log(JSON.stringify(error, null, 2));
        }
    })

}

function addContact() {
    switch (app.currentTab) {
        case "headOffice":
            showHeadOfficeOptions();
            break;
        case "branches":
            showBranchesOptions();
            break;
        case "subBrokers":
            showSubBrokersOptions();
            break;
    }
}

function removeNavigationFocus(tab) {
    var navigationLinks = document.querySelectorAll('.mdl-navigation__link');
    for (var i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].classList.remove('dp-navigation__focus');
    }
    tab.classList.add('dp-navigation__focus');
    $('.mdl-layout__drawer, .mdl-layout__obfuscator').removeClass('is-visible');
}

function callDialog(dialog, showDialogButton) {
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function () {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

// Function for floating label in edit dialogue
window.setTimeout(function () {
    document.querySelector('.mdl-textfield  input').value != Nan;
    document.querySelector('.mdl-textfield').MaterialTextfield.change();

}, 1000);

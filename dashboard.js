/**
 * Created by Binny Gandhi on 23-07-2016.
 */
function mainTabHandler(tab) {
    var template, data, url;

    switch (tab.innerText) {
        case "Head Office":
            document.title = "Head Office";
            template = Handlebars.compile(document.getElementById('handlebars-headoffice-template').innerHTML);
            data = headOffice.data;
            // url = 'http://192.168.1.102:8080/api/head-office';
            break;
        case "Branches":
            document.title = "Branches";
            template = Handlebars.compile(document.getElementById('handlebars-branches-template').innerHTML);
            data = branches.data;
            // url = 'http://192.168.1.102:8080/api/branches';
            break;
        case "Sub Brokers":
            document.title = "Sub Brokers";
            template = Handlebars.compile(document.getElementById('handlebars-subbrokers-template').innerHTML);
            data = subBrokers.data;
            // url = 'http://192.168.1.102:8080/api/sub-brokers';
            break;
        default:
            break;
    }

    // $.ajax({
    //     url: url,
    //     type: 'GET',
    //     crossDomain: true,
    //     dataType: JSON,
    //     success: function (result, xhr, status) {
    //         if (result.status === 200) {
    //             data = result.message;
    //         } else {
    //             document.alert('Error Occurring');
    //         }
    //     },
    //     error: function (error, xhr, status) {
    //         // document.alert(JSON.stringify(error, null, 2));
    //     }
    // });

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

function deleteContact(contactId) {
    var dialog = document.querySelector('.dialog-' + contactId);
    var showDialogButton = document.querySelector('.delete-contact-' + contactId);
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
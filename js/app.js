if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function f() { }
    f.prototype = o;
    return new f();
  };
}

function loadContacts() {
  var contacts = getEligibleContacts('^([\+0]0*2)*(01)([0-246-9]{1}|5[0-25])([0-9]{7})$');
  buildUI(contacts);
}

function getEligibleContacts(regExp) {
  var contacts = [];
  
  for (var k = 0; k < BB._allPhones.length; k++) {
    var filter = new blackberry.find.FilterExpression(BB._allPhones[k], 'REGEX', regExp);
    contacts = contacts.concat(blackberry.pim.Contact.find(filter));
  }
  return contacts;
}

function initContact(bbContact) {
  var contact = Object.create(BB.Contact);
  contact.init(bbContact);
  BB._contacts[contact.name] = contact;
  return contact;
}

function buildUI(contacts) {
  var contactsDiv = document.getElementById('contacts');

  for (var i = 0; i < contacts.length; i++) {
    var contact = initContact(contacts[i]);

    var container = document.createElement('div');
    container.className += ' container';

    var nameDiv = document.createElement('div');
    nameDiv.className += ' name';
    nameDiv.appendChild(document.createTextNode(contact.name));
    
    container.appendChild(nameDiv);

    for (var phone in contact.phones) {
      var phoneDiv = document.createElement('div');
      phoneDiv.className += ' phone';
      phoneDiv.appendChild(document.createTextNode(contact.phones[phone]));
      container.appendChild(phoneDiv);
    }
    contactsDiv.appendChild(container);
  }  
}
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

  if (contacts.length === 0) {
    var update = document.getElementById('update');
    var cancel = document.getElementById('cancel');

    update.style.display = 'none';
    cancel.style.width = '96%';
    contactsDiv.appendChild(document.createTextNode('Your numbers are already updated or no eligible numbers were found!'));
  }

  for (var i = 0; i < contacts.length; i++) {
    var contact = initContact(contacts[i]);

    var container = document.createElement('div');
    container.className += ' container';

    if (!document.getElementById(contact.id)) {
      var nameDiv = document.createElement('div');
      nameDiv.id = contact.id;
      nameDiv.className += ' name';
      nameDiv.appendChild(document.createTextNode(contact.name));
      container.appendChild(nameDiv);
    }

    for (var phoneName in contact.phones) {
      if (!document.getElementById(contact.id + contact.phones[phoneName])) {
        var phoneDiv = document.createElement('div');
        phoneDiv.id = contact.id + contact.phones[phoneName];
        phoneDiv.className += ' phone';
        phoneDiv.appendChild(createPhoneElement(contact.phones[phoneName]));
        container.appendChild(phoneDiv);
      }
    }
    contactsDiv.appendChild(container);
  }
}

function createPhoneElement(phoneNumber) {
  var matches = getNewNumberMatches(phoneNumber);
  if (!matches)
    return document.createTextNode(phoneNumber);

  matches = matches.splice(1, 4);
  
  var newNumberSpan = document.createElement('span');
  var changedNumberSpan = document.createElement('span');
  changedNumberSpan.className += ' updated-number';
  changedNumberSpan.appendChild(document.createTextNode(matches[2][0].toString()));

  if (typeof matches[0] === 'undefined')
    matches[0] = '';
  
  newNumberSpan.appendChild(document.createTextNode(matches[0] + matches[1]));
  newNumberSpan.appendChild(changedNumberSpan);
  newNumberSpan.appendChild(document.createTextNode(matches[2][1].toString() + matches[3]));
  return newNumberSpan;
}

function updateNumbers() {
  if (confirm('Are you sure you want to update these numbers?')) {
    for (var contactName in BB._contacts) {
      var contact = BB._contacts[contactName];

      for (var phoneName in contact.phones) {
        var newNumber = getNewNumber(contact.phones[phoneName]);
        if (!newNumber)
          continue;
        contact._contact[phoneName] = newNumber;
        contact._contact.save();
      }
    }
    alert('All done!');
    exit();
  }
}

function getNewNumber(oldNumber) {
  var matches = getNewNumberMatches(oldNumber);
  if (!matches) {
    return null;
  }
  return matches.splice(1, 4).join('');
}

function getNewNumberMatches(oldNumber) {
  var matches = oldNumber.match('^([\+0]0*2)*(01)([0-246-9]{1}|5[0-25])([0-9]{7})$');
  if (matches && matches[3] && matches.length === 5) {
    switch (matches[3]) {
      case "0": matches[3] = "00"; break;
      case "1": matches[3] = "11"; break;
      case "2": matches[3] = "22"; break;
      case "4": matches[3] = "14"; break;
      case "6": matches[3] = "06"; break;
      case "7": matches[3] = "27"; break;
      case "8": matches[3] = "28"; break;
      case "9": matches[3] = "09"; break;
      case "50": matches[3] = "20"; break;
      case "51": matches[3] = "01"; break;
      case "52": matches[3] = "12"; break;
      case "55": matches[3] = "15"; break;
    }
    return matches;
  }
  return null;
}

function exit() {
  blackberry.app.exit();
}

if (typeof BB === 'undefined')
  BB = {};

BB._contacts = {};

BB._allPhones = [
  'faxPhone', 'homePhone', 'homePhone2', 'mobilePhone',
  'otherPhone', 'pagerPhone', 'workPhone', 'workPhone2'
];

BB.Contact = {
  init: function (contact) {
    this._contact = contact;
    this.id = contact.firstName + contact.lastName;
    this.name = contact.firstName + ' ' + contact.lastName;
    this.phones = {};

    for (var i = 0; i < BB._allPhones.length; i++) {
      var currentPhone = BB._allPhones[i];
      if (contact[currentPhone] && /^([\+0]0*2)*(01)([0-246-9]{1}|5[0-25])([0-9]{7})$/.test(contact[currentPhone]))
        this.phones[currentPhone] = contact[currentPhone];
    }
  }
};

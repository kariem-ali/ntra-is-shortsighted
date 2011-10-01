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
    this.name = contact.firstName + ' ' + contact.lastName;
    this.phones = {};

    for (var i = 0; i < BB._allPhones.length; i++) {
      var currentPhone = BB._allPhones[i];
      if (typeof contact[currentPhone] !== 'undefined')
        this.phones[currentPhone] = contact[BB._allPhones[i]];
    }
  }
};

"use strict";

var util = require('util');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var printf = require('printf');

var Command = require('../core/command');
var MessageEvent = require('../core/messageevent');
var Account = require('../core/account');
var ANSIColor = require('../core/color');

new Command('acinfo', 'List account information', 2, (client, name, cmd) => {
  var message;

  if (typeof cmd[0] !== 'undefined') {
    // get information about specific account
    var acc = new Account(cmd[0]);

    if (acc.name !== undefined) {
      // formulate the message
      message = util.format("%s Account information:\n\t%s\n\t%s\n\t%s",
        ANSIColor.header("chatserv"),
        ANSIColor.details("Account name", acc.name),
        ANSIColor.details("Level", acc.level),
        ANSIColor.details("Last seen", moment(acc.lastSeen).fromNow()));

      // only show the knownAddresses if the client requesting the information is an admin
      if (client.account.level >= 5) {
        var knownAddresses = (acc.knownAddresses === undefined ? "N/a" : JSON.stringify(acc.knownAddresses));
        message += util.format('\n\t%s',
          ANSIColor.details("Known addresses", knownAddresses));
      }

      // send information about this account to the client
      MessageEvent.private(message).toClient(client).send();
    } else {

      // account does not exist
      message = util.format("%s Unable to get account details for %s:\n\t%sAccount does not exist", ANSIColor.header("chatserv"), ANSIColor.name(cmd[0]), ANSIColor.WHT);
      MessageEvent.private(message).toClient(client).send();

    }
  } else {
    // get information about all accounts
    var accounts = fs.readdirSync(path.join(Account.getPath(), '..'));

    const HEADER = util.format("Current chat accounts:\n%s[ %sName             %s][ %sLast login        %s][ %sAccount (Lvl)    %s]\n" +
      "%s ------------------  -------------------  ------------------",
      ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT);

    message = "";
    for (var i in accounts) {
      var account = new Account(accounts[i].replace('.json', ''));

      var lastLogin = moment(account.lastLogin);
      message += printf("  %s%-18s %s%-22s %s%-18s\n",
        ANSIColor.GRN, account.name, ANSIColor.RED, lastLogin.fromNow(), ANSIColor.GRN, util.format("%s (%s)", account.name, account.level));
    }

    MessageEvent.private(util.format(HEADER +"\n"+ message)).toClient(client).send();
  }
});

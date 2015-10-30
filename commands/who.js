"use strict";

var util = require('util');
var moment = require('moment');
var printf = require('printf');

var Server = require('../core/server');
var Command = require('../core/command');
var Commands = require('../core/commands');
var MessageEvent = require('../core/messageevent');
var ANSIColor = require('../core/color');

new Command('who', 'show who is connected', 0, (client, name, cmd) => {
  var clients = Server.getInstance().clients;
  var response = "";

  const HEADER = util.format( "%s[ %sName             %s][ %sIdle     %s][ %sAccount (Lvl)    %s][ %sRoom     %s][ %sAddress       %s][ %sVersion     %s]\n" +
    "%s ------------------  ----------  ------------------  ----------  ---------------  -------------\n",
    ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT, ANSIColor.BLU, ANSIColor.WHT);

  response += HEADER;

  for (var i in clients) {
    var c = clients[i];
    response += printf("  %s%-18s %s%-12s %s%-18s  %s%-10s  %s%-15s  %-10s\n",
      ANSIColor.GRN, c.name, ANSIColor.RED, "", ANSIColor.GRN, util.format("%s (%s)", c.name, 1), ANSIColor.CYN, c.room.name, ANSIColor.YEL, c.ip, c.version);
  }

  client.send(response, true);
});

const config = require("./config.json")
const botOwnerid = config.botowner.id.toString();
const servOwnerId = config.server.owner.id.toString();
const supportRoleID = config.server.roles.support.toString();

module.exports = {botOwnerid, servOwnerId, supportRoleID}
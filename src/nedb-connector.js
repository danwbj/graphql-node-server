var Datastore = require('nedb')
const path = require('path')
module.exports = async () => {
    const linksdb = new Datastore({
      filename: path.resolve(__dirname, './db/links.db'),
      autoload: true,
      timestampData: true
    });
    const usersdb = new Datastore({
      filename: path.resolve(__dirname, './db/users.db'),
      autoload: true,
      timestampData: true
    });
    const votesdb = new Datastore({
      filename: path.resolve(__dirname, './db/votes.db'),
      autoload: true,
      timestampData: true
    });
    return {
      links: linksdb,
      users: usersdb,
      votes: votesdb,
    };
  }
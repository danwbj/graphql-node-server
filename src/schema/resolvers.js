const pubsub = require('../pubsub');
// const links = [
//     {
//       id: 1,
//       url: 'http://graphql.org/',
//       description: 'The Best Query Language'
//     },
//     {
//       id: 2,
//       url: 'http://dev.apollodata.com',
//       description: 'Awesome GraphQL Client'
//     },
//   ];
  
let createLink = (links,data) => { 
    return new Promise((resolve, reject) => {
        links.insert(data, (err, res) => (err ? reject(err) : resolve(res)))
    })
}
module.exports = {
    Query: {
        allLinks: (_, data, { nedb: { links } }) => {
            pubsub.publish('Link', {Link: "查询了link列表"});
        return new Promise((resolve, reject) => {
            links.find({}, (err, res) => (err ? reject(err) : resolve(res)))
        })
    },
    },

    Mutation: {
        createLink: async (_, data, { nedb: { links } }) => {
            let newLink = await createLink(links,data)
            pubsub.publish('Link', {Link: {mutation: 'CREATED', node: newLink}});
            return newLink
        },
        createUser: (_, data, { nedb: { users } }) => {
            const newUser = {
                name: data.name,
                email: data.authProvider.email.email,
                password: data.authProvider.email.password,
            };
            return new Promise((resolve, reject) => {
                users.insert(newUser, (err, res) => (err ? reject(err) : resolve(res)))
            })
        },
        createVote: (_, data, { nedb: { votes } }) => {
            const newVote = {
                userId: data.userId,
                linkId: data.linkId,
              };
            return new Promise((resolve, reject) => {
                votes.insert(newVote, (err, res) => (err ? reject(err) : resolve(res)))
            })
        }
    }, 
    Subscription: {
        Link: {
          subscribe: () => pubsub.asyncIterator('Link'),
        },
      },
    Link: {
        id: root => root._id || root.id, // 5
        postedBy: ({ postedById }, data, { nedb: { users } }) => {
            return new Promise((resolve, reject) => {
                users.findOne({ _id: postedById }).exec((err, res) => (err ? reject(err) : resolve(res)));
            })
        }, 
        votes: ({ _id }, data, { nedb: { votes } }) => {
            return new Promise((resolve, reject) => {
                votes.find({ linkId: _id }).exec((err, res) => (err ? reject(err) : resolve(res)));
            })
        },
    },
    User: {
        id: root => root._id || root.id, // 5
    },
    Vote: {
        id: root => root._id || root.id, // 5
        user: ({ userId }, data, { nedb: { users } }) => {
            return new Promise((resolve, reject) => {
                users.findOne({ _id: userId }).exec((err, res) => (err ? reject(err) : resolve(res)));
            })
        }, 
        link: ({ linkId }, data, { nedb: { links } }) => {
            return new Promise((resolve, reject) => {
                links.findOne({ _id: linkId }).exec((err, res) => (err ? reject(err) : resolve(res)));
            })
        }, 
    },

  };
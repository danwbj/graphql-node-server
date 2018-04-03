const express = require('express');

// bodyParser 包用来自动解析请求中的 JSON 数据。
const bodyParser = require('body-parser');

// apollo-server-express 包将根据模式来处理 GraphQL 服务器的请求并返回响应。
const {graphqlExpress,graphiqlExpress} = require('apollo-server-express');

const schema = require('./schema');

// 1
const connectNedb = require('./nedb-connector');

// 2
const start = async () => {
  // 3
  const nedb = await connectNedb();
  var app = express();
  const buildOptions = async (req, res) => {
      return {
        context: {
          nedb,
        },
        schema,
      };
    };
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));
  app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
  }));

  const PORT = 3000;
  app.listen(PORT, () => {
      console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });
};

// 5
start();

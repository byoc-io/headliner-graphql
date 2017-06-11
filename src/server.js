import argv from 'yargs';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import morgan from 'morgan';

import config from './config';
import logger from './logger';

import { Elasticsearch } from './api/connectors/elasticsearch';
import { Posts } from './api/models/posts';
import schema from './api/schema';

const PORT = argv.port || process.env.PORT || 3000;

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// CORS
const corsOptions = {
  methods: ['POST']
};

// Elasticsearch Connector
const esHost = config.services.es.host;
logger.info(`Initializing Elasticsearch connector: ${esHost}`);
const elasticsearch = new Elasticsearch({
  host: esHost
});

// Models
const posts = new Posts({
  connector: elasticsearch
});


// Endpoints
app.use('/graphql', cors(corsOptions), graphqlExpress((req) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/
  // 3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  return {
    schema,
    context: {
      posts
    }
  };
}));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use('/', (req, res) => {
  res.redirect('/graphiql');
});


// Start Server
app.listen(PORT, () => {
  /* eslint-disable no-console */
  logger.info(`Headliner API Server is now running on http://localhost:${PORT}`);
});

module.exports = app;

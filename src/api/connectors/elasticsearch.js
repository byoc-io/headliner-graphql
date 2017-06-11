import rp from 'request-promise';
import DataLoader from 'dataloader';

const eTagCache = {};

export class Elasticsearch {
  static USER_AGENT = 'Headliner/1.0 (BYOC; Backend Sync; en-us)';

  constructor({ host } = {}) {
    this.host = host;
    this.rp = rp;

    this.loader = new DataLoader(this.fetch.bind(this), {
      batch: false
    });
  }

  fetch(urls) {
    const options = {
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'user-agent': this.userAgent
      }
    };

    return Promise.all(urls.map((url) => {
      const cachedRes = eTagCache[url];

      if (cachedRes && cachedRes.eTag) {
        options.headers['If-None-Match'] = cachedRes.eTag;
      }

      /* eslint-disable no-console */
      console.log('Fetching', url, ...options);

      return new Promise((resolve, reject) => {
        this.rp({
          uri: url,
          ...options
        }).then((response) => {
          resolve(response.body);
        }).catch((err) => {
          if (err.statusCode === 304) {
            resolve(cachedRes.result);
          } else {
            reject(err);
          }
        });
      });
    }));
  }

  get userAgent() {
    return Elasticsearch.USER_AGENT;
  }

  get(path) {
    return this.loader.load(this.host + path);
  }
}

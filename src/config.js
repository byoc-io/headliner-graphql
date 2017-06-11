import path from 'path';
import everyconfig from 'everyconfig';

const config = everyconfig(path.join(__dirname, '..', 'config'));

// override services from environment variables
Object.keys(process.env).forEach((key) => {
  if (key.indexOf('_') > 0) {
    const vals = key.split('_');
    if (vals.length === 2 && !!config.services[vals[0]]) {
      config.services[vals[0]][vals[1]] = process.env[key];
    }
  }
});

export default config;

const app = require('./server');
const config = require('./config');

const port = config.PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`=>> App listen on ${port}`);
});

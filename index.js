import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('This is Backend for the Faculty Information System');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
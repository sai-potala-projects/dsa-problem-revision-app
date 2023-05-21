import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import dsaProblemRouter from './routers/dsaProblemRouter';
import userRouter from './routers/userRouter';
const cors = require('cors');

dotenv.config();

const mongoDbUrI = process.env.MONGODB_URI ?? '';

mongoose
  .connect(mongoDbUrI)
  .then(() => {
    console.log('---connected to MongoDB---');
  })
  .catch((err: any) => {
    console.log('mongo db connection error :', err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 5000;

app.listen(port, (err?: any) => {
  if (err) {
    throw err;
  }
  console.log(`server started on : ${port}`);
});

app.get('/', (req: any, res: any) => {
  res.send('healthy');
});

app.get('/ping', (req: any, res: any) => {
  res.send('pong....');
});

app.use('/api/users', userRouter);
app.use('/api/problems', dsaProblemRouter);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).send({ error: err.message });
});

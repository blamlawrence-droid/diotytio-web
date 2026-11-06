import 'dotenv/config';
import { createApp } from './index.js';
const { app } = createApp();
const port = Number(process.env.PORT || 3001);
app.listen(port, '127.0.0.1', () => console.log(`API locale : http://localhost:${port}`));

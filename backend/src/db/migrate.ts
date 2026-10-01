import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';
const dir = path.dirname(fileURLToPath(import.meta.url));
const sql = await fs.readFile(path.join(dir,'schema.sql'),'utf8');
await pool.query(sql);
await pool.end();
console.log('Database schema ready');

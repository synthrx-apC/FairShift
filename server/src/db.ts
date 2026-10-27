import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const dbPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../fairshift.sqlite');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS receipts(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,site_id TEXT NOT NULL,type TEXT NOT NULL,method TEXT NOT NULL,created_at TEXT NOT NULL,signature_status TEXT NOT NULL DEFAULT 'demo-signed',hash TEXT,nonce TEXT,device_sig TEXT,server_sig TEXT,prev_hash TEXT,coarse_geo TEXT);
CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT,site_id TEXT NOT NULL,category TEXT NOT NULL,severity INTEGER NOT NULL,zone TEXT NOT NULL,summary TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Open',pseudonym TEXT NOT NULL,created_at TEXT NOT NULL,language TEXT DEFAULT 'English',cluster_id INTEGER);
CREATE TABLE IF NOT EXISTS ledger(id INTEGER PRIMARY KEY AUTOINCREMENT,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,payload_hash TEXT NOT NULL,prev_hash TEXT NOT NULL,hash TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,org_id TEXT NOT NULL,site_id TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('worker','supervisor','manager','owner','auditor')),display_name TEXT NOT NULL,phone TEXT UNIQUE,email TEXT UNIQUE,password_hash TEXT,pin_hash TEXT,language TEXT NOT NULL DEFAULT 'English',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS auth_sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS device_keys(worker_id TEXT PRIMARY KEY,public_key TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS used_nonces(nonce TEXT PRIMARY KEY,worker_id TEXT NOT NULL,used_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS shift_schedules(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,site_id TEXT NOT NULL,start_at TEXT NOT NULL,end_at TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'day');
CREATE TABLE IF NOT EXISTS roster_proposals(id INTEGER PRIMARY KEY AUTOINCREMENT,site_id TEXT NOT NULL,team TEXT NOT NULL,proposal_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Proposed',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS source_watches(id INTEGER PRIMARY KEY AUTOINCREMENT,source_url TEXT NOT NULL,last_hash TEXT,status TEXT NOT NULL DEFAULT 'Pending review',last_checked TEXT);
CREATE TABLE IF NOT EXISTS worker_confirmations(id INTEGER PRIMARY KEY AUTOINCREMENT,report_id INTEGER NOT NULL,worker_id TEXT NOT NULL,confirmed INTEGER NOT NULL,created_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS payslips(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,period TEXT NOT NULL,base REAL NOT NULL,overtime_hours REAL NOT NULL,overtime_amount REAL NOT NULL,deductions REAL NOT NULL,paid_amount REAL NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS disputes(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,payslip_id INTEGER,reason TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Open',created_at TEXT NOT NULL,resolution TEXT);
CREATE TABLE IF NOT EXISTS feedback(id INTEGER PRIMARY KEY AUTOINCREMENT,site_id TEXT NOT NULL,team_tag TEXT NOT NULL,rating INTEGER NOT NULL,comment TEXT,pseudonym TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tickets(id INTEGER PRIMARY KEY AUTOINCREMENT,report_id INTEGER NOT NULL,status TEXT NOT NULL,assignee TEXT,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS notices(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,body TEXT NOT NULL,created_at TEXT NOT NULL,simulated INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS swaps(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,requested_date TEXT NOT NULL,kind TEXT NOT NULL,reason TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Pending',decision_reason TEXT,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sos_events(id INTEGER PRIMARY KEY AUTOINCREMENT,site_id TEXT NOT NULL,worker_id TEXT NOT NULL,zone TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Active',created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS certifications(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,name TEXT NOT NULL,expires_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Active');
CREATE TABLE IF NOT EXISTS contractors(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,worker_group TEXT NOT NULL,amount_due REAL NOT NULL,amount_paid REAL NOT NULL,due_date TEXT NOT NULL,paid_date TEXT);
CREATE TABLE IF NOT EXISTS skills(id INTEGER PRIMARY KEY AUTOINCREMENT,worker_id TEXT NOT NULL,name TEXT NOT NULL,issuer TEXT NOT NULL,issued_at TEXT NOT NULL,expires_at TEXT,signature TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rule_packs(id INTEGER PRIMARY KEY AUTOINCREMENT,sector TEXT NOT NULL,version TEXT NOT NULL,status TEXT NOT NULL,verified INTEGER NOT NULL DEFAULT 0,as_of TEXT NOT NULL,json TEXT NOT NULL,source TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS agent_runs(id INTEGER PRIMARY KEY AUTOINCREMENT,agent TEXT NOT NULL,mode TEXT NOT NULL,input_hash TEXT NOT NULL,output TEXT NOT NULL,validation_result TEXT NOT NULL,latency_ms INTEGER NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS cases(id INTEGER PRIMARY KEY AUTOINCREMENT,site_id TEXT NOT NULL,category TEXT NOT NULL,summary TEXT NOT NULL,severity INTEGER NOT NULL,report_count INTEGER NOT NULL,distinct_reporters INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'Open',created_at TEXT NOT NULL);
`);
// Safe additive migrations for databases created by earlier prototype versions.
const ensureColumn = (table:string, column:string, declaration:string) => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{name:string}>;
  if (!columns.some(c => c.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${declaration}`);
};
for (const [column, declaration] of [['nonce','TEXT'],['device_sig','TEXT'],['server_sig','TEXT'],['prev_hash','TEXT'],['coarse_geo','TEXT']] as const) ensureColumn('receipts', column, declaration);
export function now(){return new Date().toISOString()}
export function addLedger(entityType:string,entityId:string,payload:string){const last=db.prepare('SELECT hash FROM ledger ORDER BY id DESC LIMIT 1').get() as {hash:string}|undefined;const prev=last?.hash||'GENESIS';const payloadHash=createHash('sha256').update(payload).digest('hex');const hash=createHash('sha256').update(prev+'|'+entityType+'|'+entityId+'|'+payloadHash).digest('hex');db.prepare('INSERT INTO ledger(entity_type,entity_id,payload_hash,prev_hash,hash,created_at) VALUES(?,?,?,?,?,?)').run(entityType,entityId,payloadHash,prev,hash,now());return hash}
export function setting(key:string,fallback:string){return (db.prepare('SELECT value FROM settings WHERE key=?').get(key) as any)?.value??fallback}
export function setSetting(key:string,value:string){db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,value)}

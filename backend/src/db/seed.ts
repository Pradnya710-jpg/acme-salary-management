import { pool } from './pool.js';
import bcrypt from "bcrypt";

const countries=[['India','INR'],['United States','USD'],['United Kingdom','GBP'],['Germany','EUR'],['Canada','CAD'],['Australia','AUD'],['Singapore','SGD'],['United Arab Emirates','AED']];
const departments=['Engineering','Product','Finance','HR','Sales','Marketing','Operations'];
const titles=['Software Engineer','Senior Software Engineer','Product Manager','Financial Analyst','HR Specialist','Sales Manager','Operations Manager'];
const firstNames=['Aarav','Priya','Rahul','Ananya','John','Emily','Daniel','Sofia','Liam','Olivia','Noah','Maya'];
const lastNames=['Sharma','Patel','Smith','Johnson','Brown','Williams','Miller','Davis','Wilson','Taylor','Anderson','Thomas'];
const client=await pool.connect();
try{
 await client.query('BEGIN');

 const hrPasswordHash = await bcrypt.hash("HR@12345", 10);
const employeePasswordHash = await bcrypt.hash("Employee@123", 10);

await client.query(
  `
  INSERT INTO users (name, email, password_hash, role)
  VALUES
    ($1, $2, $3, $4),
    ($5, $6, $7, $8)
  ON CONFLICT (email) DO NOTHING
  `,
  [
    "HR Manager",
    "hr@acme.com",
    hrPasswordHash,
    "HR_ADMIN",

    "John Employee",
    "employee@acme.com",
    employeePasswordHash,
    "EMPLOYEE",
  ]
);
 await client.query('TRUNCATE salaries, employees RESTART IDENTITY CASCADE');
 for(let start=0; start<10000; start+=500){
   const values:string[]=[]; const placeholders:string[]=[];
   for(let i=start;i<Math.min(start+500,10000);i++){
     const n=i+1, country=countries[i%countries.length], dept=departments[i%departments.length];
     const first=firstNames[i%firstNames.length], last=lastNames[(i*3)%lastNames.length];
     const code=`EMP${String(n).padStart(5,'0')}`;
     const email=`employee${n}@acme.example`;
     placeholders.push(`($${values.length+1},$${values.length+2},$${values.length+3},$${values.length+4},$${values.length+5},$${values.length+6},$${values.length+7})`);
     values.push(code,first,last,email,country[0],dept,titles[i%titles.length]);
   }
   const result=await client.query(`INSERT INTO employees(employee_code,first_name,last_name,email,country,department,job_title) VALUES ${placeholders.join(',')} RETURNING id`,values);
   const salaryValues:string[]=[]; const salaryPH:string[]=[];
   result.rows.forEach((r:any,j:number)=>{
     const idx=start+j, currency=countries[idx%countries.length][1];
     const base=[900000,85000,65000,65000,70000,80000,75000,180000][idx%8];
     const amount=base + (idx%7)*5000;
     salaryPH.push(`($${salaryValues.length+1},$${salaryValues.length+2},$${salaryValues.length+3},$${salaryValues.length+4})`);
     salaryValues.push(String(r.id),String(amount),currency,'2026-01-01');
   });
   await client.query(`INSERT INTO salaries(employee_id,amount,currency,effective_from) VALUES ${salaryPH.join(',')}`,salaryValues);
 }
 await client.query('COMMIT');
 console.log('Seeded 10,000 employees');
 console.log("Users seeded")
}catch(e){await client.query('ROLLBACK'); throw e}finally{client.release();await pool.end()}

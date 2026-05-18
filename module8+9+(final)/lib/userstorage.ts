/* eslint-disable @typescript-eslint/no-explicit-any */


import fs from 'fs';
import path from 'path';


const filePath = path.join(process.cwd(), 'data', 'users.json');


if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}


export const getUsers = () => {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
};


export const userExists = (email: string) => {
  const users = getUsers();
  return users.some((user: any) => user.email === email);
};

export const addUser = (email: string, password: string, role: string) => {
  const users = getUsers();
  
  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: password, 
    role: role, 
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  
  
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return newUser;
};
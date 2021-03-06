const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

//knex connect database and server
const psql = knex({
  client: 'pg',
  connection: {
  	connectionString: process.env.DATABASE_URL,
  	ssl: { rejectUnauthorized: false }
  }
});

const register = require('./controller/register');
const login = require('./controller/login');
const profile = require('./controller/profile');
const changepassword = require('./controller/changepassword');

psql.select('*'). from('users').then(data => {
	console.log(data);
});

const app = express();
 

app.use(bodyParser.json());
app.use(cors());
app.get('/',(req,res)=>{res.send(/*database.users*/'its working!')})
app.post('/login', (req, res) => { login.handleSignin(req, res, psql, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, psql , bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, psql) })
app.post('/changepassword', (req, res) => { changepassword.handleChangePassword(req, res, psql, bcrypt) })



app.listen(process.env.PORT || 3000, ()=>{
	console.log(`app is running in port ${process.env.PORT} `);
})

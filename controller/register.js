const handleRegister = (req, res, psql, bcrypt) => {

	const { userName, email, password }=req.body;
	if(!email||!userName||!password){
		return res.status(400).json('incorrect form submission');
	}
	const saltRounds = 10; // use for hashing
	const hash = bcrypt.hashSync(password, saltRounds);

	// transaction available in knex which allow transactiob
	// between two table users and login
	psql.transaction(trx =>{
		trx.insert({
			hash: hash,
			email:  email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {

			return trx('users')
				.returning('*')
				.insert({
					name: userName,
					email:  loginEmail[0],
					joined:   new Date()

				})
				.then(user =>{
					res.json(user[0]); 
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err =>res.status(400).json("unable to register"))	
}
module.exports = {
	handleRegister: handleRegister
};	
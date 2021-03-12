
const handleChangePassword = (req, res, psql, bcrypt) => {

	const{ email, originalpassword, newpassword } = req.body;
	if(!email||!originalpassword||!newpassword){
		return res.status(400).json('incorrect form submission');
	}

	const saltRounds = 10; // use for hashing
	const hashed_new_password =  bcrypt.hashSync( newpassword, saltRounds);

	psql.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.originalpassword, data[0].hash);
		if(isValid) {
			psql('login')
			.where('email', '=', req.body.email)
			.update({
				hash: hashed_new_password
			})
			.then(() => {

				res.status(200).json({message:'updated'})
			})

		} else {
			res.status(400).json('wrong ')
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleChangePassword:handleChangePassword
};
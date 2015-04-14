var mongoose = require("mongoose"),
	bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
	local : {
		email : String,
		password : String,
		username: String,
		password: String,
		firstName: String,
		lastName: String,
		verifyString: String,
		dateCreated: { type : Date, default: Date.now },
	},
	google : {
		email : String,
		name : String,
		token : String,
		id : String,
		emailVerified : Boolean
	}
})

// making a hash from a password
userSchema.methods.makeHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking password
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);

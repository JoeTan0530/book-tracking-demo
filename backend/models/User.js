const mongoose = require('mongoose');
const { 
    generateReturnObj 
} = require('./utilities/general');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'disabled'],
        default: 'active'
    },
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

userSchema.statics.registerUsers = async function(params) {
	const paramData = params;

	const checkEmailRes = await this.checkUserExistByEmail(paramData);

	if (checkEmailRes && checkEmailRes.length > 0) {
		return "Email already taken.";
	} 

	this.name = paramData['name'];
	this.email = paramData['email'];
	this.password = paramData['password'];
	this.status = 'active';

	this.save();

	return generateReturnObj("Success", 0, "", "Successfully registered account, please use registered credentials to login.");
}

userSchema.statics.checkUserExistByEmail = function(params) {
	const inputVal = params;

	return this.find({email: inputVal['email']});
}

userSchema.statics.memberLogin = async function(params) {
	const paramData = params;

	if (!params['username'] || params['username'] == "") {
		return generateReturnObj("Error", 1, "", "Please input email address.");
	}

	if (!params['password'] || params['password'] == "") {
		return generateReturnObj("Error", 1, "", "Please input password.");
	}

	const userRes = await this.find({email: paramData['username']}, "email password");

	if (userRes && userRes.length > 0) {
		const userData = userRes[0];

		if (userData['password'] && userData['password'] == paramData['password']) {
			return generateReturnObj("Success", 0, "", "Successfully logged in.");
		}
	}

	return generateReturnObj("Error", 1, "", "Invalid login credentials.");
}

module.exports = mongoose.model('Users', userSchema);
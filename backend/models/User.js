const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

	// Validate input params
	const checkEmailRes = await this.checkUserExistByEmail(paramData);

	if (checkEmailRes && checkEmailRes.length > 0) {
		return "Email already taken.";
	} 

	// Generate salt
	const saltRounds = Number(process.env.PASSWORD_SALT);
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
    encryptedPassword = await bcrypt.hash(paramData['password'], salt);

	// Began setup data for DB entry
	const newUser = new this({
		name: paramData['name'],
		email: paramData['email'],
		password: encryptedPassword,
		status: "active"
	});

	// Save the document instance to DB
	await newUser.save();

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

		const isPasswordValid = await userData.comparePassword(paramData['password']);
  
		if (isPasswordValid && !isPasswordValid['status']) {
		    return generateReturnObj("Success", 0, "", "Successfully logged in.");
		} else {
			return isPasswordValid;
		}
	}

	return generateReturnObj("Error", 1, "", "Invalid login credentials.");
}

// Method to compare password
userSchema.methods.comparePassword = async function(inputPassword) {
	 try {
	    return await bcrypt.compare(inputPassword, this.password);
	} catch (error) {
	    throw generateReturnObj("Error", 1, "", "Password verification failed.");
	}
};

module.exports = mongoose.model('Users', userSchema);
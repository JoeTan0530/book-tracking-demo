const generateReturnObj = (type, returnCode, dataReturn = "", statusMsg = "") => {
	let tempObj = {
		status: "",
		code: 0,
		data: "",
		statusMsg: ""
	}

	if (type == "Success") {
		tempObj = {
			status: "Ok",
			code: returnCode,
			data: dataReturn,
			statusMsg: statusMsg
		}
	} else if (type == "Error") {
		tempObj = {
			status: "Error",
			code:  returnCode ? returnCode : 1,
			data: dataReturn,
			statusMsg: statusMsg
		}
	}

	return tempObj;
}

// Export all functions
module.exports = {
    generateReturnObj
};
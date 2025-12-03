const mongoose = require('mongoose');
const { 
    generateReturnObj 
} = require('./utilities/general');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    author: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['want_to_read', 'reading', 'read'],
        default: 'want_to_read'
    },
    client_id: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

bookSchema.statics.getBookList = async function(params) {
    const paramData = params;

    const bookListRes = this.find({client_id: paramData['userID']}, "title description author status");

    if (bookListRes && bookListRes.length > 0) {
        return generateReturnObj("Success", 0, bookListRes);
    } else {
        return generateReturnObj("Success", 0, "", "No results found.");
    }
}

bookSchema.statics.addBookItem = async function(params) {
    const paramData = params;

    let tempSubmissionObj = {};

    const requiredFieldArr = {
        title: "Please enter title",
        author: "Please enter author",
    };

    if (param) {
        
    }
}

module.exports = mongoose.model('Books', bookSchema);
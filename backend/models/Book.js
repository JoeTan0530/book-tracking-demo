const mongoose = require('mongoose');
const { 
    generateReturnObj,
    verifyAndFindByID
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
        type: String,
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

bookSchema.statics.getBookItem = async function(params) {
    const paramData = params;

    if (paramData) {
        if (paramData['bookID']) {
            // Checked id format to be valid before doing anything else.
            const verifiedFormatID = verifyAndFindByID(paramData['bookID'], "Invalid book ID format.");

            if (verifiedFormatID['status'] && verifiedFormatID['status'] == "Error") {
                return verifiedFormatID;
            }

            const bookItem = this.findById(verifiedFormatID);

            if (bookItem) {
                return generateReturnObj("Success", 0, bookItem, "");
            } else {
                return generateReturnObj("Error", 1, "", "Unable to retrieve book item.");
            }

        } else {
            return generateReturnObj("Error", 1, "", "Invalid book ID.");
        }
    } else {
        return generateReturnObj("Error", 1, "", "Invalid params.");
    }
}

bookSchema.statics.addBookItem = async function(params) {
    const paramData = params;

    const requiredFieldArr = {
        title: "Please enter title",
        author: "Please enter author",
        clientID: "Invalid client ID"
    };

    if (paramData) {
        // Validate input params
        for (let fieldKey in requiredFieldArr) {
            let tempData = paramData[fieldKey];

            if (!tempData || tempData == "") {
                return generateReturnObj("Error", 1, "", requiredFieldArr[fieldKey]);
            }
        }

        // Began setup data for DB entry
        const newBook = new this({
            title: paramData['title'],
            author: paramData['author'],
            description: paramData['description'],
            status: paramData['status'],
            client_id: paramData['clientID']
        });

        // Save the document instance to DB
        await newBook.save();

        return generateReturnObj("Success", 0, "", "Successfully added a book item.");
    } else {
        return generateReturnObj("Error", 1, "", "Invalid params.");
    }
}

bookSchema.statics.editBookItem = async function(params) {
    const paramData = params;

    const requiredFieldArr = {
        title: "Please enter title",
        author: "Please enter author",
    };

    if (paramData) {
        if (paramData['bookID']) {
            // Checked id format to be valid before doing anything else.
            const verifiedFormatID = verifyAndFindByID(paramData['bookID'], "Invalid book ID format.");

            if (verifiedFormatID['status'] && verifiedFormatID['status'] == "Error") {
                return verifiedFormatID;
            }

            // Get book document
            const book = await this.findById(verifiedFormatID);

            if (book) {
                // Validate input params
                for (let fieldKey in requiredFieldArr) {
                    let tempData = paramData[fieldKey];

                    if (!tempData || tempData == "") {
                        return generateReturnObj("Error", 1, "", requiredFieldArr[fieldKey]);
                    }
                }

                const statusList = this.getStatusList(true);

                if (statusList) {
                    let verifiedStatus = false;

                    for (const statusVal of statusList) {
                        if (statusVal['value'] === paramData['status']) {
                            verifiedStatus = true;
                            break;
                        }
                    }

                    if (!verifiedStatus) {
                        return generateReturnObj("Error", 1, "", "Invalid status.");
                    }
                }

                // Set new input into the document.
                book.title = paramData['title'];
                book.author = paramData['author'];
                book.description = paramData['description'];
                book.status = paramData['status'];

                // Update the new values into the document
                await book.save();

                return generateReturnObj("Success", 0, "", "Successfully updated a book item.");
            } else {
                return generateReturnObj("Error", 1, "", "Unable to retrieve book item.");
            }

        } else {
            return generateReturnObj("Error", 1, "", "Invalid book ID.");
        }
    } else {
        return generateReturnObj("Error", 1, "", "Invalid params.");
    }
}

bookSchema.statics.getStatusList = function(internalUse = false) {
    const statusList = [
        {
            label: "Want to read",
            value: "want_to_read"
        },
        {
            label: "Reading",
            value: "reading"
        },
        {
            label: "Read",
            value: "read"
        }
    ];

    if (internalUse) {
        return statusList;
    } else {
        return generateReturnObj("Success", 0, statusList, "");
    }
}

bookSchema.statics.removeBookItem = async function(params) {
    const paramData = params;

    if (paramData) {
        if (paramData['bookID']) {
            // Checked id format to be valid before doing anything else.
            const verifiedFormatID = verifyAndFindByID(paramData['bookID'], "Invalid book ID format.");

            if (verifiedFormatID['status'] && verifiedFormatID['status'] == "Error") {
                return verifiedFormatID;
            }

            const deletedItem = await this.findByIdAndDelete(verifiedFormatID);

            if (deletedItem) {
                return generateReturnObj("Success", 0, "", "Successfully deleted a book item.");
            } else {
                return generateReturnObj("Error", 1, "", "Deletion failed, unable to delete book item.");
            }
            
        }
    } else {
        return generateReturnObj("Error", 1, "", "Invalid params.");
    }
}

module.exports = mongoose.model('Books', bookSchema);
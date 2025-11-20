const mongoose = require("mongoose");
const FormResponseDataSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    form_id: {
        type: String,
        required: true
    },
    form_response: {
        type: String,
        required: true
    },
    ip_address: {
        type: String
    },
    user_agent: {
        type: String,
    }

},
    {
        timestamps: true
    },
    {
        collection: "FormResponseData"
    }
);



module.exports = mongoose.model("FormResponseData", FormResponseDataSchema);
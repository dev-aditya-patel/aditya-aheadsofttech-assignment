const mongoose = require("mongoose");
const DynamicFormRawSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    raw_form_data: {
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
        collection: "DynamicFormRaw"
    }
);



module.exports = mongoose.model("DynamicFormRaw", DynamicFormRawSchema);
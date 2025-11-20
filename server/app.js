require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const { validateDynamicInputs, validateDynamicFormWithSchema } = require("./_helpers/__helpers");
const DynamicFormRaw = require("./models/DynamicFormRaw");
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const multer = require("multer");
const fs = require("fs");
const FormResponseData = require("./models/FormResponseData");
const auth = require("./config/auth");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use((req, res, next) => {
    req.body = mongoSanitize.sanitize(req.body);
    next();
});

app.use("/", express.static(path.join(__dirname, "public")));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/"); 
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});
const uploadFiles = upload.any();

mongoose.connection.once("open", () => {
    console.log("Databse connted")
    app.listen(PORT, (req, res) => { console.log(`server running on port: ${PORT}`) })
});

mongoose.connection.on("error", err => {
    console.log("err:", err)

})
app.get('/', (req, res) => {
    res.status(200).json({
        "message": "hello from main"
    });
})

app.get("/admin/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const form = await DynamicFormRaw.findById(id).lean(); 
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        form.raw_form_data = JSON.parse(form.raw_form_data);
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(200).json(
            {
                data: form,
                token: "Bearer " + token
            });
    } catch (error) {
        console.error("Get Single Form Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

app.delete("/admin/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await DynamicFormRaw.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Form not found" });
        }
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(200).json({ message: "Form deleted successfully", token: "Bearer " + token });
    } catch (error) {
        console.error("Delete Form Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
})
app.patch("/admin/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, raw_form_data } = req.body;

        if (!raw_form_data && !title && !description) {
            return res.status(400).json({ message: "raw_form_data is required" });
        }

        const errors = validateDynamicInputs(raw_form_data);
        if (errors.length > 0) {
            return res.status(400).json({
                message: "There is some issue with your field",
                errors,
            });
        }

        const updateObj = {
            raw_form_data: JSON.stringify(raw_form_data),
            title: title,
            description: description

        };

        const updated = await DynamicFormRaw.findByIdAndUpdate(id, updateObj, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Form not found" });
        }
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(200).json({
            message: "Form updated successfully",
            data: updated,
            token: "Bearer " + token
        });
    } catch (error) {
        console.error("Update Form Error:", error);
        return res.status(500).json({ message: "Server error" });
    }

})
app.get("/admin", auth, async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        let filter = {};

        if (search.trim() !== "") {
            filter = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            };
        }
        let rawForms = await DynamicFormRaw.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        rawForms = rawForms.map((form) => {
            return {
                ...form.toObject(),
                raw_form_data: JSON.parse(form.raw_form_data),
            };
        });
        const total = await DynamicFormRaw.find(filter).countDocuments();
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(200).json({
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            data: rawForms,
            token: "Bearer " + token
        });
    } catch (error) {
        console.error("Error saving form:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
})
app.get("/users", async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        let filter = {};

        if (search.trim() !== "") {
            filter = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            };
        }
        let rawForms = await DynamicFormRaw.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        rawForms = rawForms.map((form) => {
            return {
                ...form.toObject(),
                raw_form_data: JSON.parse(form.raw_form_data),
            };
        });
        const total = await DynamicFormRaw.countDocuments();
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(200).json({
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            data: rawForms,
            token: "Bearer " + token
        });
    } catch (error) {
        console.error("Error saving form:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
})
app.post('/admin/form-create', auth, async (req, res) => {
    try {
        const { title, description, raw_form_data } = req.body;

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];
        if (!raw_form_data && !title && !description) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const errors = validateDynamicInputs(raw_form_data)
        if (errors?.length > 0) {
            return res.status(400).json({
                message: "There is some issue with your field, Please check and submit again",
                errors: errors
            });
        }
        const rawFormDataObj = { title: title, description: description, raw_form_data: JSON.stringify(raw_form_data), ip_address: ip, user_agent: userAgent };
        const dynamicFormRawData = await DynamicFormRaw.create(rawFormDataObj);
        if (!dynamicFormRawData) {
            return res.status(400).json({ message: "Error in submission." });
        }
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(201).json({ message: "form submitted.", data: dynamicFormRawData, token: "Bearer " + token });
    } catch (error) {
        console.error("Error saving form:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
})
app.post("/submit-form", auth, uploadFiles, async (req, res) => {
    try {
        const { id } = req.body;
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];
        const form = await DynamicFormRaw.findById(id).lean();

        if (!form) {
            deleteUploadedFiles(req.files);
            return res.status(404).json({ message: "Form not found" });
        }

        let schema;
        try {
            schema = JSON.parse(form.raw_form_data);
        } catch (e) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: "Invalid schema JSON" });
        }

        const filesMap = {};
        req.files.forEach(f => filesMap[f.fieldname] = f);

        const result = validateDynamicFormWithSchema(schema, req.body, filesMap);

        if (!result.isValid) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({
                message: "There is some issue with your field, Please check and submit again",
                success: false,
                errors: result.errors
            });
        }

        let finalData = { ...req.body };
        req.files.forEach(file => {
            finalData[file.fieldname] = file.filename;
        });

        const formSubmitDataObj = { form_id: id, form_response: JSON.stringify(finalData), ip_address: ip, user_agent: userAgent };
        const dynamicFormSubmittedData = await FormResponseData.create(formSubmitDataObj);
        if (!dynamicFormSubmittedData) {
            return res.status(400).json({ message: "Error in submission." });
        }
        const token = jwt.sign(
            { userId: "adity_123", email: "adty@gwe.com" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(201).json({ message: "Form submitted.", data: dynamicFormSubmittedData, token: "Bearer " + token });
    } catch (error) {
        deleteUploadedFiles(req.files);
        res.status(500).json({ message: "Server error" });
    }

});






function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: "Multer Error",
            error: err.message
        });
    } else if (err) {
        return res.status(500).json({
            success: false,
            message: "Unknown Upload Error",
            error: err.message
        });
    }
    next();
}

function deleteUploadedFiles(files) {
    if (!files) return;
    files.forEach(file => {
        try {
            fs.unlinkSync(file.path);
        } catch (e) {
            console.log("Failed to delete:", file.path);
        }
    });
}

function getMulterErrorMessage(err) {
    switch (err.code) {
        case "LIMIT_FILE_SIZE":
            return "File size is too large. Max allowed is 2MB";

        case "LIMIT_UNEXPECTED_FILE":
            return `Unexpected file field: ${err.field}`;

        case "LIMIT_FILE_COUNT":
            return `Too many files uploaded`;

        default:
            return err.message || "File upload failed";
    }
}

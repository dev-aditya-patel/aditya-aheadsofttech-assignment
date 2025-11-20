export const inputDataRaw =
{
    "text": {
        "type": "text",
        "label": "",
        "name": "",
        "required": false,
        "minlength": "",
        "maxlength": "",
        "pattern": ""
    },

    "textarea": {
        "type": "textarea",
        "label": "",
        "name": "",
        "required": false,
        "minlength": "",
        "maxlength": "",
        "pattern": ""

    },

    "number": {
        "type": "number",
        "label": "",
        "name": "",
        "required": false,
        "minlength": "",
        "maxlength": "",
        "pattern": ""
    },
    "date": {
        "type": "date",
        "label": "",
        "name": "",
       // "minlength": "",
        //"maxlength": "",
        "required": false
    },

    "email": {
        "type": "email",
        "label": "",
        "name": "",
        "required": false,
        "minlength": "",
        "maxlength": "",
        "pattern": ""
    },

    "checkbox": {
        "type": "checkbox",
        "label": "",
        "name": "",
        "checkbox_values": []
    },

    "radio": {
        "type": "radio",
        "label": "",
        "name": "",
        "required": false,
        "radio_values": []
    },

    "select": {
        "type": "select",
        "label": "",
        "name": "",
        "required": false,
        "options": []
    },

    "file": {
        "type": "file",
        "label": "",
        "name": "",
        "id": "",
        "required": false,
        "accept": "",
        "pattern": ""
    }
}

export const formatPrettyDate = function (date) {
    date = new Date(date);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const suffix =
        day % 10 === 1 && day !== 11 ? "st" :
            day % 10 === 2 && day !== 12 ? "nd" :
                day % 10 === 3 && day !== 13 ? "rd" :
                    "th";

    return `${day}${suffix}, ${month}, ${year}`;
};

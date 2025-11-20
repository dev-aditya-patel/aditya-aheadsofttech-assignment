function validateDynamicInputs(inputs = []) {
    const errors = [];

    const isValidDate = (dateStr) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    };

    inputs.forEach((item, index) => {
        const label = item?.label?.toString().trim() || "";
        const name = item?.name?.toString().trim() || "";
        const minlength = item?.minlength;
        const maxlength = item?.maxlength;
        const pattern = item?.pattern;
        const minDate = item?.minDate;
        const maxDate = item?.maxDate;

        const count = index + 1;

        if (label === "") {
            errors.push({
                index: count,
                field: "label",
                message: `Label is required for item at index ${count}`
            });
        }

        if (name === "") {
            errors.push({
                index: count,
                field: "name",
                message: `Name is required for item at index ${count}`
            });
        }

        if (minlength !== undefined && minlength !== "") {
            if (isNaN(minlength)) {
                errors.push({
                    index: count,
                    field: "minlength",
                    message: `Minlength must be a number at index ${count}`
                });
            } else if (Number(minlength) < 0) {
                errors.push({
                    index: count,
                    field: "minlength",
                    message: `Minlength cannot be negative at index ${count}`
                });
            }
        }

        if (maxlength !== undefined && maxlength !== "") {
            if (isNaN(maxlength)) {
                errors.push({
                    index: count,
                    field: "maxlength",
                    message: `Maxlength must be a number at index ${count}`
                });
            } else if (Number(maxlength) < 0) {
                errors.push({
                    index: count,
                    field: "maxlength",
                    message: `Maxlength cannot be negative at index ${count}`
                });
            }
        }

        if (
            minlength !== "" &&
            maxlength !== "" &&
            !isNaN(minlength) &&
            !isNaN(maxlength)
        ) {
            if (Number(maxlength) < Number(minlength)) {
                errors.push({
                    index: count,
                    field: "maxlength",
                    message: `Maxlength must be >= minlength at index ${count}`
                });
            }
        }

        if (pattern && pattern.trim() !== "") {
            try {
                new RegExp(pattern);
            } catch (e) {
                errors.push({
                    index: count,
                    field: "pattern",
                    message: `Invalid regex at index ${count}`
                });
            }
        }

        if (item.type === "date") {
            if (minDate && minDate.trim() !== "") {
                if (!isValidDate(minDate)) {
                    errors.push({
                        index: count,
                        field: "minDate",
                        message: `Invalid minDate format at index ${count}, expected YYYY-MM-DD`
                    });
                }
            }

            if (maxDate && maxDate.trim() !== "") {
                if (!isValidDate(maxDate)) {
                    errors.push({
                        index: count,
                        field: "maxDate",
                        message: `Invalid maxDate format at index ${count}, expected YYYY-MM-DD`
                    });
                }
            }

            if (isValidDate(minDate) && isValidDate(maxDate)) {
                if (new Date(maxDate) < new Date(minDate)) {
                    errors.push({
                        index: count,
                        field: "maxDate",
                        message: `maxDate must be greater than or equal to minDate at index ${count}`
                    });
                }
            }
        }

        if (item.type === "checkbox") {
            if (!Array.isArray(item.checkbox_values) || item.checkbox_values.length === 0) {
                errors.push({
                    index: count,
                    field: "checkbox_values",
                    message: `Checkbox must have at least one option at index ${count}`
                });
            } else {
                item.checkbox_values.forEach((option, optIndex) => {
                    const optLabel = option?.label?.toString().trim() || "";
                    const optValue = option?.value?.toString().trim() || "";
                    const optIndexCount = optIndex + 1;

                    if (optLabel === "") {
                        errors.push({
                            index: count,
                            field: `checkbox_values.${optIndexCount}.label`,
                            message: `Checkbox label is required at index ${count}, option ${optIndexCount}`
                        });
                    }

                    if (optValue === "") {
                        errors.push({
                            index: count,
                            field: `checkbox_values.${optIndexCount}.value`,
                            message: `Checkbox value is required at index ${count}, option ${optIndexCount}`
                        });
                    }
                });
            }
        }

        if (item.type === "radio") {
            if (!Array.isArray(item.radio_values) || item.radio_values.length === 0) {
                errors.push({
                    index: count,
                    field: "radio_values",
                    message: `Radio must have at least one option at index ${count}`
                });
            } else {
                item.radio_values.forEach((option, optIndex) => {
                    const optLabel = option?.label?.toString().trim() || "";
                    const optValue = option?.value?.toString().trim() || "";
                    const optIndexCount = optIndex + 1;

                    if (optLabel === "") {
                        errors.push({
                            index: count,
                            field: `radio_values.${optIndexCount}.label`,
                            message: `Radio label is required at index ${count}, option ${optIndexCount}`
                        });
                    }

                    if (optValue === "") {
                        errors.push({
                            index: count,
                            field: `radio_values.${optIndexCount}.value`,
                            message: `Radio value is required at index ${count}, option ${optIndexCount}`
                        });
                    }
                });
            }
        }

        if (item.type === "select") {
            if (!Array.isArray(item.options) || item.options.length === 0) {
                errors.push({
                    index: count,
                    field: "options",
                    message: `Select must have at least one option at index ${count}`
                });
            } else {
                item.options.forEach((option, optIndex) => {
                    const optLabel = option?.label?.toString().trim() || "";
                    const optValue = option?.value?.toString().trim() || "";
                    const optIndexCount = optIndex + 1;

                    if (optLabel === "") {
                        errors.push({
                            index: count,
                            field: `options.${optIndexCount}.label`,
                            message: `Option label is required at index ${count}, option ${optIndexCount}`
                        });
                    }

                    if (optValue === "") {
                        errors.push({
                            index: count,
                            field: `options.${optIndexCount}.value`,
                            message: `Option value is required at index ${count}, option ${optIndexCount}`
                        });
                    }
                });
            }
        }

    });

    return errors;
}

function validateDynamicFormWithSchema(schema, formData, filesMap) {
  const errors = [];
  const validatedData = {};

  for (const field of schema) {
    const {
      type,
      name,
      required,
      minlength,
      maxlength,
      pattern,
      checkbox_values,
      radio_values,
      accept
    } = field;

    let value = formData[name];

    if (type === "file") {
      const file = filesMap[name]; 
      validatedData[name] = file ? file.filename : null;

      if (required && !file) {
        errors.push({ field: name, message: `${name} file is required` });
        continue;
      }

      if (file && accept) {
        const allowedTypes = accept.split(",");
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push({
            field: name,
            message: `${name} must be one of: ${accept}`
          });
        }
      }

      continue;
    }

    if (type === "checkbox") {
      const selected = [];
      checkbox_values.forEach((opt, index) => {
        const key = `${name}_${index}`;
        if (formData[key]) selected.push(formData[key][0]);
      });
      value = selected;
    }

    validatedData[name] = value ?? null;

    if (required && (!value || value.length === 0)) {
      errors.push({ field: name, message: `${name} is required` });
      continue;
    }

    if (!value) continue;

    if (minlength && value.length < minlength) {
      errors.push({
        field: name,
        message: `${name} should be at least ${minlength} characters`
      });
    }

    if (maxlength && value.length > maxlength) {
      errors.push({
        field: name,
        message: `${name} should not exceed ${maxlength} characters`
      });
    }

    if (pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        errors.push({
          field: name,
          message: `${name} format is invalid`
        });
      }
    }

    if (type === "radio") {
      const validValues = radio_values.map(v => v.value);
      if (!validValues.includes(value)) {
        errors.push({ field: name, message: `${name} is invalid` });
      }
    }

    if (type === "select") {
      const validOptions = field.options.map(o => o.value);
      if (!validOptions.includes(value)) {
        errors.push({ field: name, message: `${name} is invalid` });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  };
}



module.exports = {validateDynamicInputs, validateDynamicFormWithSchema};

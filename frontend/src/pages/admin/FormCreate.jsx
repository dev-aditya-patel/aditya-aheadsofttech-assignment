import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Form, Row, } from "react-bootstrap";
import { inputDataRaw } from '../../helpers/__helpers';
import DragItems from '../../components/DragItems';
import { useNavigate } from 'react-router';
import FormErrorAlert from '../../components/FormErrorAlert';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function FormCreate() {
    const inputType = ['text', 'textarea', 'number', 'email', 'date', 'checkbox', 'radio', 'select', 'file'];
    const [selectInputType, setSelectInputType] = useState('text');
    const [formRawInputData, setFormRawInputData] = useState([]);
    const [formRawInputDataWithValue, setFormRawInputDataWithValue] = useState([]);
    const [formRawInputDataHtml, setFormRawInputDataHtml] = useState(null);
    const [isRenderForm, setIssRenderForm] = useState(false);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [formErrors, setFormErrors] = useState([]);

    const [isFromSaveLoadError, setIsFromSaveLoadError] = useState(false);
    const [isFromSaveLoadErrorMessage, setIsFromSaveLoadErrorMessage] = useState([]);
    const navigate = useNavigate();
    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        setFormRawInputData((prev) => {
            const oldIndex = prev.findIndex((item) => item.id === active.id);
            const newIndex = prev.findIndex((item) => item.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };
    const stopDrag = (e) => e.stopPropagation();

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleSelectInputType = (e) => {
        setSelectInputType(e.target.value);
    }
    const handleInputImportBtn = () => {
        const rawInputValue = inputDataRaw[selectInputType];
        if (rawInputValue) {
            const newItem = {
                ...rawInputValue,
                id: crypto.randomUUID(),
            };
            setFormRawInputData(prev => [...prev, newItem]);
            setIssRenderForm(prev => !prev);

        }
    }
    const handleSelectOptionsAdd = (i) => {
        setFormRawInputData(prev =>
            prev.map((items, index) => {
                if (index === i) {
                    return {
                        ...items,
                        options: [
                            ...items.options,
                            { label: "", value: "" }
                        ]
                    }
                }
                return items
            })
        )

    }

    const handleRadioOptionsAdd = (i) => {
        setFormRawInputData(prev =>
            prev.map((items, index) => {
                if (index === i) {
                    return {
                        ...items,
                        radio_values: [
                            ...items.radio_values,
                            { label: "", value: "" }
                        ]
                    }
                }
                return items
            })
        )
    }
    const handleCheckboxOptionsAdd = (i) => {
        setFormRawInputData(prev =>
            prev.map((items, index) => {
                if (index === i) {
                    return {
                        ...items,
                        checkbox_values: [
                            ...items.checkbox_values,
                            { label: "", value: "" }
                        ]
                    }
                }
                return items
            })
        )
    }

    const handleInputLabelChange = (current, i) => {
        const value = current.target.value;

        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, label: value } : item
            )
        );
        // setIssRenderForm(prev => !prev);

         
    }
    const handleInputNameChange = (current, i) => {
        const value = current.target.value;
        if (!value) return;
        let formatted = value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

        // Check duplicate
        const isDuplicate = formRawInputData.some((item, idx) =>
            idx !== i && item.name === formatted
        );

        if (isDuplicate) {
            alert(`Field name "${formatted}" already exists. Choose another name.`);
            formatted = '';
        }

        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, name: formatted } : item
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleInputMinlengthChange = (current, i) => {
        let value = current.target.value;
        // const aa = formRawInputData[i];
        if (Number(value) > Number(formRawInputData[i].maxlength)) {
            value = '';
            alert("max value must greater then min");
        }
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, minlength: value } : item
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleInputMaxlengthChange = (current, i) => {
        let value = current.target.value;
        // const aa = formRawInputData[i];
        if (Number(value) < Number(formRawInputData[i].minlength)) {
            value = '';
            alert("max value must greater then min");
        }
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, maxlength: value } : item
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleInputPatternChange = (current, i) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, pattern: value } : item
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleInputCheckboxChange = (current, i) => {
        const value = current.target.checked;

        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, required: value } : item
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleSelectLabelChange = (current, i, optionIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        options: item.options.map((optionItem, optionItemIndex) =>
                            optionItemIndex === optionIndex ? { ...optionItem, label: value } : optionItem
                        )
                    }
                }
                return item;
            }
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleRadioLabelChange = (current, i, radioIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        radio_values: item.radio_values.map((radioItem, radioItemIndex) =>
                            radioItemIndex === radioIndex ? { ...radioItem, label: value } : radioItem
                        )
                    }
                }
                return item;
            })
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleCheckboxLabelChange = (current, i, checkboxIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        checkbox_values: item.checkbox_values.map((checkboxItem, checkboxItemIndex) =>
                            checkboxItemIndex === checkboxIndex ? { ...checkboxItem, label: value } : checkboxItem
                        )
                    }
                }
                return item;
            })
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleSelectValueChange = (current, i, optionIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        options: item.options.map((optionItem, optionItemIndex) =>
                            optionItemIndex === optionIndex ? { ...optionItem, value: value } : optionItem
                        )
                    }
                }
                return item;
            }
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleRadioValueChange = (current, i, radioIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        radio_values: item.radio_values.map((radioItem, radioItemIndex) =>
                            radioItemIndex === radioIndex ? { ...radioItem, value: value } : radioItem
                        )
                    }
                }
                return item;
            }
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }
    const handleCheckboxValueChange = (current, i, checkboxIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        checkbox_values: item.checkbox_values.map((checkboxItem, checkboxItemIndex) =>
                            checkboxItemIndex === checkboxIndex ? { ...checkboxItem, value: value } : checkboxItem
                        )
                    }
                }
                return item;
            }
            )
        );
        // setIssRenderForm(prev => !prev);
         
    }

    const handleDeleteRadioOption = (i, k) => {
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        radio_values: item.radio_values.filter((_, radioIndex) => radioIndex !== k)
                    }
                }
                return item;
            })
        )
        setIssRenderForm(prev => !prev);
    }
    const handleDeleteCheckboxOption = (i, k) => {
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        checkbox_values: item.checkbox_values.filter((_, checkboxIndex) => checkboxIndex !== k)
                    }

                }
                return item;
            })
        )
        setIssRenderForm(prev => !prev);
    }

    const handleDeleteSelectOption = (i, k) => {
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        options: item.options.filter((_, optionIndex) => optionIndex !== k)
                    }

                }
                return item;
            })
        )
        setIssRenderForm(prev => !prev);
    }

    const handleDeleteInputItems = (i) => {
        const newArr = formRawInputData.filter((_, index) => index !== i);
        setFormRawInputData(newArr);
        setIssRenderForm(prev => !prev);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3500/admin/form-create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" ,
                 "Authorization": token }
                ,
                body: JSON.stringify({ raw_form_data: formRawInputData, title: title, description: description })
            });

            const data = await res.json();
            if (data?.errors?.length > 0) {
                setFormErrors(data);
                alert(data.message);
            } else {

                navigate("/admin");
            }
        } catch (error) {
            setIsFromSaveLoadError(true);
            setIsFromSaveLoadErrorMessage(error?.response?.data?.message)
            console.error("Save error:", error);
        }
    }


    useEffect(() => {
        const aa = formRawInputData.map((inputs, i) => {
            if (inputs.type === 'text' || inputs.type === 'email' || inputs.type === 'number' || inputs.type === 'textarea') {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>
                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div className='drag-item'>
                                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={crypto.randomUUID()}
                                                        placeholder='Label'
                                                        defaultValue={inputs.label}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Enter Name:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={"name" + i}
                                                        placeholder='Enter Name'
                                                        defaultValue={inputs.name}
                                                        onBlur={(e) => handleInputNameChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Min value:<br />
                                                    <Form.Control
                                                        type="number"
                                                        id={"min_value" + i}
                                                        placeholder='Min value'
                                                        defaultValue={inputs.minlength}
                                                        onBlur={(e) => handleInputMinlengthChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Max value:<br />
                                                    <Form.Control
                                                        type="number"
                                                        id={"max_value" + i}
                                                        placeholder='Max value'
                                                        defaultValue={inputs.maxlength}
                                                        onBlur={(e) => handleInputMaxlengthChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Regex:<br />
                                                    <Form.Control
                                                        type="text"
                                                        id={"regex" + i}
                                                        placeholder='Regex'
                                                        defaultValue={inputs.pattern}
                                                        onBlur={(e) => handleInputPatternChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Required?:
                                                    <br />
                                                    <Form.Check
                                                        type={"checkbox"}
                                                        id={`checkbox-${i}`}
                                                        defaultChecked={inputs.required}
                                                        onChange={(e) => handleInputCheckboxChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => handleDeleteInputItems(i)}
                                                variant='outline-danger'
                                                size='sm'
                                                data-no-dnd="true"
                                                onPointerDown={stopDrag}
                                                onKeyDown={stopDrag}
                                            >
                                                X
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                    </DragItems>
                );
            }
            else if (inputs.type === 'file') {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>
                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div className='drag-item'>
                                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder='Label'
                                                        defaultValue={inputs.label}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Enter Name:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={"name" + i}
                                                        placeholder='Enter Name'
                                                        defaultValue={inputs.name}
                                                        onBlur={(e) => handleInputNameChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                {/* <Col>
                                                Min value:<br />
                                                <Form.Control
                                                    type="date"
                                                    id={"min_value" + i}
                                                    placeholder='Min value'
                                                    defaultValue={inputs.minlength}
                                                    onBlur={(e) => handleInputMinlengthChange(e, i)}
                                                />
                                            </Col>
                                            <Col>
                                                Max value:<br />
                                                <Form.Control
                                                    type="date"
                                                    id={"max_value" + i}
                                                    placeholder='Max value'
                                                    defaultValue={inputs.maxlength}
                                                    onBlur={(e) => handleInputMaxlengthChange(e, i)}
                                                />
                                            </Col> */}

                                                <Col>
                                                    Required?:
                                                    <br />
                                                    <Form.Check
                                                        type={"checkbox"}
                                                        id={`checkbox-${i}`}
                                                        defaultChecked={inputs.required}
                                                        onChange={(e) => handleInputCheckboxChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => handleDeleteInputItems(i)}
                                                variant='outline-danger'
                                                size='sm'
                                                data-no-dnd="true"
                                                onPointerDown={stopDrag}
                                                onKeyDown={stopDrag}
                                            >
                                                X
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                    </DragItems>
                );
            }
            else if (inputs.type === 'date') {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>

                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div className='drag-item'>
                                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder='Label'
                                                        defaultValue={inputs.label}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Enter Name:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={"name" + i}
                                                        placeholder='Enter Name'
                                                        defaultValue={inputs.name}
                                                        onBlur={(e) => handleInputNameChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                {/* <Col>
                                                Min value:<br />
                                                <Form.Control
                                                    type="date"
                                                    id={"min_value" + i}
                                                    placeholder='Min value'
                                                    defaultValue={inputs.minlength}
                                                    onBlur={(e) => handleInputMinlengthChange(e, i)}
                                                />
                                            </Col>
                                            <Col>
                                                Max value:<br />
                                                <Form.Control
                                                    type="date"
                                                    id={"max_value" + i}
                                                    placeholder='Max value'
                                                    defaultValue={inputs.maxlength}
                                                    onBlur={(e) => handleInputMaxlengthChange(e, i)}
                                                />
                                            </Col> */}

                                                <Col>
                                                    Required?:
                                                    <br />
                                                    <Form.Check
                                                        type={"checkbox"}
                                                        id={`checkbox-${i}`}
                                                        defaultChecked={inputs.required}
                                                        onChange={(e) => handleInputCheckboxChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => handleDeleteInputItems(i)}
                                                variant='outline-danger'
                                                size='sm'
                                                data-no-dnd="true"
                                                onPointerDown={stopDrag}
                                                onKeyDown={stopDrag}
                                            >
                                                X
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                    </DragItems>
                );
            }

            else if (inputs.type === "select") {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>

                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div className='drag-item'>
                                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder='Label'
                                                        defaultValue={inputs.label}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Enter Name:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={"name" + i}
                                                        placeholder='Enter Name'
                                                        defaultValue={inputs.name}
                                                        onBlur={(e) => handleInputNameChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Required?:
                                                    <br />
                                                    <Form.Check
                                                        type={"checkbox"}
                                                        id={`checkbox-${i}`}
                                                        defaultChecked={inputs.required}
                                                        onChange={(e) => handleInputCheckboxChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <ButtonGroup aria-label="Basic example">

                                                <Button
                                                    onClick={() => handleDeleteInputItems(i)}
                                                    variant='outline-danger'
                                                    size='sm'
                                                    data-no-dnd="true"
                                                    onPointerDown={stopDrag}
                                                    onKeyDown={stopDrag}
                                                >
                                                    X
                                                </Button>
                                                <Button
                                                    onClick={() => handleSelectOptionsAdd(i)}
                                                    variant='outline-primary'
                                                    size='sm'
                                                    data-no-dnd="true"
                                                    onPointerDown={stopDrag}
                                                    onKeyDown={stopDrag}
                                                >
                                                    Add option
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </div>
                                {inputs.options.length > 0 && (

                                    <div style={{ margin: "10px", width: "50%" }}>
                                        <Card>
                                            <Card.Body>

                                                {inputs.options.map((optionsInputs, k) => {
                                                    return (
                                                        <div key={crypto.randomUUID()} style={{ display: "flex", gap: "20px", alignItems: "center" }}>

                                                            <div key={crypto.randomUUID()}>
                                                                <Row sm className='mb-2' key={k}>
                                                                    <Col>
                                                                        Label:
                                                                        <Form.Control
                                                                            type="text"
                                                                            required
                                                                            id={"label" + k + i}
                                                                            placeholder="Enter Label"
                                                                            defaultValue={optionsInputs.label}
                                                                            onBlur={(e) => handleSelectLabelChange(e, i, k)}
                                                                            data-no-dnd="true"
                                                                            onPointerDown={stopDrag}
                                                                            onKeyDown={stopDrag}
                                                                            onClick={stopDrag}
                                                                        />
                                                                    </Col>

                                                                    <Col>
                                                                        Value:
                                                                        <Form.Control
                                                                            type="text"
                                                                            required
                                                                            id={"value" + k + i}
                                                                            placeholder="Enter Value"
                                                                            defaultValue={optionsInputs.value}
                                                                            onBlur={(e) => handleSelectValueChange(e, i, k)}
                                                                            data-no-dnd="true"
                                                                            onPointerDown={stopDrag}
                                                                            onKeyDown={stopDrag}
                                                                            onClick={stopDrag}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </div>

                                                            <div key={crypto.randomUUID()}>
                                                                <Button
                                                                    onClick={() => handleDeleteSelectOption(i, k)}
                                                                    variant='outline-danger'
                                                                    size='sm'
                                                                    data-no-dnd="true"
                                                                    onPointerDown={stopDrag}
                                                                    onKeyDown={stopDrag}
                                                                >
                                                                    X
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}



                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </DragItems>
                );
            } else if (inputs.type === "radio") {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>

                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div className='drag-item'>
                                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder='Label'
                                                        defaultValue={inputs.label}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Enter Name:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={"name" + i}
                                                        placeholder='Enter Name'
                                                        defaultValue={inputs.name}
                                                        onBlur={(e) => handleInputNameChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Required?:
                                                    <br />
                                                    <Form.Check
                                                        type={"checkbox"}
                                                        id={`checkbox-${i}`}
                                                        defaultChecked={inputs.required}
                                                        onChange={(e) => handleInputCheckboxChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <ButtonGroup aria-label="Basic example">

                                                <Button
                                                    onClick={() => handleDeleteInputItems(i)}
                                                    variant='outline-danger'
                                                    size='sm'
                                                    data-no-dnd="true"
                                                    onPointerDown={stopDrag}
                                                    onKeyDown={stopDrag}
                                                >
                                                    X
                                                </Button>
                                                <Button
                                                    onClick={() => handleRadioOptionsAdd(i)}
                                                    variant='outline-primary'
                                                    size='sm'
                                                    data-no-dnd="true"
                                                    onPointerDown={stopDrag}
                                                    onKeyDown={stopDrag}
                                                >
                                                    Add option
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </div>
                                {inputs.radio_values.length > 0 && (

                                    <div style={{ margin: "10px", width: "50%" }}>
                                        <Card>
                                            <Card.Body>

                                                {inputs.radio_values.map((radioInputs, k) => {
                                                    return (
                                                        <div key={crypto.randomUUID()} style={{ display: "flex", gap: "20px", alignItems: "center" }}>

                                                            <div key={crypto.randomUUID()}>
                                                                <Row sm className='mb-2' key={k}>
                                                                    <Col>
                                                                        Label:
                                                                        <Form.Control
                                                                            type="text"
                                                                            required
                                                                            id={"label" + k + i}
                                                                            placeholder="Enter lebel for radio"
                                                                            defaultValue={radioInputs.label}
                                                                            onBlur={(e) => handleRadioLabelChange(e, i, k)}
                                                                            data-no-dnd="true"
                                                                            onPointerDown={stopDrag}
                                                                            onKeyDown={stopDrag}
                                                                            onClick={stopDrag}
                                                                        />
                                                                    </Col>

                                                                    <Col>
                                                                        Value:
                                                                        <Form.Control
                                                                            type="text"
                                                                            required
                                                                            id={"value" + k + i}
                                                                            placeholder="Enter value for radio"
                                                                            defaultValue={radioInputs.value}
                                                                            onBlur={(e) => handleRadioValueChange(e, i, k)}
                                                                            data-no-dnd="true"
                                                                            onPointerDown={stopDrag}
                                                                            onKeyDown={stopDrag}
                                                                            onClick={stopDrag}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </div>

                                                            <div key={crypto.randomUUID()}>
                                                                <Button
                                                                    onClick={() => handleDeleteRadioOption(i, k)}
                                                                    variant='outline-danger'
                                                                    size='sm'
                                                                    data-no-dnd="true"
                                                                    onPointerDown={stopDrag}
                                                                    onKeyDown={stopDrag}
                                                                >
                                                                    X
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}



                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </DragItems>
                );
            } else if (inputs.type === "checkbox") {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>

                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div className='drag-item'>
                                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder='Label'
                                                        defaultValue={inputs.label}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                <Col>
                                                    Enter Name:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        id={"name" + i}
                                                        placeholder='Enter Name'
                                                        defaultValue={inputs.name}
                                                        onBlur={(e) => handleInputNameChange(e, i)}
                                                        data-no-dnd="true"
                                                        onPointerDown={stopDrag}
                                                        onKeyDown={stopDrag}
                                                        onClick={stopDrag}
                                                    />
                                                </Col>
                                                {/* <Col>
                                                Required?:
                                                <br />
                                                <Form.Check
                                                    type={"checkbox"}
                                                    id={`checkbox-${i}`}
                                                    defaultChecked={inputs.required}
                                                    onChange={(e) => handleInputCheckboxChange(e, i)}
                                                />
                                            </Col> */}
                                            </Row>
                                        </div>
                                        <div>
                                            <ButtonGroup aria-label="Basic example">

                                                <Button
                                                    onClick={() => handleDeleteInputItems(i)}
                                                    variant='outline-danger'
                                                    size='sm'
                                                    data-no-dnd="true"
                                                    onPointerDown={stopDrag}
                                                    onKeyDown={stopDrag}
                                                >
                                                    X
                                                </Button>
                                                <Button
                                                    onClick={() => handleCheckboxOptionsAdd(i)}
                                                    variant='outline-primary'
                                                    size='sm'
                                                    data-no-dnd="true"
                                                    onPointerDown={stopDrag}
                                                    onKeyDown={stopDrag}
                                                >
                                                    Add option
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </div>
                                {inputs.checkbox_values.length > 0 && (

                                    <div style={{ margin: "10px", width: "50%" }}>
                                        <Card>
                                            <Card.Body>

                                                {inputs.checkbox_values.map((checkboxInputs, k) => {
                                                    return (
                                                        <div key={crypto.randomUUID()} style={{ display: "flex", gap: "20px", alignItems: "center" }}>

                                                            <div key={crypto.randomUUID()}>
                                                                <Row sm className='mb-2' key={k}>
                                                                    <Col>
                                                                        Label:
                                                                        <Form.Control
                                                                            type="text"
                                                                            required
                                                                            id={"label" + k + i}
                                                                            placeholder="Enter lebel for checkbox"
                                                                            defaultValue={checkboxInputs.label}
                                                                            onBlur={(e) => handleCheckboxLabelChange(e, i, k)}
                                                                            data-no-dnd="true"
                                                                            onPointerDown={stopDrag}
                                                                            onKeyDown={stopDrag}
                                                                            onClick={stopDrag}
                                                                        />
                                                                    </Col>

                                                                    <Col>
                                                                        Value:
                                                                        <Form.Control
                                                                            type="text"
                                                                            required
                                                                            id={"value" + k + i}
                                                                            placeholder="Enter value for checkbox"
                                                                            defaultValue={checkboxInputs.value}
                                                                            onBlur={(e) => handleCheckboxValueChange(e, i, k)}
                                                                            data-no-dnd="true"
                                                                            onPointerDown={stopDrag}
                                                                            onKeyDown={stopDrag}
                                                                            onClick={stopDrag}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </div>

                                                            <div key={crypto.randomUUID()}>
                                                                <Button
                                                                    onClick={() => handleDeleteCheckboxOption(i, k)}
                                                                    variant='outline-danger'
                                                                    size='sm'
                                                                    data-no-dnd="true"
                                                                    onPointerDown={stopDrag}
                                                                    onKeyDown={stopDrag}
                                                                >
                                                                    X
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}



                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </DragItems>
                );
            }
            return null;
        });
        setFormRawInputDataHtml(aa);
    }, [formRawInputData]);
    return (
        <>
            <Container>
                <div style={{ width: "100%", margin: "0 auto", marginTop: "107px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "61rem" }}>
                        <h1>Add new form</h1>
                        <Button style={{ marginBottom: "20px", float: "right" }} onClick={() => navigate(`/admin`)} variant="primary">View</Button>
                    </div>
                    {isFromSaveLoadError && (
                        <>
                            <Alert key={crypto.randomUUID()} variant={"danger"} >
                                {isFromSaveLoadErrorMessage}
                            </Alert>
                        </>
                    )}
                    {formErrors?.errors?.length > 0 && (
                        <Card style={{ marginBottom: "20px" }}>
                            <Card.Body>
                                <FormErrorAlert errorData={formErrors} />
                            </Card.Body>
                        </Card>
                    )}

                    <Card>
                        <Card.Body>

                            <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                                <h4>Add Inputs</h4>
                                <Form.Select size='sm' onChange={handleSelectInputType}>
                                    {inputType.map((value, i) => (
                                        <option key={i} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            <Button onClick={handleInputImportBtn} variant='outline-primary' size='sm' color='primary'>Add Input</Button>
                        </Card.Body>
                    </Card>
                    <Form onSubmit={handleFormSubmit}>
                        <div className='inputouter-form' >
                            <>
                                <Card style={{ margin: "10px 10px" }} key={crypto.randomUUID()} >
                                    <Card.Body>
                                        <Row style={{ marginTop: "20px" }} key={crypto.randomUUID()}>
                                            <Col>Title</Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    required
                                                    defaultValue={title}
                                                    onBlur={handleTitle}
                                                    // value={title}
                                                    // onChange={handleTitle}

                                                    placeholder='Label'
                                                />
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: "20px" }} key={crypto.randomUUID()}>
                                            <Col>Description</Col>
                                            <Col>
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Leave a comment here"
                                                    required
                                                    defaultValue={description}
                                                    onBlur={handleDescription}
                                                    style={{ height: '100px' }}
                                                />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={formRawInputData.map((item) => item.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {formRawInputDataHtml}
                                    </SortableContext>
                                </DndContext>
                            </>
                        </div>
                        {formRawInputData.length > 0 && (
                            <Button type='submit' variant='outline-secondary' style={{ marginTop: "20px" }} size='sm' color='primary'>Save form</Button>
                        )}
                    </Form>
                </div>
            </Container>
        </>

    )
}

export default FormCreate
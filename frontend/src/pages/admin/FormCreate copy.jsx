import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Form, Row, } from "react-bootstrap";
import { inputDataRaw } from '../../helpers/__helpers';
import DragItems from '../../components/DragItems';
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
function FormCreate() {
    const inputType = ['text', 'textarea', 'number', 'email', 'date', 'checkbox', 'radio', 'select', 'file'];
    const [selectInputType, setSelectInputType] = useState('text');
    const [formRawInputData, setFormRawInputData] = useState([]);
    const [formRawInputDataWithValue, setFormRawInputDataWithValue] = useState([]);
    const [formRawInputDataHtml, setFormRawInputDataHtml] = useState(null);
    const [isRenderForm, setIssRenderForm] = useState(false);
    const handleSelectInputType = (e) => {
        setSelectInputType(e.target.value);
    }


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
    };

    const handleSelectOptionsAdd = (i) => {
        setFormRawInputData(prev =>
            prev.map((items, index) => {
                if (index === i) {
                    return {
                        ...items,
                        options: [
                            ...items.options,
                            { id: crypto.randomUUID(), label: "", value: "" }
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
                            { id: crypto.randomUUID(), label: "", value: "" }
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
                            { id: crypto.randomUUID(), label: "", value: "" }
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
        setIssRenderForm(prev => !prev);

         
    }
    const handleInputNameChange = (current, i) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, name: value } : item
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleInputMinlengthChange = (current, i) => {
        let value = current.target.value;
        // const aa = formRawInputData[i];
        if (value > formRawInputData[i].maxlength) {
            value = '';
            alert("max value must greater then min");
        }
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, minlength: value } : item
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleInputMaxlengthChange = (current, i) => {
        let value = current.target.value;
        // const aa = formRawInputData[i];
        if (value < formRawInputData[i].minlength) {
            value = '';
            alert("max value must greater then min");
        }
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, maxlength: value } : item
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleInputPatternChange = (current, i) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, pattern: value } : item
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleInputCheckboxChange = (current, i) => {
        const value = current.target.checked;

        setFormRawInputData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, required: value } : item
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleSelectLabelChange = (current, i, optionIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        options: item.options.map((optionItem, optionItemIndex) =>
                            optionItemIndex === optionIndex ? { ...optionItem, label: value.toLowerCase().replace(/\s+/g, "_") } : optionItem
                        )
                    }
                }
                return item;
            }
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleRadioLabelChange = (current, i, radioIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        radio_values: item.radio_values.map((radioItem, radioItemIndex) =>
                            radioItemIndex === radioIndex ? { ...radioItem, label: value.toLowerCase().replace(/\s+/g, "_") } : radioItem
                        )
                    }
                }
                return item;
            })
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleCheckboxLabelChange = (current, i, checkboxIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        checkbox_values: item.checkbox_values.map((checkboxItem, checkboxItemIndex) =>
                            checkboxItemIndex === checkboxIndex ? { ...checkboxItem, label: value.toLowerCase().replace(/\s+/g, "_") } : checkboxItem
                        )
                    }
                }
                return item;
            })
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleSelectValueChange = (current, i, optionIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        options: item.options.map((optionItem, optionItemIndex) =>
                            optionItemIndex === optionIndex ? { ...optionItem, value: value.toLowerCase().replace(/\s+/g, "_") } : optionItem
                        )
                    }
                }
                return item;
            }
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleRadioValueChange = (current, i, radioIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        radio_values: item.radio_values.map((radioItem, radioItemIndex) =>
                            radioItemIndex === radioIndex ? { ...radioItem, value: value.toLowerCase().replace(/\s+/g, "_") } : radioItem
                        )
                    }
                }
                return item;
            }
            )
        );
        setIssRenderForm(prev => !prev);
         
    }
    const handleCheckboxValueChange = (current, i, checkboxIndex) => {
        const value = current.target.value;
        setFormRawInputData(prev =>
            prev.map((item, index) => {
                if (index === i) {
                    return {
                        ...item,
                        checkbox_values: item.checkbox_values.map((checkboxItem, checkboxItemIndex) =>
                            checkboxItemIndex === checkboxIndex ? { ...checkboxItem, value: value.toLowerCase().replace(/\s+/g, "_") } : checkboxItem
                        )
                    }
                }
                return item;
            }
            )
        );
        setIssRenderForm(prev => !prev);
         
    }

    const handleDeleteRadioOption = (i, k) => {
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

    const [localInputs, setLocalInputs] = useState([]);

    useEffect(() => {
        setLocalInputs(formRawInputData);
    }, [formRawInputData]);


    useEffect(() => {
        const aa = formRawInputData.map((inputs, i) => {
            if (inputs.type === 'text' || inputs.type === 'email' || inputs.type === 'number' || inputs.type === 'textarea' || inputs.type === 'file') {
                return (
                    <DragItems key={inputs.id} id={inputs.id}>
                        <Card key={crypto.randomUUID()} style={{ margin: "10px 10px" }}>
                            <Card.Body>

                                <div className='form-line-item' key={crypto.randomUUID()}>
                                    <div className='line-item-inner d-flex gap-3 sele'>
                                        <div>Drag</div>
                                        <div>
                                            <Row key={crypto.randomUUID()}>
                                                <Col>Input Type: {inputs.type}</Col>
                                                <Col>
                                                    Enter Label:<br />
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder='Label'
                                                        //value={inputs.label}
                                                        value={localInputs[i]?.label || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setLocalInputs(prev =>
                                                                prev.map((item, idx) =>
                                                                    idx === i ? { ...item, label: value } : item
                                                                )
                                                            );
                                                        }}
                                                        onBlur={(e) => handleInputLabelChange(e, i)}
                                                        // onChange={(e) => handleInputLabelChange(e, i)}
                                                    //  defaultValue={inputs.label}
                                                    //onBlur={(e) => handleInputLabelChange(e, i)}
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
                                                    />
                                                </Col>
                                                <Col>
                                                    Min value:<br />
                                                    <Form.Control
                                                        type="text"
                                                        id={"min_value" + i}
                                                        placeholder='Min value'
                                                        defaultValue={inputs.minlength}
                                                        onBlur={(e) => handleInputMinlengthChange(e, i)}
                                                    />
                                                </Col>
                                                <Col>
                                                    Max value:<br />
                                                    <Form.Control
                                                        type="text"
                                                        id={"max_value" + i}
                                                        placeholder='Max value'
                                                        defaultValue={inputs.maxlength}
                                                        onBlur={(e) => handleInputMaxlengthChange(e, i)}
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
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => handleDeleteInputItems(i)}
                                                variant='outline-danger'
                                                size='sm'
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
                                    <div>Drag</div>
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
                                                />
                                            </Col>
                                            <Col>
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
                                            </Col>

                                            <Col>
                                                Required?:
                                                <br />
                                                <Form.Check
                                                    type={"checkbox"}
                                                    id={`checkbox-${i}`}
                                                    defaultChecked={inputs.required}
                                                    onChange={(e) => handleInputCheckboxChange(e, i)}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => handleDeleteInputItems(i)}
                                            variant='outline-danger'
                                            size='sm'
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
                                    <div>Drag</div>
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
                                            >
                                                X
                                            </Button>
                                            <Button
                                                onClick={() => handleSelectOptionsAdd(i)}
                                                variant='outline-primary'
                                                size='sm'
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
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                        <div key={crypto.randomUUID()}>
                                                            <Button
                                                                onClick={() => handleDeleteSelectOption(i, k)}
                                                                variant='outline-danger'
                                                                size='sm'
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
                                    <div>Drag</div>
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
                                            >
                                                X
                                            </Button>
                                            <Button
                                                onClick={() => handleRadioOptionsAdd(i)}
                                                variant='outline-primary'
                                                size='sm'
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
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                        <div key={crypto.randomUUID()}>
                                                            <Button
                                                                onClick={() => handleDeleteRadioOption(i, k)}
                                                                variant='outline-danger'
                                                                size='sm'
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
                                    <div>Drag</div>
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
                                            >
                                                X
                                            </Button>
                                            <Button
                                                onClick={() => handleCheckboxOptionsAdd(i)}
                                                variant='outline-primary'
                                                size='sm'
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
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                        <div key={crypto.randomUUID()}>
                                                            <Button
                                                                onClick={() => handleDeleteCheckboxOption(i, k)}
                                                                variant='outline-danger'
                                                                size='sm'
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
                    <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                        <Form.Select size='sm' onChange={handleSelectInputType}>
                            {inputType.map((value, i) => (
                                <option key={i} value={value}>
                                    {value}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                    <Button onClick={handleInputImportBtn} variant='outline-primary' size='sm' color='primary'>Add Input</Button>
                    <Form>
                        <div className='inputouter-form' >
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={formRawInputData.map((item) => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {formRawInputDataHtml}
                                </SortableContext>
                            </DndContext>

                        </div>
                        <Button type='submit' variant='outline-secondary' style={{ marginTop: "20px" }} size='sm' color='primary'>Same form</Button>
                    </Form>
                </div>
            </Container>
        </>

    )
}

export default FormCreate
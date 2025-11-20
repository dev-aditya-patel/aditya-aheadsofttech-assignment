import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import axios from "axios";
import { useParams } from 'react-router';
import FormErrorAlert from '../components/FormErrorAlert';


function FormsLoad() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState([])
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { id } = useParams();
  const [isLoadError, setIsLoadError] = useState(false);
  const [isLoadErrorMessage, setIsLoadErrorMessage] = useState('');
  const [isFromSubmitError, setIsFromSubmitError] = useState(false);
  const [isFromSubmitErrorMessage, setIsFromSubmitErrorMessage] = useState('');

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3500/admin/${id}`,
        {
          headers: {
            Authorization: token
          }
        }
      );
      setFormData(res.data);
      setTitle(res?.data?.data?.title || '')
      setDescription(res?.data?.data?.description || '')
      setIsLoading(false);
    }
    catch (error) {
      setIsLoading(false);
      setIsLoadError(true);
      setIsLoadErrorMessage(error?.response?.data?.message)
      console.error("Upload error:", error);
    }
  };
  useEffect(() => {
    fetchForms();
  }, [id]);

  const [formValues, setFormValues] = useState({});

  const handleChange = (e, item) => {
    const name = e.target.name;
    const type = e.target.type;
    if (type === "file") {
      setFormValues(prev => ({
        ...prev,
        [name]: e.target.files[0]
      }));
      return;
    }

    if (type === "checkbox") {
      const value = e.target.value;
      const checked = e.target.checked;

      setFormValues(prev => {
        const existing = prev[name] || [];
        if (checked) {
          return { ...prev, [name]: [...existing, value] };
        } else {
          return { ...prev, [name]: existing.filter(v => v !== value) };
        }
      });
      return;
    }

    if (type === "radio") {
      setFormValues(prev => ({
        ...prev,
        [name]: e.target.value
      }));
      return;
    }
    setFormValues(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("id", id);
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key];
      if (Array.isArray(value)) {
        value.forEach(v => formDataToSend.append(key + "[]", v));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3500/submit-form", {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Authorization": token
        },
      });

      const data = await res.json();
      if (data?.errors?.length > 0) {
        console.log("data.errors", data, data.errors);
        setFormErrors(data);
        alert(data.message);
      } else {
        setIsFormSubmitted(true);
        alert(data.message);
        setFormData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            raw_form_data: ""
          }
        }));

      }
      // setFormErrors([]);
    } catch (error) {
      setIsFromSubmitError(true);
      setIsFromSubmitErrorMessage(error?.response?.data?.message)
      console.error("Upload error:", error);
    }
  };


  return (

    <>
      <Container>
        <div style={{ width: "100%", margin: "0 auto", marginTop: "107px", marginBottom: "20px" }}>
          {isLoadError && (
            <>
              <Alert key={crypto.randomUUID()} variant={"danger"} >
                {isLoadErrorMessage}
              </Alert>
            </>
          )}
          {isFromSubmitError ? (
            <>
              <Alert key={crypto.randomUUID()} variant={"danger"} >
                {isFromSubmitErrorMessage}
              </Alert>
            </>
          )
            :
            (
              <>

                {isLoading ? (
                  <>
                    <p>Loading...</p>
                  </>
                ) : (
                  <>
                    <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                      <h1>Forms</h1>
                      {/* <Button style={{ marginBottom: "20px", float: "right" }} onClick={() => navigate(`/admin`)} variant="primary">Admin</Button> */}
                    </div>
                    {formErrors?.errors?.length > 0 && (
                      <Card style={{ marginBottom: "20px", marginTop: "20px" }}>
                        <Card.Body>
                          <FormErrorAlert errorData={formErrors} />
                        </Card.Body>
                      </Card>
                    )}
                    <div>
                      <Card>
                        <Card.Body>
                          <Card>
                            <Card.Header>Title</Card.Header>
                            <Card.Body>
                              <Card.Text>
                                {formData?.data?.title}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                          <Card style={{ marginTop: "10px" }}>
                            <Card.Header>Description</Card.Header>
                            <Card.Body>
                              <Card.Text>
                                {formData?.data?.description}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Card.Body>
                      </Card>
                    </div>

                    <div style={{ margin: "0 auto", marginTop: "20px" }}>
                      {isFormSubmitted ? (
                        <>
                          <Card style={{ marginTop: "10px" }}>
                            <Card.Body>
                              <Alert variant='success'>
                                Form submitted successfully.
                              </Alert>
                            </Card.Body>
                          </Card>
                        </>
                      ) : (
                        <>
                          <Card>
                            <Card.Header as={"h3"}>Fill below form</Card.Header>
                            <Card.Body>


                              <Form onSubmit={handleSubmit} method='post' encType='multipart/form-data'>
                                {formData?.data?.raw_form_data?.map((item, index) => {
                                  return (
                                    <Form.Group className="mb-3" key={index}>
                                      <Form.Label>{item.label}</Form.Label>

                                      {(item.type === "text" ||
                                        item.type === "number" ||
                                        item.type === "email" ||
                                        item.type === "date") && (
                                          <Form.Control
                                            type={item.type}
                                            name={item.name}
                                            required={item.required}
                                            placeholder={item.label}
                                            onChange={(e) => handleChange(e, item.name)}
                                            {...(item.minlength != null && item.minlength !== ""
                                              ? { minLength: item.minlength }
                                              : {})}

                                            {...(item.maxlength != null && item.maxlength !== ""
                                              ? { maxLength: item.maxlength }
                                              : {})}

                                            {...(item.pattern && item.pattern.trim() !== ""
                                              ? { pattern: item.pattern }
                                              : {})}
                                          />
                                        )}

                                      {item.type === "textarea" && (
                                        <Form.Control
                                          as="textarea"
                                          name={item.name}
                                          required={item.required}

                                          rows={3}
                                          placeholder={item.label}
                                          onChange={(e) => handleChange(e, item.name)}
                                          {...(item.minlength != null && item.minlength !== ""
                                            ? { minLength: item.minlength }
                                            : {})}

                                          {...(item.maxlength != null && item.maxlength !== ""
                                            ? { maxLength: item.maxlength }
                                            : {})}

                                          {...(item.pattern && item.pattern.trim() !== ""
                                            ? { pattern: item.pattern }
                                            : {})}
                                        />
                                      )}

                                      {item.type === "checkbox" &&
                                        item.checkbox_values?.map((opt, idx) => (
                                          <Form.Check
                                            key={idx}
                                            type="checkbox"
                                            label={opt.label}
                                            value={opt.value}
                                            name={`${item.name}[]`}
                                            onChange={(e) => handleChange(e, `${item.name}[]`)}
                                          />
                                        ))}

                                      {item.type === "radio" &&
                                        item.radio_values?.map((opt, idx) => (
                                          <Form.Check
                                            key={idx}
                                            type="radio"
                                            label={opt.label}
                                            value={opt.value}
                                            name={item.name}
                                            required={item.required}
                                            onChange={(e) => handleChange(e, item.name)}
                                          />
                                        ))}

                                      {item.type === "select" && (
                                        <Form.Select
                                          name={item.name}
                                          required={item.required}
                                          onChange={(e) => handleChange(e, item.name)}
                                        >
                                          <option value="">Select {item.label}</option>

                                          {item.options?.map((opt, idx) => (
                                            <option key={idx} value={opt.value}>
                                              {opt.label}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      )}

                                      {item.type === "file" && (
                                        <Form.Control
                                          type="file"
                                          name={item.name}
                                          required={item.required}
                                          accept={item.accept || "*"}
                                          onChange={(e) => handleChange(e, item.name)}
                                        />
                                      )}
                                    </Form.Group>
                                  );
                                })}

                                <Button type="submit" variant="primary">Submit</Button>
                              </Form>
                            </Card.Body>
                          </Card>
                        </>
                      )}
                    </div>

                  </>
                )}

              </>
            )}
        </div>
      </Container>
    </>
  )
}

export default FormsLoad
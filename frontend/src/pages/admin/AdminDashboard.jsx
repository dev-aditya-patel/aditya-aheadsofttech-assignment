import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert, Button, ButtonGroup, Container, Modal, Pagination, Table } from 'react-bootstrap'
import axios from "axios";
import { useNavigate } from 'react-router';
import { formatPrettyDate } from '../../helpers/__helpers';
import FormFilter from "../../components/FormFilter"


function AdminDashboard() {
  const [listForms, setListForms] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);
  const [isLoadErrorMessage, setIsLoadErrorMessage] = useState('');
  const [isDeleteLoadError, setIsDeleteLoadError] = useState(false);
  const [isDeleteLoadErrorMessage, setIsDeleteLoadErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const fetchForms = async (page = 1, query = search) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3500/admin?page=${page}&limit=10&search=${query}`,
        {
          headers: {
            Authorization: token
          }
        }
      );
      setListForms(res.data);

      setPagination(res?.data?.pagination);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
      setIsLoadError(true);
      setIsLoadErrorMessage(error?.response?.data?.message)
      console.error("fetch  error:", error);
    }
  };

  useEffect(() => {
    fetchForms(1);
  }, []);
  useEffect(() => {
    fetchForms(pagination.page);
    setIsDeleted(false);

  }, [isDeleted]);

  const handlePageChange = (pageNum) => {
    fetchForms(pageNum);
  };

  const handleDeleteRawForm = (id) => {
    setDeleteId(id);       
    setShowDeleteModal(true);  
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");

      let res = await fetch(`http://localhost:3500/admin/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
        ,
      });

      const data = await res.json();
      alert(data.message);
      setIsDeleted(true);
      setShowDeleteModal(false);

    } catch (error) {
      setIsDeleteLoadError(true);
      setShowDeleteModal(false);

      setIsDeleteLoadErrorMessage(error?.response?.data?.message)
      console.error("Save error:", error);
    }
  }
  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Container>
        <div style={{ width: "100%", margin: "0 auto", marginTop: "107px", marginBottom: "20px" }}>
          <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            <h1>List all forms</h1>
            <Button style={{ marginBottom: "20px", float: "right" }} onClick={() => navigate(`/admin/form-create`)} variant="primary">Create</Button>

            {isDeleted && (
              <>
                <Alert key={crypto.randomUUID()} variant={"success"} >
                  Form deleted successfully.
                </Alert>
              </>
            )}
            {isDeleteLoadError && (
              <>
                <Alert key={crypto.randomUUID()} variant={"danger"} >
                  {isDeleteLoadErrorMessage}
                </Alert>
              </>
            )}
            {isLoadError ? (
              <>
                <Alert key={crypto.randomUUID()} variant={"danger"} >
                  {isLoadErrorMessage}
                </Alert>
              </>
            )
              :
              <>

                <FormFilter
                  onSearchKey={(value) => {
                    setSearch(value);
                    fetchForms(pagination.page, value);
                  }}
                />


                {isLoading ? (
                  <>Loading data...</>
                ) : (
                  <>

                    {listForms?.data?.length > 0 ? (
                      <>
                        <Table striped bordered hover>
                          <thead key={crypto.randomUUID()}>
                            <tr>
                              <th>#</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Create at</th>
                              <th>IP Address</th>
                              <th>User Agest</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody key={crypto.randomUUID()}>
                            {listForms?.data?.map((form, index) => (
                              <tr key={form._id}>
                                <td>{index + 1}</td>
                                <td>{form?.title ?? ''}</td>
                                <td>{form?.description ?? ''}</td>
                                <td>{formatPrettyDate(form?.createdAt) ?? ''}</td>
                                <td>{form?.ip_address ?? ''}</td>
                                <td>{form?.user_agent ?? ''}</td>
                                <td>
                                  <ButtonGroup size="sm" aria-label="Basic example">
                                    <Button size="sm" onClick={() => navigate(`/admin/form-edit/${form._id}`)} variant="outline-primary">Edit</Button>
                                    <Button size="sm" onClick={() => handleDeleteRawForm(form._id)} variant="outline-danger">Delete</Button>
                                  </ButtonGroup>
                                </td>
                              </tr>
                            ))}

                          </tbody>
                        </Table>
                        {/* Pagination UI */}
                        <Pagination>
                          <Pagination.First
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(1)}
                          />
                          <Pagination.Prev
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                          />

                          {[...Array(pagination.totalPages)].map((_, idx) => (
                            <Pagination.Item
                              key={idx + 1}
                              active={pagination.page === idx + 1}
                              onClick={() => handlePageChange(idx + 1)}
                            >
                              {idx + 1}
                            </Pagination.Item>
                          ))}

                          <Pagination.Next
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                          />
                          <Pagination.Last
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() =>
                              handlePageChange(pagination.totalPages)
                            }
                          />
                        </Pagination>
                      </>
                    ) : (
                      <>
                        <Alert variant="danger">
                          No data
                        </Alert>
                      </>
                    )}
                  </>
                )}
              </>
            }

            <Modal show={showDeleteModal} onHide={cancelDelete} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                Are you sure you want to delete this form?
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Yes, Delete
                </Button>
              </Modal.Footer>
            </Modal>

          </div>
        </div>
      </Container>
    </>
  )
}

export default AdminDashboard
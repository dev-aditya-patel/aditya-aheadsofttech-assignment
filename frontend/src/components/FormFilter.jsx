import { useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";

const FormFilter = ({ onSearchKey }) => {
    const [searchKey, setSearchKey] = useState("");

    const handleSearchKey = () => {
        if (searchKey.trim() !== '') {
            onSearchKey(searchKey.trim());
        }
    };

    const handleClear = () => {
        setSearchKey("");
        onSearchKey("");
    };

    return (
        <Row className="mb-3">
            <Col md={6}>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search by title and name"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchKey()}
                    />
                    <Button variant="primary" onClick={handleSearchKey}>
                        Search
                    </Button>
                    <Button variant="secondary" onClick={handleClear}>
                        Clear
                    </Button>
                </InputGroup>
            </Col>
        </Row>
    );
};

export default FormFilter;

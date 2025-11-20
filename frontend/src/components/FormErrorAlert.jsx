import React from "react";
import { Alert } from "react-bootstrap";

const FormErrorAlert = ({ errorData }) => {
  if (!errorData) return null;

  return (
    <Alert variant="danger">
      <Alert.Heading>{errorData?.message}</Alert.Heading>

      {errorData?.errors && errorData?.errors?.length > 0 && (
        <ul className="mb-0">
          {errorData.errors.map((err, i) => (
            <li key={i}>
              <strong>Field:</strong> {err.field} <br />
              {err?.index && (
                <>
                  <strong>Index:</strong> {err.index} <br />
                </>
              )}
              <strong>Error:</strong> {err.message}
            </li>
          ))}
        </ul>
      )}
    </Alert>
  );
};

export default FormErrorAlert;

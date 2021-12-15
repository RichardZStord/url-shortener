import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import logo from "../logo.png";

function URLShortenerForm(props) {
  const [loading, setLoading] = useState(false);
  const [feedBack, setFeedBack] = useState({
    validated: false,
    successsful: undefined,
    message: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedBack({
      ...feedBack,
      validated: true,
    });

    if (e.currentTarget.checkValidity() === false) {
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    var res = await fetch("/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalURL: formData.get("originalURL"),
        alias: formData.get("alias"),
      }),
    });
    var resultJson = await res.json();
    setLoading(false);
    if (res.status >= 400) {
      setFeedBack({
        ...feedBack,
        message: resultJson.message,
        successful: false,
      });
    } else {
      setFeedBack({
        ...feedBack,
        successful: true,
        message: resultJson.message,
      });
    }
  };
  useEffect(() => {
    async function testConnectionToAPI() {
      const res = await fetch("http://localhost:8080/");
      const json = await res.json();
      console.log(json);
    }
    testConnectionToAPI();
  }, []);
  return (
    <Form
      onSubmit={handleSubmit.bind(this)}
      validated={feedBack.validated}
      noValidate
    >
      <Container className="m-2 pe-4 url-shortener-form d-flex bg-dark text-white m-auto align-items-center justify-content-center flex-column py-5">
        <Row className="w-100 align-items-center justify-content-center">
          <Col className="d-flex justify-content-center align-items-center">
            <img src={logo} alt="URL converter logo" className="logo ms-3" />
          </Col>
          <Col className="p-5">
            <h2 className="text-light">URL Shortener</h2>
            <Form.Group className="mb-3" controlId="originalUrl">
              <Form.Label>Original URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter URL"
                name="originalURL"
                required={true}
              />
              <Form.Text className="text-muted">
                Must be in URL format
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                A valid URL must be provided
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="alias">
              <Form.Label>Alias (optional)</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">
                  http://localhost:8080/
                </InputGroup.Text>
                <Form.Control type="text" placeholder="Alias" name="alias" />
              </InputGroup>
            </Form.Group>
            <Button type="submit">Get Shorten URL</Button>
            {loading && (
              <Spinner
                className="float-end mt-1"
                animation="border"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            <p
              className={
                feedBack.successful ? "mt-2 text-light" : "mt-2 text-danger"
              }
            >
              {feedBack.message}
            </p>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
export default URLShortenerForm;

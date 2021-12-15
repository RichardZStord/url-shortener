import { Container, Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import logo from "../logo.png";

function URLShortenerForm(props) {
  return (
    <Form>
      <Container className="m-2 pe-4 url-shortener-form d-flex bg-dark text-white m-auto align-items-center justify-content-center flex-column py-5">
        <Row className="w-100 align-items-center justify-content-center">
          <Col className="d-flex justify-content-center align-items-center">
            <img src={logo} alt="URL converter logo" className="logo" />
          </Col>
          <Col className="p-5">
            <h2 className="text-light">URL Shortener</h2>
            <Form.Group className="mb-3" controlId="originalUrl">
              <Form.Label>Original URL</Form.Label>
              <Form.Control type="url" placeholder="Enter URL" />
              <Form.Text className="text-muted">
                Must be in URL format
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="alias">
              <Form.Label>Alias (optional)</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">
                  http://localhost:8080/
                </InputGroup.Text>
                <Form.Control type="url" placeholder="Alias" />
              </InputGroup>
            </Form.Group>
            <Button type="submit">Get Shorten URL</Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
export default URLShortenerForm;

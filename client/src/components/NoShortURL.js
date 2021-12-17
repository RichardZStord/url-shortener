import { Container, Row, Col, Button } from "react-bootstrap";
import logo from "../not-found-icon-15.jpg";

function NoShortURL() {
  return (
    <Container className="m-2 pe-4 no-short-url-box d-flex bg-dark text-white m-auto align-items-center justify-content-center flex-column py-5">
      <Row className="w-100 align-items-center justify-content-center">
        <Col className="d-flex justify-content-center align-items-center">
          <img src={logo} alt="URL converter logo" className="logo ms-3" />
        </Col>
        <Col className="p-5">
          <h2 className="text-light">Alias Not Linked With URL</h2>
          <Button type="submit" href="/">
            Shorten a URL
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default NoShortURL;

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import image from "../../../images/404.svg";

const NotFound = () => {
    return (
        <Container className="mt-3">
            <Row className="justify-content-md-center">
                <Col lg={8} md={6} sm={12} className="text-center">
                    <h2>We are sorry,</h2>
                    <p>but the page you were looking for can't be found.</p>
                    <img className="w-75" src={image} alt=""/>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
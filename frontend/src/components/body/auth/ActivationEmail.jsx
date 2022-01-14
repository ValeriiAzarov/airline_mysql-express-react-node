import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import errorImage from "../../../images/bored.svg";
import successImage from "../../../images/message-sent.svg";
import axios from "axios";

const ActivationEmail = () => {
    const {activationToken} = useParams();
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (activationToken) {
            const activationEmail = async () => {
                try {
                    const result = await axios.post("http://localhost:5000/api/users/activation", {
                        activationToken
                    })
                    setSuccess(result.data.message);
                } 
                catch (error) {
                    if (error.response) {
                        setErr(error.response.data.message);
                    }
                }
            }
            activationEmail();
        }
    }, [activationToken]);

    const successPage = () => {
        return (
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col lg={8} md={6} sm={12} className="text-center">
                        <h2>{success}</h2>
                        <img className="w-75" src={successImage} alt=""/>
                    </Col>
                </Row>
            </Container>
        );
    }

    const errorPage = () => {
        return (
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col lg={8} md={6} sm={12} className="text-center">
                        <h2>{err}</h2>
                        <img className="w-100" src={errorImage} alt=""/>
                    </Col>
                </Row>
            </Container>
        );
    }

    return success ? successPage() : errorPage();
};

export default ActivationEmail;
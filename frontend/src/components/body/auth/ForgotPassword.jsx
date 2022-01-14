import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../auth/auth.css"
import { toast } from "react-toastify";
import image from "../../../images/blimp-illustration.svg";
import axios from "axios";

const initialState = {
    email: ""
};

const ForgotPassword = () => {
    const [data, setData] = useState(initialState);
    const {email} = data;

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    };

    const forgotPassword = async () => {            
        try {
            const result = await axios.post("http://localhost:5000/api/users/forgot", {email});
            toast.success(result.data.message, { 
                position: "top-right",
                autoClose: 15000,
                draggable: true
            });
        } 
        catch (error) {
            if (error.response) {
                toast.error(error.response.data.message, { 
                    position: "top-right",
                    autoClose: 15000,
                    draggable: true
                });
            }
        }
    };
    
    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col lg={4} md={6} sm={12} className="mt-5 p-3">
                        <h2>Forgot password?</h2>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="text" placeholder="Enter email" id="email" value={email} name="email" onChange={handleChangeInput} />
                        </Form.Group>
                        <Button variant="primary btn-block" type="submit" onClick={forgotPassword}>
                            VERIFY YOUR EMAIL
                        </Button>    
                    </Col>
                    <Col lg={8} md={6} sm={12}>
                        <img className="w-100" src={image} alt=""/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ForgotPassword;
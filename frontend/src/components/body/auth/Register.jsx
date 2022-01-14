import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../auth/auth.css"
import { toast } from "react-toastify";
import image from "../../../images/airport.svg";
import axios from "axios";

const initialState = {
    name: "",
    email: "",
    password: "",
    confPassword: ""
}

const Register = () => {
    const [user, setUser] = useState(initialState);
    const {name, email, password, confPassword} = user;

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await axios.post("http://localhost:5000/api/users/register", {
                name, 
                email, 
                password,
                confPassword
            });
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
                        <Form onSubmit={handleSubmit}>
                            <h2>Register</h2>
                            <Form.Group className="mb-3">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" id="name" value={name} name="name" onChange={handleChangeInput} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="text" placeholder="Enter email" id="email" value={email} name="email" onChange={handleChangeInput} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" id="password" value={password} name="password" onChange={handleChangeInput} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm password:</Form.Label>
                                <Form.Control type="password" placeholder="Enter confirm password" id="confPassword" value={confPassword} name="confPassword" onChange={handleChangeInput} />
                            </Form.Group>
                            <Button variant="primary btn-block" type="submit">
                                    REGISTER
                            </Button>
                        </Form>
                        <p>Already an account? <Link to="/login">Login</Link></p>
                    </Col>
                    <Col lg={8} md={6} sm={12}>
                        <img className="w-100" src={image} alt=""/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Register;
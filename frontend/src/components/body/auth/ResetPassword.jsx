import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../auth/auth.css"
import { toast } from "react-toastify";
import image from "../../../images/airport.svg";
import axios from "axios";

const initialState = {
    password: "",
    confPassword: ""
}

const ResetPassword = () => {
    const [data, setData] = useState(initialState);
    const {token} = useParams();
    const {password, confPassword} = data;

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    }

    const handleResetPassword = async () => {        
        try {
            const result = await axios.post("http://localhost:5000/api/users/reset", {password}, {
                headers: {
                    Authorization: token
                }
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
                        <h2>Reset password</h2>
                        <Form.Group className="mb-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" name="password" id="password" value={password} onChange={handleChangeInput} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm password:</Form.Label>
                            <Form.Control type="password" placeholder="Enter confirm password" name="confPassword" id="confPassword" value={confPassword} onChange={handleChangeInput} />
                        </Form.Group>
                        <Button variant="primary btn-block" type="submit" onClick={handleResetPassword}>
                            RESET PASSWORD
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

export default ResetPassword;
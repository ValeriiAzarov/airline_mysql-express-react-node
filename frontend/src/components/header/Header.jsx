import React from "react";
import { useSelector } from "react-redux";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../header/header.css";
import axios from "axios";

const Header = () => {
    const auth = useSelector(state => state.auth);
    const {user, isLogged, isAdmin} = auth;

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:5000/api//users/logout");
            localStorage.removeItem("firstLogin");
            window.location.href = "/";
        } 
        catch (err) {
            window.location.href = "/";
        }
    };

    const adminRouter = () => {
        return (
            <>
                <Nav.Link href="/profile">Profile</Nav.Link>
            </>
        );
    };

    const loggedRouter = () => {
        return (
            <>
                <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>
            </>
        );
    };

    return (
        <>
            <Navbar className="color-nav" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand className="navbar-brand">{isAdmin ? "ADMIN" : "FLIGHT BOOKING SYSTEM"}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse>
                    <Nav className="navbar-nav ms-auto" style={{ height: '100vh !important' }} navbarScroll>
                        <Nav.Link href="/">Home</Nav.Link>
                        {isAdmin && adminRouter()}
                        {
                            isLogged ? loggedRouter() : 
                            <>
                                <Nav.Link href="/login">Sign in</Nav.Link>
                                <Nav.Link href="/register">Sign up</Nav.Link>
                            </>
                        }
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
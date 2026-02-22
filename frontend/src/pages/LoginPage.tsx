import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import specific icons
import { faBook } from '@fortawesome/free-solid-svg-icons';

import { handlePasswordReveal, PasswordToggle } from "../utils/general.js";

const LoginPage: React.FC = () => {
	const [loginInputData, setLoginInputData] = useState({});
	const passwordInput = useRef(null);

	const updateFormInput = (events) => {
		const {id, value} = events.target;

		setLoginInputData((prevData) => ({
			...prevData,
			[id]: value
		}));
	}

	return (
		<Container fluid className="page-content-container">
			<Row className="justify-content-center align-items-center full-page-row h-100">
				<Col xs={12} md={3}>
					<div className="w-100 d-flex flex-column justify-content-center align-items-center mb-3">
						<div className="mb-3">
							<FontAwesomeIcon icon={faBook} className="logo-icon"/>
						</div>
						<div className="mb-2">
							<h1 className="mb-0 font-size-xl font-weight-bold text-center primary-text-color">
								Book Tracker
							</h1>
							
						</div>
						<div>
							<h3 className="mb-0 font-size-md font-weight-thin secondary-text-color text-center">
								Track your reading journey
							</h3>
						</div>
					</div>
					<Row className="login-tab-container mx-0 mb-3">
						<Col xs={6} className="px-1">
							<Button className="login-tab-btn active">
								Login
							</Button>
						</Col>
						<Col xs={6} className="px-1">
							<Button className="login-tab-btn">
								Register
							</Button>
						</Col>
					</Row>
					<div className="login-form-container">
						<h2 className="mb-0 font-size-lg font-weight-thick primary-text-color">
							Welcome back
						</h2>
						<p className="font-size-sm font-weight-thin secondary-text-color">
							Enter your credentials and start your reading journey.
						</p>
						<Form id="loginForm" className="mb-4">
							<Form.Group className="form-group" controlId="username">
								<Form.Label>
									Email
								</Form.Label>
								<Form.Control type="text" onChange={updateFormInput}/>
							</Form.Group>
							<Form.Group className="form-group" controlId="password">
								<Form.Label>
									Password
								</Form.Label>
								<Form.Control ref={passwordInput} type="password" onChange={updateFormInput}/>
								<PasswordToggle passwordRef={passwordInput} />
							</Form.Group>
						</Form>
						<Button variant="primary" className="w-100">
							Login
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default LoginPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {InputGroup, FormControl, Button, Form, Container} from 'react-bootstrap';
import Header from "../components/Header";


const Compare = ({ updateAuthenticationStatus }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('compare');

    // const handleSearch = () => {
    //
    // };
    //
    // const handleOptionChange = (e) => {
    //     setSelectedOption(e.target.value);
    // };

    return (

        <div>
            <h2>Compare and Suggest</h2>
            <Container>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Search for user"
                        aria-label="Search for user"
                        aria-describedby="basic-addon2"
                        value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" /*onClick={handleSearch}*/>Search</Button>
                </InputGroup>

                <Form>
                    <Form.Check
                        type="radio"
                        label="Compare Parks"
                        name="option"
                        value="compare"
                        checked={selectedOption === 'compare'}
                        // onChange={handleOptionChange}
                    />
                    <Form.Check
                        type="radio"
                        label="Suggest a Park"
                        name="option"
                        value="suggest"
                        checked={selectedOption === 'suggest'}
                        // onChange={handleOptionChange}
                    />
                </Form>
            </Container>

        </div>
);
};

export default Compare;

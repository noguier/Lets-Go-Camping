import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import App from "./App";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Dashboard from "./pages/Dashboard";

jest.mock('axios');



describe('App component', () => {
    test('renders login page by default', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        const loginElements = screen.getAllByText(/Login/i);
        expect(loginElements.length).toBeGreaterThan(0);
    });

    test('renders login page', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const loginElements = screen.getAllByText(/Login/i);
        expect(loginElements.length).toBeGreaterThan(0);
    });


    test('renders create account page', () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        const createAccountElements = screen.getAllByText(/Create Account/i);
        expect(createAccountElements.length).toBeGreaterThan(0);
    });


    test('renders dashboard page', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        const dashboardElement = screen.getByText(/Dashboard/i);
        expect(dashboardElement).toBeVisible();
    });


    test('redirects to dashboard after successful login', async () => {
        const mockedResponse = {
            data: {
                username: "testuser",
                token: "testtoken"
            }
        };
        axios.post.mockResolvedValueOnce({ data: mockedResponse });

        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
        fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));

        expect(axios.post).toHaveBeenCalledWith('/api/users/login', { username: "testuser", password: "testpassword" });

        // Wait for Dashboard to appear asynchronously
        await waitFor(() => {
            expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        });
    });

    test('displays error message if login fails', async () => {
        const mockedError = "Invalid username or password";
        axios.post.mockRejectedValueOnce({ response: { data: mockedError } });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Empty username and password
        fireEvent.click(screen.getByText(/Login/i, { selector: 'button' }));
        await waitFor(() => {
            expect(screen.getByText(/Username and password are required/i)).toBeInTheDocument();
        });

        // Empty username
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
        fireEvent.click(screen.getByText(/Login/i, { selector: 'button' }));
        await waitFor(() => {
            expect(screen.getByText(/Username required/i)).toBeInTheDocument();
        });

        // Empty password
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Login/i, { selector: 'button' }));
        await waitFor(() => {
            expect(screen.getByText(/Password required/i)).toBeInTheDocument();
        });
    });


    test('displays error message if login API call fails', async () => {
        const mockedError = "Invalid username or password";
        axios.post.mockRejectedValueOnce({ response: { data: mockedError } });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
        fireEvent.click(screen.getByText(/Login/i, { selector: 'button' }));

        await waitFor(() => {
            expect(screen.getByText(mockedError)).toBeInTheDocument();
        });
    });


    test('redirects to create account page when "Sign Up" button is clicked', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Don't have an account\? Sign Up/i));

        expect(window.location.pathname).toBe("/create");
    });

    test('calls setUsername when username input changes', () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        expect(screen.getByLabelText(/Username/i).value).toBe("testuser");
    });

    test('calls setPassword when password input changes', () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        expect(screen.getByLabelText('Password:').value).toBe("testpassword");
    });

    test('calls setConfirmPassword when confirm password input changes', () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });
        expect(screen.getByLabelText('Confirm Password:').value).toBe("testpassword");
    });

    test('submits form successfully when all fields are filled correctly', async () => {
        const mockedResponse = { data: { username: "testuser" } };
        axios.post.mockResolvedValueOnce({ data: mockedResponse });

        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/users/create', { username: "testuser", password: "testpassword" });
        });
    });

    test('displays error message when username is missing', async () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText(/username required/i)).toBeInTheDocument();
        });
    });

    test('redirects to login page when "Login" button is clicked', () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Already have an account\? /i));

        expect(window.location.pathname).toBe("/login");
    });


    test('displays error message when password is missing', async () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText(/password required/i)).toBeInTheDocument();
        });
    });

    test('displays error message when confirm password is missing', async () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText(/confirm password required/i)).toBeInTheDocument();
        });
    });

    test('displays error message when passwords do not match', async () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "differentpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
        });
    });

    test('displays error message when API call fails', async () => {
        const mockedError = "API call failed";
        axios.post.mockRejectedValueOnce({ response: { data: mockedError } });

        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText(mockedError)).toBeInTheDocument();
        });
    });


});


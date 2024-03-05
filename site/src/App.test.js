// Reset the browser history after each test
import React from "react";
import { render, screen, waitFor, fireEvent} from "@testing-library/react";
import Header from "./components/Header";
import '@testing-library/jest-dom'
import Footer from "./components/Footer";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import userEvent from "@testing-library/user-event";
import Search from './pages/Search';

test("renders header text", () => {
    const { getByText } = render(<Header />);
    const headerText = getByText(/Let's Go Camping!/i);
    expect(headerText).toBeInTheDocument();
});
test("renders footer text", () => {
    const { getByText } = render(<Footer />);
    const headerText = getByText(/Let's Go Camping! Team 17/i);
    expect(headerText).toBeInTheDocument();
});

test("render App", () => {

    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });

});

describe('Search component', () => {
    test('renders Search', () => {
        render(<Search />);

        // Check if search input and type radio buttons are rendered
        expect(screen.getByPlaceholderText(/Enter park name/i)).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Search by Activity'));
        fireEvent.click(screen.getByLabelText('Search by Name'));
        expect(screen.getByLabelText('Search by Name')).toBeChecked();
        expect(screen.getByLabelText('Search by Name')).toBeInTheDocument();
        expect(screen.getByLabelText(/Search by Name/)).toBeChecked();
        expect(screen.getByLabelText(/Search by Name/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Search by State/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Search by Activity/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Search by Amenity/)).toBeInTheDocument();
    });

    test('search by name', async () => {
        render(<Search />);

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [{ fullName: 'Park 1', description: 'Description of Park 1' },
                    { fullName: 'Park 2', description: 'Description of Park 2' },
                    { fullName: 'Park 3', description: 'Description of Park 3' }]
            })
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter park name/), { target: { value: 'Park' } });
        fireEvent.click(screen.getByLabelText('Search by Name'));
        fireEvent.click(screen.getByText("Search"));


        await waitFor(() => {
            expect(screen.getByText("Park 1")).toBeInTheDocument();
            expect(screen.getByText("Description of Park 1")).toBeInTheDocument();

            expect(screen.getByText("Park 2")).toBeInTheDocument();
            expect(screen.getByText("Description of Park 2")).toBeInTheDocument();

            expect(screen.getByText("Park 3")).toBeInTheDocument();
            expect(screen.getByText("Description of Park 3")).toBeInTheDocument();
        });
    });
    test('search by state', async () => {
        render(<Search />);
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [{ fullName: 'Park 1', description: 'Description of Park 1' },
                    { fullName: 'Park 2', description: 'Description of Park 2' },
                    { fullName: 'Park 3', description: 'Description of Park 3' }]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by State'));
        fireEvent.change(screen.getByPlaceholderText('Enter 2-letter state code'), { target: { value: 'CA' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText("Park 1")).toBeInTheDocument();
            expect(screen.getByText("Description of Park 1")).toBeInTheDocument();

            expect(screen.getByText("Park 2")).toBeInTheDocument();
            expect(screen.getByText("Description of Park 2")).toBeInTheDocument();

            expect(screen.getByText("Park 3")).toBeInTheDocument();
            expect(screen.getByText("Description of Park 3")).toBeInTheDocument();
        });
    });
    test('search by activity', async () => {
        render(<Search />);

        // Mocking fetch function to return sample data
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    {
                        name: 'Hiking',
                        parks: [{ fullName: 'Park 1', description: 'Description of Park 1' },
                            { fullName: 'Park 2', description: 'Description of Park 2' }]
                    },
                ]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by Activity'));

        // Enter search term and submit form
        fireEvent.change(screen.getByPlaceholderText('Enter activity'), { target: { value: 'Hiking' } });
        fireEvent.click(screen.getByText('Search'));

        // Wait for search results to be displayed
        await waitFor(() => {
            expect(screen.getByText('Park 1')).toBeInTheDocument();
            expect(screen.getByText('Park 2')).toBeInTheDocument();
        });
    });
    test('search by amenity', async () => {
        render(<Search />);

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    [
                        { name: 'Amenity 1', parks: [{ fullName: 'Park 1' }, { fullName: 'Park 2' }] },
                    ]
                ]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by Amenity'));
        fireEvent.change(screen.getByPlaceholderText('Enter amenity'), { target: { value: 'Picnic Area' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText('Amenity 1')).toBeInTheDocument();
            expect(screen.getByText('Park 1')).toBeInTheDocument();
            expect(screen.getByText('Park 2')).toBeInTheDocument();
        });
    });
    test('blank search term', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Search />);
        global.fetch = jest.fn().mockResolvedValue({});
        fireEvent.click(screen.getByText('Search'));
        expect(window.alert).toHaveBeenCalledWith('Please enter your search term');
        jest.restoreAllMocks();
    });
    test('fetch error', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Search />);
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('Fetch Error'));
        fireEvent.change(screen.getByPlaceholderText(/Enter park name/), { target: { value: 'Park' } });
        fireEvent.click(screen.getByText('Search'));
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Fetch Error');
        });
        jest.restoreAllMocks();
    });
});
afterEach(() => {
    window.history.pushState(null, document.title, "/");
});



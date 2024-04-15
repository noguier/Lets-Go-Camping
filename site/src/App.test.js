// Reset the browser history after each test
import React from "react";
import {renderParkInfo} from './components/Result'; // Assuming renderParkDetails function is exported
import {
    render,
    screen,
    waitFor,
    fireEvent, getByText, getByAltText, getByTestId, findByText,
} from "@testing-library/react";
import Header from "./components/Header";
import '@testing-library/jest-dom'
import Footer from "./components/Footer";
import {BrowserRouter, MemoryRouter} from "react-router-dom";
import App from "./App";
import Search from './pages/Search';
import "@testing-library/jest-dom/extend-expect";
import axios from 'axios';
import Login from "./pages/Login";
import Create from "./pages/Create";
import Dashboard from "./pages/Dashboard";
import {act} from "react-dom/test-utils";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
//jest.mock('axios');


// Mock axios post method

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({data: { /* mocked data if needed */}})),
    get: jest.fn((url) => {
        if (url === '/api/users/authenticated') {
            // Return a promise that resolves to a mock authentication status
            return Promise.resolve({data: true});
        } else {
            // Handle other URLs if needed
            return Promise.resolve({data: { /* mocked data if needed */}});
        }
    })
}));

test("renders header text", () => {
    const {getByText} = render(
        <BrowserRouter>
            <Header/>
        </BrowserRouter>
    );
    const headerText = getByText("Let's Go Camping!");
    expect(headerText).toBeInTheDocument();
});


describe("Header Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders header with login and register links when not authenticated", () => {
        render(<BrowserRouter>
            <Header authenticated={false}/>
        </BrowserRouter>);
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
    });

    test("renders header with navigation links and logout button when authenticated", () => {
        render(<BrowserRouter>
            <Header authenticated={true}/>
        </BrowserRouter>);
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
        expect(screen.getByText("Favorites")).toBeInTheDocument();
        expect(screen.getByText("Compare and Suggest")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test('favorites link', async () => {
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header authenticated={true}/>
            </BrowserRouter>);

        // Click the  Favorites link
        fireEvent.click(screen.getByText('Favorites'));

        // Check if navigate is called with the correct path
        expect(window.location.pathname).toBe("/favorites");
    });
    test('search link', async () => {
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header authenticated={true}/>
            </BrowserRouter>);

        // Click the  search link
        fireEvent.click(screen.getByText('Search'));

        // Check if navigate is called with the correct path
        expect(window.location.pathname).toBe("/search");
    });

    test('compare and suggest link', async () => {
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header authenticated={true}/>
            </BrowserRouter>);

        // Click the link
        fireEvent.click(screen.getByText('Compare and Suggest'));

        // Check if navigate is called with the correct path
        expect(window.location.pathname).toBe("/compare");
    });

    test('Load More button functionality', async () => {
        // Mock more than 10 search results
        const mockSearchResults = [];
        for (let i = 1; i <= 15; i++) {
            mockSearchResults.push({
                fullName: `Park ${i}`,
                description: `Description for Park ${i}`
            });
        }

        render(
            <BrowserRouter>
                <Search/>
            </BrowserRouter>
        );

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({data: mockSearchResults})
        });

        fireEvent.click(screen.getByLabelText('Search by State'));
        fireEvent.change(screen.getByPlaceholderText('Enter 2-letter state code'), {target: {value: 'CA'}});
        fireEvent.click(screen.getByText('Search'));

        // Wait for the initial search results to be displayed
        await waitFor(() => {
            for (let i = 1; i <= 10; i++) {
                const parkNameHeading = screen.getByRole('heading', {name: `Park ${i}`});
                expect(parkNameHeading).toBeInTheDocument();
            }
        });

        // Click the Load More button
        fireEvent.click(screen.getByText('Load More'));

        // Wait for additional results to be displayed
        await waitFor(() => {
            for (let i = 11; i <= 15; i++) {
                const parkNameHeading = screen.getByRole('heading', {name: `Park ${i}`});
                expect(parkNameHeading).toBeInTheDocument();
            }
        });
    });


    test('logout button', async () => {
        const updateAuthenticationStatusMock = jest.fn();
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}
                        authenticated={true}/>
            </BrowserRouter>
        );

        // Mock the axios post request
        jest.spyOn(axios, 'post').mockResolvedValueOnce();

        // Click the logout button
        fireEvent.click(screen.getByText('Logout'));

        // Check if axios.post is called with the correct endpoint
        expect(axios.post).toHaveBeenCalledWith('/api/users/logout');

        // Check if updateAuthenticationStatus and navigate are called
        await waitFor(() => {
            expect(updateAuthenticationStatusMock).toHaveBeenCalledWith(false);
            expect(window.location.pathname).toBe("/login");
        });
    });
    test('logout button fail', async () => {
        const updateAuthenticationStatusMock = jest.fn();
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}
                        authenticated={true}/>
                <Search updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}/>
            </BrowserRouter>);

        // Mock the axios post request to simulate a failed logout
        jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Logout Error'));

        // Mock console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });

        // Click the logout button
        fireEvent.click(screen.getByText('Logout'));

        // Check if axios.post is called with the correct endpoint
        expect(axios.post).toHaveBeenCalledWith('/api/users/logout');

        // Check if updateAuthenticationStatus and navigate are not called
        expect(updateAuthenticationStatusMock).not.toHaveBeenCalled();
        expect(navigateMock).not.toHaveBeenCalled();

        // Check if console.error is called with the error message
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
        });

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });
});
test("renders footer text", () => {
    const {getByText} = render(<Footer/>);
    const headerText = getByText(/Let's Go Camping! Team 17/i);
    expect(headerText).toBeInTheDocument();
});

it('handles error when checking authentication status', async () => {
    axios.get.mockRejectedValueOnce(new Error('Authentication error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
    });

    render(
        <MemoryRouter initialEntries={['/']}>
            <App/>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error checking authentication status:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
});


describe('Search component', () => {


    test('logout button', async () => {
        const updateAuthenticationStatusMock = jest.fn();
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}
                        authenticated={true}/>
                <Search updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}/>
            </BrowserRouter>
        );

        // Mock the axios post request
        jest.spyOn(axios, 'post').mockResolvedValueOnce();

        // Click the logout button
        fireEvent.click(screen.getByText('Logout'));

        // Check if axios.post is called with the correct endpoint
        expect(axios.post).toHaveBeenCalledWith('/api/users/logout');

        // Check if updateAuthenticationStatus and navigate are called
        await waitFor(() => {
            expect(updateAuthenticationStatusMock).toHaveBeenCalledWith(false);
            expect(window.location.pathname).toBe("/login");
        });
    });


    test('logout button fail', async () => {
        const updateAuthenticationStatusMock = jest.fn();
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}
                        authenticated={true}/>
                <Search updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock}/>
            </BrowserRouter>);

        // Mock the axios post request to simulate a failed logout
        jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Logout Error'));

        // Mock console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });

        // Click the logout button
        fireEvent.click(screen.getByText('Logout'));

        // Check if axios.post is called with the correct endpoint
        expect(axios.post).toHaveBeenCalledWith('/api/users/logout');

        // Check if updateAuthenticationStatus and navigate are not called
        expect(updateAuthenticationStatusMock).not.toHaveBeenCalled();
        expect(navigateMock).not.toHaveBeenCalled();

        // Check if console.error is called with the error message
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
        });

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });


    // test('favorites button', async () => {
    //     const navigateMock = jest.fn();
    //
    //     render(
    //         <BrowserRouter>
    //             <Search />
    //         </BrowserRouter>        );
    //
    //     // Click the go to Favorites button
    //     fireEvent.click(screen.getByText('Go to Favorites'));
    //
    //     // Check if navigate is called with the correct path
    //     expect(window.location.pathname).toBe("/favorites");
    // });


    test('renders Search', () => {
        render(
            <BrowserRouter>
                <Search/>
            </BrowserRouter>);


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
        render(<BrowserRouter>
            <Search/>
        </BrowserRouter>);

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [{
                    fullName: 'Castle Mountains National Monument',
                    description: 'Description: Castle Mountains represents some of the most unique elements of the Mojave Desert. Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history. This intriguing area provides serenity and solitude from nearby metropolitan areas.'
                },
                    {
                        fullName: 'Joshua Tree National Park',
                        description: 'Description: Two distinct desert ecosystems, the Mojave and the Colorado, come together in Joshua Tree National Park. A fascinating variety of plants and animals make their homes in a land sculpted by strong winds and occasional torrents of rain. Dark night skies, a rich cultural history, and surreal geologic features add to the wonder of this vast wilderness in southern California. Come explore for yourself!'
                    },
                    {
                        fullName: 'Mojave National Preserve',
                        description: 'Description: Mojave preserves a diverse mosaic of ecological habitats and a 10,000 year history of human connection with the desert. Offering extensive opportunities to experience desert landscapes, the preserve promotes understanding and appreciation for the increasingly threatened resources of the Mojave Desert. This remote preserve encourages a sense of discovery and a connection to wild places.'
                    }]
            })
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter park name/), {target: {value: 'Park'}});
        fireEvent.click(screen.getByLabelText('Search by Name'));
        fireEvent.click(screen.getByText("Search"));


        await waitFor(() => {
            const h3_C = screen.getByRole('heading', {name: 'Castle Mountains National Monument'});
            expect(h3_C).toBeInTheDocument();
            const h3_J = screen.getByRole('heading', {name: 'Joshua Tree National Park'});
            expect(h3_J).toBeInTheDocument();
            const h3_M = screen.getByRole('heading', {name: 'Mojave National Preserve'});
            expect(h3_M).toBeInTheDocument();
        });
    });
    test('search by state', async () => {
        render(<BrowserRouter>
            <Search/>
        </BrowserRouter>);
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [{
                    fullName: 'Alcatraz Island',
                    description: 'Description: Alcatraz reveals stories of American incarceration, justice, and our common humanity. This small island was once a fort, a military prison, and a maximum security federal penitentiary. In 1969, the Indians of All Tribes occupied Alcatraz for 19 months in the name of freedom and Native American civil rights. We invite you to explore Alcatraz\'s complex history and natural beauty.'
                },
                    {
                        fullName: 'Butterfield Overland National Historic Trail',
                        description: 'Description: In 1857, businessman and transportation entrepreneur John Butterfield was awarded a contract to establish an overland mail route between the eastern United States and growing populations in the Far West. What became known as the Butterfield Overland Trail made an arcing sweep across the southern rim of the country. Stagecoaches left twice a week carrying passengers, freight, and mail.'
                    },
                    {
                        fullName: 'Cabrillo National Monument',
                        description: 'Description: Climbing out of his boat and onto shore in 1542, Juan Rodriguez Cabrillo stepped into history as the first European to set foot on what is now the West Coast of the United States. In addition to telling the story of 16th century exploration, the park is home to a wealth of cultural and natural resources. Join us and embark on your own Voyage of Exploration.'
                    }]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by State'));
        fireEvent.change(screen.getByPlaceholderText('Enter 2-letter state code'), {target: {value: 'CA'}});
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            const h3_A = screen.getByRole('heading', {name: 'Alcatraz Island'});
            expect(h3_A).toBeInTheDocument();
            const h3_B = screen.getByRole('heading', {name: 'Butterfield Overland National Historic Trail'});
            expect(h3_B).toBeInTheDocument();
            const h3_C = screen.getByRole('heading', {name: 'Cabrillo National Monument'});
            expect(h3_C).toBeInTheDocument();

        });
    });
    test('search by activity', async () => {
        render(<BrowserRouter>
            <Search/>
        </BrowserRouter>);

        // Mocking fetch function to return sample data
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    {
                        name: 'Hiking',
                        parks: [{fullName: 'Acadia National Park'}]
                    },
                ]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by Activity'));

        // Enter search term and submit form
        fireEvent.change(screen.getByPlaceholderText('Enter activity'), {target: {value: 'Hiking'}});
        fireEvent.click(screen.getByText('Search'));

        // Wait for search results to be displayed
        await waitFor(() => {
            expect(screen.getByText('Acadia National Park')).toBeInTheDocument();
        });
    });
    test('search by amenity', async () => {
        render(
            <BrowserRouter>
                <Search/>
            </BrowserRouter>
        );

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    [
                        {name: 'Accessible Restrooms', parks: [{fullName: 'Park A'}, {fullName: 'Park B'}]},
                        {name: 'Fire Pit', parks: [{fullName: 'Park C'}]}
                    ]
                ]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by Amenity'));

        // Enter search term and submit form
        fireEvent.change(screen.getByPlaceholderText('Enter amenity'), {target: {value: 'Restrooms'}});
        fireEvent.click(screen.getByText('Search'));

        // Wait for search results to be displayed
        await waitFor(() => {
            expect(screen.getByText('Accessible Restrooms')).toBeInTheDocument();
            expect(screen.getByText('Park A')).toBeInTheDocument();
            expect(screen.getByText('Park B')).toBeInTheDocument();

            expect(screen.getByText('Fire Pit')).toBeInTheDocument();
            expect(screen.getByText('Park C')).toBeInTheDocument();
        });
    });


    // test('search with no search type selected', async () => {
    //     render(
    //         <BrowserRouter>
    //             <Search />
    //         </BrowserRouter>
    //     );
    //
    //     global.fetch = jest.fn().mockResolvedValueOnce({
    //         json: async () => ({
    //             data: [{ fullName: 'No Search Type Park', description: 'Description for No Search Type Park' }]
    //         })
    //     });
    //
    //     // Set search term without setting search type
    //     fireEvent.change(screen.getByPlaceholderText(/Enter park name/), { target: { value: 'Park' } });
    //     fireEvent.click(screen.getByText("Search"));
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Park Name: No Search Type Park")).toBeInTheDocument();
    //     });
    // });


    test('blank search term', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        render(<BrowserRouter>
            <Search/>
        </BrowserRouter>);
        global.fetch = jest.fn().mockResolvedValue({});
        fireEvent.click(screen.getByText('Search'));
        expect(window.alert).toHaveBeenCalledWith('Please enter your search term');
        jest.restoreAllMocks();
    });


    test('fetch error', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        render(<BrowserRouter>
            <Search/>
        </BrowserRouter>);
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('Fetch Error'));
        fireEvent.change(screen.getByPlaceholderText(/Enter park name/), {target: {value: 'Park'}});
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


describe('Login/Create component', () => {
    // test('renders login page by default', () => {
    //     render(
    //         <BrowserRouter>
    //             <App />
    //         </BrowserRouter>
    //     );
    //
    //     const loginElements = screen.getAllByText(/Login/i);
    //     expect(loginElements.length).toBeGreaterThan(0);
    // });

    test('renders login page', () => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );

        const loginElements = screen.getAllByText(/Login/i);
        expect(loginElements.length).toBeGreaterThan(0);
    });


    test('renders create account page', () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        const createAccountElements = screen.getAllByText(/Create Account/i);
        expect(createAccountElements.length).toBeGreaterThan(0);
    });


    test('renders dashboard page', () => {
        render(
            <BrowserRouter>
                <Dashboard/>
            </BrowserRouter>
        );

        const dashboardElement = screen.getByText(/Dashboard/i);
        expect(dashboardElement).toBeVisible();
    });


    // test('redirects to dashboard after successful login', async () => {
    //     const mockedResponse = {
    //         data: {
    //             username: "testuser",
    //             token: "testtoken"
    //         }
    //     };
    //     axios.post.mockResolvedValueOnce({ data: mockedResponse });
    //
    //     render(
    //         <BrowserRouter>
    //             <App />
    //         </BrowserRouter>
    //     );
    //
    //     fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    //     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
    //     fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));
    //
    //     expect(axios.post).toHaveBeenCalledWith('/api/users/login', { username: "testuser", password: "testpassword" });
    //
    //     // Wait for Dashboard to appear asynchronously
    //     await waitFor(() => {
    //         expect(screen.getByText((content, element) => {
    //             // Custom logic to match text
    //             return content.includes('Search Parks') && element.tagName.toLowerCase() === 'h1';
    //         })).toBeInTheDocument();
    //     });
    // });


    test('displays error message if login fails', async () => {
        const mockedError = "Invalid username or password";
        axios.post.mockRejectedValueOnce({response: {data: mockedError}});

        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );

        // Empty username and password
        fireEvent.click(screen.getByText(/Login/i, {selector: 'button'}));
        await waitFor(() => {
            expect(screen.getByText(/Username and password are required/i)).toBeInTheDocument();
        });

        // Empty username
        fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpassword"}});
        fireEvent.click(screen.getByText(/Login/i, {selector: 'button'}));
        await waitFor(() => {
            expect(screen.getByText(/Username required/i)).toBeInTheDocument();
        });

        // Empty password
        fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: ""}});
        fireEvent.click(screen.getByText(/Login/i, {selector: 'button'}));
        await waitFor(() => {
            expect(screen.getByText(/Password required/i)).toBeInTheDocument();
        });
    });


    test('displays error message if login API call fails', async () => {
        const mockedError = "Invalid username or password";
        axios.post.mockRejectedValueOnce({response: {data: mockedError}});

        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );
        fillWithTestValueAndSubmit("Login")

        await waitFor(() => {
            expect(screen.getByText(mockedError)).toBeInTheDocument();
        });
    });


    test('redirects to create account page when "Sign Up" button is clicked', () => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Don't have an account\? Sign Up/i));

        expect(window.location.pathname).toBe("/create");
    });

    test('calls setUsername when username input changes', () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
        expect(screen.getByLabelText(/Username/i).value).toBe("testuser");
    });

    test('calls setPassword when password input changes', () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Password:'), {target: {value: "testpassword"}});
        expect(screen.getByLabelText('Password:').value).toBe("testpassword");
    });

    test('calls setConfirmPassword when confirm password input changes', () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Confirm Password:'), {target: {value: "testpassword"}});
        expect(screen.getByLabelText('Confirm Password:').value).toBe("testpassword");
    });

    test('submits form successfully when all fields are filled correctly', async () => {
        const mockedResponse = {data: {username: "testuser"}};
        axios.post.mockResolvedValueOnce({data: mockedResponse});

        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );
        fillWithTestValueAndSubmit("Create Account")

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/users/create', {
                username: "testuser",
                password: "testpassword"
            });
        });
    });

    test('displays error message when username is missing', async () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Password:'), {target: {value: "testpassword"}});
        fireEvent.change(screen.getByLabelText('Confirm Password:'), {target: {value: "testpassword"}});

        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));

        await waitFor(() => {
            expect(screen.getByText(/username required/i)).toBeInTheDocument();
        });
    });

    test('redirects to login page when "Login" button is clicked', () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Already have an account\? /i));

        expect(window.location.pathname).toBe("/login");
    });


    test('displays error message when password is missing', async () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText('Confirm Password:'), {target: {value: "testpassword"}});

        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));

        await waitFor(() => {
            expect(screen.getByText(/password required/i)).toBeInTheDocument();
        });
    });

    test('displays error message when confirm password is missing', async () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText('Password:'), {target: {value: "testpassword"}});

        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));

        await waitFor(() => {
            expect(screen.getByText(/confirm password required/i)).toBeInTheDocument();
        });
    });

    test('displays error message when passwords do not match', async () => {
        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Username:'), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText('Password:'), {target: {value: "testpassword"}});
        fireEvent.change(screen.getByLabelText('Confirm Password:'), {target: {value: "differentpassword"}});

        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));

        await waitFor(() => {
            expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
        });
    });

    test('displays error message when API call fails', async () => {
        const mockedError = "API call failed";
        axios.post.mockRejectedValueOnce({response: {data: mockedError}});

        render(
            <BrowserRouter>
                <Create/>
            </BrowserRouter>
        );
        fillWithTestValueAndSubmit("Create Account")

        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));

        fireEvent.change(screen.getByLabelText('Username:'), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText('Password:'), {target: {value: "testpassword"}});
        fireEvent.change(screen.getByLabelText('Confirm Password:'), {target: {value: "testpassword"}});

        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));

        await waitFor(() => {
            expect(screen.getByText(mockedError)).toBeInTheDocument();
        });
    });

    test('redirects to search page after successful login', async () => {
        const mockedResponse = {
            data: {
                username: "testuser",
                token: "testtoken"
            }
        };
        axios.post.mockResolvedValueOnce({data: mockedResponse});

        render(
            <BrowserRouter>
                <Login updateAuthenticationStatus={() => {
                }}/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpassword"}});
        fireEvent.click(screen.queryByText(/Login/i, {selector: 'button'}));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/users/login', {
                username: "testuser",
                password: "testpassword"
            });
            expect(window.location.pathname).toBe("/search");
        });
    });


    // test('redirects to search page after successful authentication', async () => {
    //     const mockedLoginResponse = {
    //         username: "testuser",
    //         token: "testtoken"
    //     };
    //
    //     // Mock the login request
    //     axios.post.mockResolvedValueOnce({ data: mockedLoginResponse });
    //
    //     // Render the App
    //     render(
    //         <MemoryRouter>
    //             <App />
    //         </MemoryRouter>
    //     );
    //
    //     // Simulate login
    //     fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    //     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
    //     fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));
    //
    //     // Wait for login request to complete
    //     await waitFor(() => {
    //         expect(axios.post).toHaveBeenCalledWith('/api/users/login', { username: "testuser", password: "testpassword" });
    //         expect(window.location.pathname).toBe("/search");
    //     });
    //
    //     // Mock the authentication status check
    //     axios.get.mockResolvedValueOnce({ data: true });
    //
    //     // Rerender App to trigger useEffect hook to check authentication status
    //     render(
    //         <MemoryRouter>
    //             <Search updateAuthenticationStatus={true}/>
    //         </MemoryRouter>
    //     );
    //
    //     // Ensure Search component is rendered after authentication
    //     await waitFor(() => {
    //         expect(window.location.pathname).toBe("/search");
    //     });
    // });


});


// Mock the updateAuthenticationStatus function
const mockUpdateAuthenticationStatus = jest.fn();

test('should update authentication status on successful login', async () => {
    const mockedResponse = {
        data: {
            username: "testuser",
            token: "testtoken"
        }
    };
    axios.post.mockResolvedValueOnce({data: mockedResponse});

    render(
        <BrowserRouter>
            <Login updateAuthenticationStatus={mockUpdateAuthenticationStatus}/>
        </BrowserRouter>
    );

    // Fill in the username and password fields
    fireEvent.change(screen.getByLabelText('Username:'), {target: {value: 'testuser'}});
    fireEvent.change(screen.getByLabelText('Password:'), {target: {value: 'testpassword'}});

    // Submit the form
    fireEvent.click(screen.queryByText(/Login/i, {selector: 'button'}));

    // Wait for the API call to resolve
    await waitFor(() => {
        expect(mockUpdateAuthenticationStatus).toHaveBeenCalledWith(true);
        expect(window.location.pathname).toBe("/search");
    });
});

test('should render Login page when not authenticated', async () => {
    axios.get.mockResolvedValueOnce({data: false});

    const {getByText} = render(
        <MemoryRouter>
            <App/>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(window.location.pathname).toBe("/");
    });
});


test('should update authentication status app comp', async () => {
    const mockedResponse = {
        data: {
            username: "testuser",
            token: "testtoken"
        }
    };
    axios.post.mockResolvedValueOnce({data: mockedResponse});
    axios.get.mockResolvedValueOnce({});

    render(
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    );

    // Fill in the username and password fields
    fireEvent.change(screen.getByLabelText('Username:'), {target: {value: 'testuser'}});
    fireEvent.change(screen.getByLabelText('Password:'), {target: {value: 'testpassword'}});

    // Submit the form
    fireEvent.click(screen.queryByText(/Login/i, {selector: 'button'}));

    // Wait for the API call to resolve
    await waitFor(() => {
        expect(window.location.pathname).toBe("/search");
    });
});
describe('compare component', () => {
    // Mock updateAuthenticationStatus function
    const mockUpdateAuthStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        const {getByText} = render(
            <BrowserRouter>
                <Compare updateAuthenticationStatus={mockUpdateAuthStatus}/>
            </BrowserRouter>
        );
        expect(getByText('Compare and Suggest')).toBeInTheDocument();
    });
});

describe('Favorites component', () => {
    // Mock updateAuthenticationStatus function
    const mockUpdateAuthStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        const {getByText} = render(
            <BrowserRouter>
                <Favorites updateAuthenticationStatus={mockUpdateAuthStatus}/>
            </BrowserRouter>
        );
        expect(getByText('Favorites')).toBeInTheDocument();
    });

    // test('clicking logout button calls handleLogout', async () => {
    //     const { getByText } = render(
    //         <BrowserRouter>
    //             <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
    //         </BrowserRouter>
    //     );
    //     fireEvent.click(getByText('Logout'));
    //     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    // });
    //
    // test('handleLogout function updates authentication status and navigates to login', async () => {
    //     axios.post.mockResolvedValueOnce(); // Mock axios post call
    //
    //     const { getByText } = render(
    //         <BrowserRouter>
    //             <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
    //         </BrowserRouter>
    //     );
    //     fireEvent.click(getByText('Logout'));
    //
    //     await waitFor(() => {
    //         expect(mockUpdateAuthStatus).toHaveBeenCalledWith(false);
    //         expect(window.location.pathname).toBe('/login');
    //     });
    // });

    // test('handleLogout function logs error on failure', async () => {
    //     const error = new Error('Logout failed');
    //     axios.post.mockRejectedValueOnce(error); // Mock axios post to reject with an error
    //
    //     // Mock console.error
    //     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    //
    //     const { getByText } = render(
    //         <BrowserRouter>
    //             <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
    //         </BrowserRouter>
    //     );
    //     fireEvent.click(getByText('Logout'));
    //
    //     await waitFor(() => {
    //         expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', error);
    //     });
    //
    //     consoleErrorSpy.mockRestore(); // Restore original console.error function
    // });
});


const fillWithTestValueAndSubmit = (action) => {
    if (action === "Login") {
        fireEvent.change(screen.getByLabelText(/Username/i), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: "testpassword"}});
        fireEvent.click(screen.queryByText(/Login/i, {selector: 'button'}));
    } else if (action === "Create Account") {
        fireEvent.change(screen.getByLabelText('Username:'), {target: {value: "testuser"}});
        fireEvent.change(screen.getByLabelText('Password:'), {target: {value: "testpassword"}});
        fireEvent.change(screen.getByLabelText('Confirm Password:'), {target: {value: "testpassword"}});
        fireEvent.submit(screen.getByRole('button', {name: /Create Account/i}));
    }
}

describe('Results Component', () => {
    const park = {
        fullName: 'Test Park',
        parkCode: 'TEST123',
        url: 'https://example.com',
        addresses: [{city: 'Test City', stateCode: 'TS'}],
        entranceFees: [{cost: 10, description: 'Test Fee Description'}],
        description: 'Test Description',
        activities: [{name: 'Hiking'}],
        images: [{url: 'https://example.com/image.jpg', altText: 'Test Alt', title: 'Test Title'}],
    };

    const parkDetails = {
        fullName: 'Test Park',
        url: 'https://example.com',
        addresses: [{city: 'Test City', stateCode: 'TS'}],
        entranceFees: [{cost: 10, description: 'Test Description'}],
        description: 'Test Description',
        activities: [{name: 'Hiking'}],
        images: [{url: 'https://example.com/image.jpg', altText: 'Test Alt', title: 'Test Title'}],
    };
    const setParkDetails = jest.fn();
    const page = 'search';
    const mockedResponses = {
        '/api/parks?searchTerm=TEST123&searchType=parkClick': {data: [{fullName: 'Test Park'}]},
        '/api/parks?searchTerm=TEST123&searchType=amenity_parkcode': {data: [{id: 1, name: 'Amenity 1'}]},
    };

    global.fetch = jest.fn().mockImplementation((url) =>
        Promise.resolve({
            json: () => Promise.resolve(mockedResponses[url]),
        })
    );

    it('should render park details correctly when expanded', async () => {
        const {getByText, getByTestId} = render(
            renderParkInfo(park, parkDetails, setParkDetails, page)
        );

        fireEvent.click(getByTestId('list-element-toggle'));

        await waitFor(() => {
            expect(getByText('Test Park')).toBeInTheDocument();
            expect(getByText('Website')).toHaveAttribute('href', 'https://example.com');
            expect(getByText('Test City, TS')).toBeInTheDocument();
            expect(getByText('Entrance Fee:')).toBeInTheDocument();
            expect(getByText('$10')).toBeInTheDocument();
            // expect(getByText(/^Entrance Fee Description:/)).toBeInTheDocument(); // Using regex to match text
            // expect(getByText('Test Fee Description')).toBeInTheDocument();
            expect(getByText('Test Description')).toBeInTheDocument();
            expect(getByText('Activities:')).toBeInTheDocument();
            expect(getByText('Hiking')).toBeInTheDocument();
            expect(getByText('Amenities:')).toBeInTheDocument();
            expect(getByText('NA')).toBeInTheDocument();
            // expect(getByText('Added to favorites list')).toBeInTheDocument();
            const imageElement = screen.getByAltText('Test Alt');
            expect(imageElement).toHaveAttribute('src', 'https://example.com/image.jpg');
        });
        fireEvent.click(getByTestId('list-element-toggle'));
    });

    it('should handle park click and fetch data correctly', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    data: [parkDetails],
                }),
        });

        const {getByText, getByTestId} = render(
            renderParkInfo(park, parkDetails, setParkDetails, page)
        );
        fireEvent.click(getByText('Test Park'));

        await waitFor(() => {
            expect(setParkDetails).toHaveBeenCalledWith(parkDetails);
            expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=parkClick');
        });
    });

    it('should show plus button on mouse enter', () => {
        const park = {
            fullName: 'Test Park',
            parkCode: 'TP',
        };
        const {getByTestId} = render(renderParkInfo(park, null, setParkDetails, 'search'));

        const parkElement = getByTestId('list-element-toggle');

        fireEvent.mouseEnter(parkElement);

        expect(parkElement).toMatchSnapshot('<div data-testid="list-element-toggle" id="expand"><h3>Test Park</h3><a data-testid="plus-button" href="#" style="position: relative; top: 0px; right: 0px;"><svg aria-hidden="true" class="svg-inline--fa fa-plus " data-icon="plus" data-prefix="fas" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="currentColor" /></svg></a></div>'); // Plus button should be present
    });

    it('should hide plus button on mouse leave', () => {
        const park = {
            fullName: 'Test Park',
            parkCode: 'TP',
        };
        const {getByTestId} = render(renderParkInfo(park, null, setParkDetails, 'search'));

        const parkElement = getByTestId('list-element-toggle');

        fireEvent.mouseLeave(parkElement);
//<div data-testid="list-element-toggle" id="expand"><h3>Test Park</h3><a data-testid="plus-button" href="#" style="position: relative; top: 0px; right: 0px;"><svg aria-hidden="true" class="svg-inline--fa fa-plus " data-icon="plus" data-prefix="fas" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="currentColor" /></svg></a></div>
        expect(parkElement).not.toContainHTML('<div data-testid="list-element-toggle" id="expand"><h3>Test Park</h3><a data-testid="plus-button" href="#" style="position: relative; top: 0px; right: 0px;"><svg aria-hidden="true" class="svg-inline--fa fa-plus " data-icon="plus" data-prefix="fas" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="currentColor" /></svg></a></div>'); // Plus button should not be present
    });
    it('should call setParkDetails with data from fetch when successful', async () => {
        const mockPark = {fullName: 'Test Park', parkCode: 'TP'};
        const mockData = {data: [{fullName: 'Test Park', url: 'https://testpark.com'}]};
        global.fetch = jest.fn().mockResolvedValueOnce({json: jest.fn().mockResolvedValueOnce(mockData)});

        const setParkDetails = jest.fn();
        const {getByText} = render(renderParkInfo(mockPark, null, setParkDetails, 'search'));

        fireEvent.click(getByText('Test Park'));

        await waitFor(() => expect(setParkDetails).toHaveBeenCalledWith(mockData.data[0]));
    });

    it('should fetch park amenities with populate amenities', async () => {
        const park = {
            fullName: 'Test Park',
            parkCode: 'TEST123',
        };
        const parkDetails = null;
        const setParkDetails = jest.fn();
        const page = 'search';

        // Render the component
        render(renderParkInfo(park, parkDetails, setParkDetails, page));

        // Simulate a click event to trigger the asynchronous function
        fireEvent.click(screen.getByText('Test Park'));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=parkClick'));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=amenity_parkcode'));
    });

    // test('should alert "Added to favorites" when plus button is clicked', async () => {
    //     const park = {
    //         fullName: 'Test Park',
    //         parkCode: 'TEST123',
    //     };
    //     const parkDetails = null;
    //     const setParkDetails = jest.fn();
    //     const page = 'search';
    //
    //     // Spy on window.alert
    //     const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    //
    //     // Render the component
    //     render(renderParkInfo(park, parkDetails, setParkDetails, page));
    //
    //     // Simulate hovering over the park to make the plus button appear
    //     const parkElement = screen.getByText('Test Park'); // Assuming 'Test Park' is the text content of the park element
    //     fireEvent.mouseEnter(parkElement);
    //
    //     // Simulate a click event to trigger the asynchronous function
    //     fireEvent.click(screen.getByTestId('plus-button'));
    //
    //     // Wait for the alert to be called
    //     await waitFor(() => {
    //         // Assert that the window.alert function is called with the correct message
    //         expect(alertMock).toHaveBeenCalledWith('Added to favorites!');
    //     });
    //
    //     // Restore the original implementation of window.alert
    //     alertMock.mockRestore();
    // });





    // it('should set amenity results when fetch is successful', async () => {
        //     // Setup
        //     const park = {
        //         fullName: 'Test Park',
        //         parkCode: 'TEST123',
        //     };
        //     const parkDetails = null;
        //     const setParkDetails = jest.fn();
        //     const page = 'search';
        //
        //     // Render the component
        //     render(renderParkInfo(park, parkDetails, setParkDetails, page));
        //
        //     // Simulate a click event to trigger the asynchronous function
        //     fireEvent.click(screen.getByText('Test Park'));
        //
        //     await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=parkClick'));
        //     await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=amenity_parkcode'));
        //     // Wait for the async operations to complete
        //     await waitFor(() => screen.getByText('Amenity 1'));
        //
        //     // Assertions
        //     expect(setParkDetails).toHaveBeenCalledTimes(1);
        //     expect(global.fetch).toHaveBeenCalledTimes(2); // Two fetch calls made
        //     expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=parkClick');
        //     expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TEST123&searchType=amenity_parkcode');
        // });
        // it('should render list items for amenityResults', async () => {
        //     const mockAmenityResults = [{ id: 1, name: 'Amenity 1' }, { id: 2, name: 'Amenity 2' }];
        //     const { container, rerender } = render(renderParkInfo({ parkCode: 'TP' }, null, jest.fn(), 'search')); // Render the component initially
        //
        //     await waitFor(() => {
        //         // Simulate setting amenityResults state
        //         rerender(renderParkInfo({ parkCode: 'TP' }, null, jest.fn(), 'search', mockAmenityResults));
        //     });
        //
        //     const listItems = container.querySelectorAll('ul li');
        //     expect(listItems.length).toBe(mockAmenityResults.length);
        //
        //     listItems.forEach((item, index) => {
        //         expect(item.textContent).toBe(mockAmenityResults[index].name);
        //         expect(item.key).toBe(mockAmenityResults[index].id.toString());
        //     });
        // });
    });

describe('Favorites Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // test('fetches and displays favorite parks', async () => {
    //     const favoriteParksResponse = ['PARK1', 'PARK2'];
    //     axios.get.mockResolvedValueOnce({ data: favoriteParksResponse });
    //
    //     const fetchParkDetailsResponse = {
    //         data: [
    //             { fullName: 'Park 1', parkCode: 'PARK1' },
    //             { fullName: 'Park 2', parkCode: 'PARK2' },
    //         ],
    //     };
    //     axios.mockImplementationOnce(() => Promise.resolve(fetchParkDetailsResponse));
    //
    //     const { findByText } = render(<Favorites />);
    //     await waitFor(() => {
    //         favoriteParksResponse.forEach(async parkCode => {
    //             const parkDetails = await findByText(`Park ${parkCode}`);
    //             expect(parkDetails).toBeInTheDocument();
    //         });
    //     });
    // });
    // test('removes from favorites and displays success toast', async () => {
    //     const parkCodeToRemove = 'PARK123';
    //
    //     // Mock successful removal response
    //     axios.post.mockResolvedValueOnce({});
    //
    //     // Render the Favorites component
    //     const { getByText } = render(<Favorites />);
    //
    //     // Simulate hovering over the park to make the plus button appear
    //     fireEvent.mouseEnter(getByText('Test Park')); // Assuming 'Test Park' is the text content of the park element
    //
    //     // Simulate a click event to trigger removal from favorites
    //     fireEvent.click(getByTestId('plus-button'));
    //
    //     // Wait for the success toast to appear
    //     await waitFor(() => {
    //         expect(toast.success).toHaveBeenCalledWith('Removed from favorites!');
    //     });
    //
    //     // Ensure that the axios.post method was called with the correct parameters
    //     expect(axios.post).toHaveBeenCalledWith('/api/favorites/remove', parkCodeToRemove);
    // });

    test('toggles privacy and displays correct button text', async () => {
        const { getByText } = render(<Favorites />);
        const privacyButton = getByText(/public/i);
        axios.post.mockResolvedValueOnce({});

        fireEvent.click(privacyButton);

        await waitFor(() => {
            expect(getByText(/private/i)).toBeInTheDocument();
        });
    });

    test('renders Favorites component', () => {
        render(<Favorites />);
        // Check if the component renders without crashing
    });


    test('fetches and displays favorite parks', async () => {
        // Mock data for favorite parks
        const favoriteParksResponse = ['PARK1', 'PARK2'];
        // Mock axios response for fetchFavoriteParks
        axios.get.mockResolvedValueOnce({ data: favoriteParksResponse });

        const { findByText } = render(<Favorites />);
        await waitFor(() => {
            favoriteParksResponse.forEach(async parkCode => {
                const parkDetails = await findByText(parkCode);
                expect(parkDetails).toBeInTheDocument();
            });
        });
        // Ensure favorite parks are fetched and displayed
    });

    test('toggles privacy and displays correct button text', async () => {
        const { getByText } = render(<Favorites />);
        const privacyButton = getByText(/public/i);
        fireEvent.click(privacyButton);
        await waitFor(() => {
            expect(getByText(/private/i)).toBeInTheDocument();
        });
        // Ensure privacy button toggles correctly
    });
});
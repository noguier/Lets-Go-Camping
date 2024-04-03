// Reset the browser history after each test
import React from "react";
import {
    render,
    screen,
    waitFor,
    fireEvent
} from "@testing-library/react";
import Header from "./components/Header";
import '@testing-library/jest-dom'
import Footer from "./components/Footer";
import {BrowserRouter, MemoryRouter} from "react-router-dom";
import App from "./App";
import userEvent from "@testing-library/user-event";
import Search from './pages/Search';
import "@testing-library/jest-dom/extend-expect";
import axios from 'axios';
import Login from "./pages/Login";
import Create from "./pages/Create";
import Dashboard from "./pages/Dashboard";
import {act} from "react-dom/test-utils";
import Favorites from "./pages/Favorites";
//jest.mock('axios');

// Mock axios post method

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: { /* mocked data if needed */ } })),
    get: jest.fn((url) => {
        if (url === '/api/users/authenticated') {
            // Return a promise that resolves to a mock authentication status
            return Promise.resolve({ data: true });
        } else {
            // Handle other URLs if needed
            return Promise.resolve({ data: { /* mocked data if needed */ } });
        }
    })
}));


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

it('handles error when checking authentication status', async () => {
    axios.get.mockRejectedValueOnce(new Error('Authentication error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
        <MemoryRouter initialEntries={['/']}>
            <App />
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
                <Search updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock} />
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
                <Search updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock} />
            </BrowserRouter>        );

        // Mock the axios post request to simulate a failed logout
        jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Logout Error'));

        // Mock console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

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



    test('favorites button', async () => {
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>        );

        // Click the go to Favorites button
        fireEvent.click(screen.getByText('Go to Favorites'));

        // Check if navigate is called with the correct path
        expect(window.location.pathname).toBe("/favorites");
    });


    test('renders Search', () => {
        render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>        );


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
            <Search />
        </BrowserRouter>);

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [{ fullName: 'Castle Mountains National Monument', description: 'Description: Castle Mountains represents some of the most unique elements of the Mojave Desert. Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history. This intriguing area provides serenity and solitude from nearby metropolitan areas.'},
                    { fullName: 'Joshua Tree National Park', description: 'Description: Two distinct desert ecosystems, the Mojave and the Colorado, come together in Joshua Tree National Park. A fascinating variety of plants and animals make their homes in a land sculpted by strong winds and occasional torrents of rain. Dark night skies, a rich cultural history, and surreal geologic features add to the wonder of this vast wilderness in southern California. Come explore for yourself!' },
                    { fullName: 'Mojave National Preserve', description: 'Description: Mojave preserves a diverse mosaic of ecological habitats and a 10,000 year history of human connection with the desert. Offering extensive opportunities to experience desert landscapes, the preserve promotes understanding and appreciation for the increasingly threatened resources of the Mojave Desert. This remote preserve encourages a sense of discovery and a connection to wild places.' }]
            })
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter park name/), { target: { value: 'Park' } });
        fireEvent.click(screen.getByLabelText('Search by Name'));
        fireEvent.click(screen.getByText("Search"));


        await waitFor(() => {
            const h3_C = screen.getByRole('heading', { name: 'Castle Mountains National Monument' });
            expect(h3_C).toBeInTheDocument();
            const h3_J = screen.getByRole('heading', { name: 'Joshua Tree National Park' });
            expect(h3_J).toBeInTheDocument();
            const h3_M = screen.getByRole('heading', { name: 'Mojave National Preserve' });
            expect(h3_M).toBeInTheDocument();
        });
    });
    test('search by state', async () => {
        render(<BrowserRouter>
            <Search  />
        </BrowserRouter>);
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [{ fullName: 'Alcatraz Island', description: 'Description: Alcatraz reveals stories of American incarceration, justice, and our common humanity. This small island was once a fort, a military prison, and a maximum security federal penitentiary. In 1969, the Indians of All Tribes occupied Alcatraz for 19 months in the name of freedom and Native American civil rights. We invite you to explore Alcatraz\'s complex history and natural beauty.' },
                    { fullName: 'Butterfield Overland National Historic Trail', description: 'Description: In 1857, businessman and transportation entrepreneur John Butterfield was awarded a contract to establish an overland mail route between the eastern United States and growing populations in the Far West. What became known as the Butterfield Overland Trail made an arcing sweep across the southern rim of the country. Stagecoaches left twice a week carrying passengers, freight, and mail.' },
                    { fullName: 'Cabrillo National Monument', description: 'Description: Climbing out of his boat and onto shore in 1542, Juan Rodriguez Cabrillo stepped into history as the first European to set foot on what is now the West Coast of the United States. In addition to telling the story of 16th century exploration, the park is home to a wealth of cultural and natural resources. Join us and embark on your own Voyage of Exploration.' }]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by State'));
        fireEvent.change(screen.getByPlaceholderText('Enter 2-letter state code'), { target: { value: 'CA' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            const h3_A = screen.getByRole('heading', { name: 'Alcatraz Island' });
            expect(h3_A).toBeInTheDocument();
            const h3_B = screen.getByRole('heading', { name: 'Butterfield Overland National Historic Trail' });
            expect(h3_B).toBeInTheDocument();
            const h3_C = screen.getByRole('heading', { name: 'Cabrillo National Monument' });
            expect(h3_C).toBeInTheDocument();

        });
    });
    test('search by activity', async () => {
        render(<BrowserRouter>
            <Search />
        </BrowserRouter>);

        // Mocking fetch function to return sample data
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    {
                        name: 'Hiking',
                        parks: [{ fullName: 'Acadia National Park'} ]
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
            expect(screen.getByText('Acadia National Park')).toBeInTheDocument();
        });
    });
    test('search by amenity', async () => {
        render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>
        );

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    [
                        { name: 'Accessible Restrooms', parks: [{ fullName: 'Park A' }, { fullName: 'Park B' }] },
                        { name: 'Fire Pit', parks: [{ fullName: 'Park C' }] }
                    ]
                ]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by Amenity'));

        // Enter search term and submit form
        fireEvent.change(screen.getByPlaceholderText('Enter amenity'), { target: { value: 'Restrooms' } });
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
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<BrowserRouter>
            <Search />
        </BrowserRouter>);
        global.fetch = jest.fn().mockResolvedValue({});
        fireEvent.click(screen.getByText('Search'));
        expect(window.alert).toHaveBeenCalledWith('Please enter your search term');
        jest.restoreAllMocks();
    });








    test('fetch error', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<BrowserRouter>
            <Search />
        </BrowserRouter>);
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
        fillWithTestValueAndSubmit("Login")

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
        fillWithTestValueAndSubmit("Create Account")

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
        fillWithTestValueAndSubmit("Create Account")

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

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
        axios.post.mockResolvedValueOnce({ data: mockedResponse });

        render(
            <BrowserRouter>
                <Login updateAuthenticationStatus={() => {}} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
        fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/users/login', { username: "testuser", password: "testpassword" });
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
    axios.post.mockResolvedValueOnce({ data: mockedResponse });

    render(
        <BrowserRouter>
            <Login updateAuthenticationStatus={mockUpdateAuthenticationStatus} />
        </BrowserRouter>
    );

    // Fill in the username and password fields
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });

    // Submit the form
    fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));

    // Wait for the API call to resolve
    await waitFor(() => {
        expect(mockUpdateAuthenticationStatus).toHaveBeenCalledWith(true);
        expect(window.location.pathname).toBe("/search");
    });
});

test('should render Login page when not authenticated', async () => {
    axios.get.mockResolvedValueOnce({ data: false });

    const { getByText } = render(
        <MemoryRouter>
            <App />
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
    axios.post.mockResolvedValueOnce({ data: mockedResponse });
    axios.get.mockResolvedValueOnce({});

    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    // Fill in the username and password fields
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });

    // Submit the form
    fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));

    // Wait for the API call to resolve
    await waitFor(() => {
        expect(window.location.pathname).toBe("/search");
    });
});


describe('Favorites component', () => {
    // Mock updateAuthenticationStatus function
    const mockUpdateAuthStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        const { getByText } = render(
            <BrowserRouter>
                <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
            </BrowserRouter>
        );
        expect(getByText('Favorites')).toBeInTheDocument();
    });

    test('clicking logout button calls handleLogout', async () => {
        const { getByText } = render(
            <BrowserRouter>
                <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
            </BrowserRouter>
        );
        fireEvent.click(getByText('Logout'));
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    });

    test('handleLogout function updates authentication status and navigates to login', async () => {
        axios.post.mockResolvedValueOnce(); // Mock axios post call

        const { getByText } = render(
            <BrowserRouter>
                <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
            </BrowserRouter>
        );
        fireEvent.click(getByText('Logout'));

        await waitFor(() => {
            expect(mockUpdateAuthStatus).toHaveBeenCalledWith(false);
            expect(window.location.pathname).toBe('/login');
        });
    });

    test('handleLogout function logs error on failure', async () => {
        const error = new Error('Logout failed');
        axios.post.mockRejectedValueOnce(error); // Mock axios post to reject with an error

        // Mock console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByText } = render(
            <BrowserRouter>
                <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
            </BrowserRouter>
        );
        fireEvent.click(getByText('Logout'));

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', error);
        });

        consoleErrorSpy.mockRestore(); // Restore original console.error function
    });
});



const fillWithTestValueAndSubmit = (action) => {
    if (action === "Login") {
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
        fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));
    } else if (action === "Create Account") {
        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "testpassword" } });
        fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: "testpassword" } });
        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));
    }
}
// // Import the renderParkInfo function from the file where it's defined
// import { renderParkInfo } from '../pages/Search'; // Update 'your-file-name' with the actual file name
//
// describe('renderParkInfo', () => {
//     const parkMock = {
//         fullName: 'Castle Mountains National Monument',
//         parkCode: '872417E6-2F91-4FDA-89A7-865B51B22332',
//         // Add more properties as needed for testing
//     };
//
//     const parkDetailsMock = {
//         fullName: 'Castle Mountains National Monument',
//         url: 'https://www.nps.gov/camo/index.htm',
//         "addresses": [
//             {
//                 "postalCode": "92311",
//                 "city": "Barstow",
//                 "stateCode": "CA",
//                 "countryCode": "US",
//                 "provinceTerritoryCode": "",
//                 "line1": "Castle Mountains National Monument",
//                 "type": "Physical",
//                 "line3": "",
//                 "line2": "2701 Barstow Road"
//             },
//             {
//                 "postalCode": "92311",
//                 "city": "Barstow",
//                 "stateCode": "CA",
//                 "countryCode": "US",
//                 "provinceTerritoryCode": "",
//                 "line1": "Castle Mountains National Monument",
//                 "type": "Mailing",
//                 "line3": "",
//                 "line2": "2701 Barstow Road"
//             }
//         ],
//         entranceFees: [],
//         description: "Castle Mountains represents some of the most unique elements of the Mojave Desert. Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history. This intriguing area provides serenity and solitude from nearby metropolitan areas.",
//         activities: [
//             {
//                 "id": "A59947B7-3376-49B4-AD02-C0423E08C5F7",
//                 "name": "Camping"
//             },
//             {
//                 "id": "9159DF0F-951D-4AAE-9987-CEB3CE2A9ADA",
//                 "name": "Car or Front Country Camping"
//             },
//             {
//                 "id": "7CFF5F03-5ECC-4F5A-8572-75D1F0976C0C",
//                 "name": "Group Camping"
//             },
//             {
//                 "id": "C5C5971C-E325-4CEB-8C81-EE49A881DF17",
//                 "name": "RV Camping"
//             }
//         ],
//         images: [
//         {
//             "credit": "NPS Photo",
//             "title": "Red Rocks Outcropping",
//             "altText": "Red rocks frame a stand of Joshua trees and sage brush.",
//             "caption": "Red rocks frame a stand of Joshua trees and sage brush in the desert floor..",
//             "url": "https://www.nps.gov/common/uploads/structured_data/3C87A219-1DD8-B71B-0BF28720E6A4AC75.jpg"
//         },
//         {
//             "credit": "NPS Photo",
//             "title": "View of Castle Peaks",
//             "altText": "Foreground is desert greenery. The isolated spires of the Castle Peaks rise up in the background",
//             "caption": "From Walking Box Ranch road, visitors to Castle Mountains can enjoy the stunning view of the Castle Peaks, which are located in surrounding Mojave National Preserve lands.",
//             "url": "https://www.nps.gov/common/uploads/structured_data/4AED1BA7-BA13-8631-517EFA3F8ED1D173.jpg"
//         }
//         ]
//     };
//
//     const handleParkClick = jest.fn();
//
//     it('renders park details when parkDetails match', () => {
//         const output = renderParkInfo(parkMock, parkDetailsMock, handleParkClick);
//
//         expect(output).toMatchSnapshot(); // Use toMatchSnapshot for complex output comparison
//         expect(handleParkClick).not.toHaveBeenCalled(); // Ensure handleParkClick is not called in this case
//     });
//
//     it('renders button when parkDetails do not match', () => {
//         const parkDetailsMismatch = { ...parkDetailsMock, fullName: 'Different Park' };
//         const output = renderParkInfo(parkMock, parkDetailsMismatch, handleParkClick);
//
//         expect(output).toMatchSnapshot(); // Use toMatchSnapshot for complex output comparison
//         expect(handleParkClick).toHaveBeenCalledWith('872417E6-2F91-4FDA-89A7-865B51B22332'); // Ensure handleParkClick is called with correct park code
//     });
// });


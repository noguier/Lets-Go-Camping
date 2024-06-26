// Reset the browser history after each test
import React from "react";
import { renderParkInfo } from './components/Result'; // Assuming renderParkDetails function is exported
import {
    render,
    screen,
    waitFor,
    fireEvent, getByText, getByAltText, getByTestId, findByText, getAllByText, renderHook,
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
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
jest.mock('axios');

 let mockGet;
 let mockPost;
//
beforeEach(()=> {
    mockGet = jest.fn((url) => {
        if (url === '/api/users/authenticated') {
            // Return a promise that resolves to a mock authentication status
            return Promise.resolve({ data: true });
        } else {
            // Handle other URLs if needed
            return Promise.resolve({ data: { /* mocked data if needed */ } });
        }
    });
   mockPost = jest.fn(() => Promise.resolve({ data: { /* mocked data if needed */ } }));
// jest.mock('axios', () => ({
//     post: (()=>{mockPost()}),
//     get: ((url)=>{mockGet(url)})
// }));
    axios.post.mockImplementation(()=> {return mockPost()});
    axios.get.mockImplementation(()=> {return mockGet()});
});

test("renders header text", () => {
    const { getByText } = render(
        <BrowserRouter>
            <Header />
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
        render( <BrowserRouter>
            <Header authenticated={false} />
        </BrowserRouter>);
        expect(screen.getByText("Let's Go Camping!")).toBeInTheDocument();
    });

    test("renders header with navigation links and logout button when authenticated", () => {
        render(<BrowserRouter>
            <Header authenticated={true} />
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
            </BrowserRouter>        );

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
            </BrowserRouter>        );

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
            </BrowserRouter>        );

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
                    <Search />
                </BrowserRouter>
            );

            global.fetch = jest.fn().mockResolvedValueOnce({
                json: async () => ({ data: mockSearchResults })
            });

            fireEvent.click(screen.getByLabelText('Search by State'));
            fireEvent.change(screen.getByPlaceholderText('Enter 2-letter state code'), { target: { value: 'CA' } });
            fireEvent.click(screen.getByText('Search'));

            // Wait for the initial search results to be displayed
            await waitFor(() => {
                for (let i = 1; i <= 10; i++) {
                    const parkNameHeading = screen.getByRole('heading', { name: `Park ${i}` });
                    expect(parkNameHeading).toBeInTheDocument();
                }
            });

            // Click the Load More button
            fireEvent.click(screen.getByText('Load More'));

            // Wait for additional results to be displayed
            await waitFor(() => {
                for (let i = 11; i <= 15; i++) {
                    const parkNameHeading = screen.getByRole('heading', { name: `Park ${i}` });
                    expect(parkNameHeading).toBeInTheDocument();
                }
            });
        });



    test('logout button', async () => {
        const updateAuthenticationStatusMock = jest.fn();
        const navigateMock = jest.fn();

        render(
            <BrowserRouter>
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock} authenticated={true} />
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
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock} authenticated={true} />
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
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock} authenticated={true} />
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
                <Header updateAuthenticationStatus={updateAuthenticationStatusMock} navigate={navigateMock} authenticated={true} />
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
                        { name: 'Accessible Restrooms', parks: [{ fullName: 'Park A' }] },
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

    test('should close the modal when closeModal function is called', () => {
        const { getByText } = render(<BrowserRouter><Create /></BrowserRouter>);

        // Open the modal by clicking the "Already have an account? Login" button
        fireEvent.click(getByText('Already have an account? Login'));

        // Verify that the modal is open
        expect(getByText(/Are you sure you want to cancel creating this account?/i)).toBeInTheDocument();

        // Close the modal by calling the closeModal function
        fireEvent.click(getByText('Go Back to Create'));

        // Verify that the modal is closed
        expect(getByText('Username:')).toBeInTheDocument(); // Check if any element from the form is rendered to confirm the modal is closed
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

        await waitFor (()=>{
            expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        })

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
        fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));

        expect(axios.post).toHaveBeenCalledWith('/api/users/login', { username: "testuser", password: "testpassword" });

        // Wait for Dashboard to appear asynchronously
        await waitFor(() => {
            expect(screen.getByText((content, element) => {
                // Custom logic to match text
                return content.includes('Search Parks') && element.tagName.toLowerCase() === 'h1';
            })).toBeInTheDocument();
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
            expect(screen.getAllByText(/username required/i)).toBeTruthy();
        });
    });

    test('displays error message when both missing', async () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getAllByText(/Username and password required/i)).toBeTruthy();
        });
    });

    test('redirects to login page when "Login" button is clicked', () => {
        render(
            <BrowserRouter>
                <Create />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Already have an account\? /i));
        const cancelButton = screen.getByTestId('cancel-create-account-btn');
        fireEvent.click(cancelButton);

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
            expect(screen.getAllByText(/password required/i)).toBeTruthy();
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
            expect(screen.getAllByText(/confirm password required/i)).toBeTruthy();
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
            expect(screen.getAllByText(/passwords must match/i)).toBeTruthy();
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
            expect(screen.getAllByText(mockedError)).toBeTruthy();
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





// test('should update authentication status app comp', async () => {
//     const mockedResponse = {
//         data: {
//             username: "testuser",
//             token: "testtoken"
//         }
//     };
//     axios.post.mockResolvedValueOnce({ data: mockedResponse });
//     axios.get.mockResolvedValueOnce({});
//
//     render(
//             <App />, {wrapper: BrowserRouter}
//     );
//
//     // Fill in the username and password fields
//     fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
//     fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });
//
//     // Submit the form
//     fireEvent.click(screen.queryByText(/Login/i, { selector: 'button' }));
//
//     // Wait for the API call to resolve
//     await waitFor(() => {
//         expect(window.location.pathname).toBe("/search");
//     });
// });



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
        const { getByText } = render(
            <BrowserRouter>
                <Favorites updateAuthenticationStatus={mockUpdateAuthStatus} />
            </BrowserRouter>
        );
        expect(getByText('Favorites')).toBeInTheDocument();
    });

    test('clicking ranking buttons updates park ranking', async () => {
        // Mock response for favorite parks display
        axios.get.mockResolvedValueOnce({data: ['ABC123']});
        // Mock response for fetching park details
        axios.get.mockResolvedValueOnce({data: [{parkCode: 'ABC123'}]});

        render(
            <BrowserRouter>
                <Favorites/>
            </BrowserRouter>
        );
    });
});



// <<<<<<< feature/favorites
        // // Simulate clicking on the upvote button
        // fireEvent.click(await screen.findByText('↑'));
        // expect(axios.post).toHaveBeenCalledTimes(1);
        // expect(axios.post).toHaveBeenCalledWith('/api/favorites/updateRanking', { parkCode: 'ABC123', newRanking: 1 });
        //
        // // Simulate clicking on the downvote button
        // fireEvent.click(await screen.findByText('↓'));
        // expect(axios.post).toHaveBeenCalledTimes(2);
        // expect(axios.post).toHaveBeenCalledWith('/api/favorites/updateRanking', { parkCode: 'ABC123', newRanking: 0 });
// =======
        // Simulate clicking on the upvote button
//         fireEvent.click(await screen.findByText('↑'));
//         expect(axios.post).toHaveBeenCalledTimes(1);
//         expect(axios.post).toHaveBeenCalledWith('/api/favorites/updateRanking', { parkCode: 'ABC123', newRanking: 1 });

//         // Simulate clicking on the downvote button
//         fireEvent.click(await screen.findByText('↓'));
//         expect(axios.post).toHaveBeenCalledTimes(2);
//         expect(axios.post).toHaveBeenCalledWith('/api/favorites/updateRanking', { parkCode: 'ABC123', newRanking: 1 });
//
//     });


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
// });


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
                amenities: [{name: 'Restroom'}],
                images: [{url: 'https://example.com/image.jpg', altText: 'Test Alt', title: 'Test Title'}],
            };

            const parkDetails = {
                fullName: 'Test Park',
                url: 'https://example.com',
                addresses: [{city: 'Test City', stateCode: 'TS'}],
                entranceFees: [{cost: 10, description: 'Test Description'}],
                description: 'Test Description',
                activities: [{name: 'Hiking'}],
                amenities: [{name: 'Restroom'}],
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
                    expect(getByText('TS')).toBeInTheDocument();
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

                expect(parkElement).toMatchSnapshot('<div data-testid="list-element-toggle" id="expand"><h3>Test Park</h3><a data-testid="plus-button" href="#" style="position: relative; top: 0px; right: 0px;"><svg aria-hidden="true" class="svg-inline--fa fa-plus " data-icon="plus" data-prefix="fas" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="currentColor" /></svg></a></div> 1'); // Plus button should be present
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

            it('should show alert and log error on fetch error', async () => {
                const mockPark = {fullName: 'Test Park', parkCode: 'TP'};
                global.fetch = jest.fn().mockRejectedValueOnce(new Error('Fetch Error'));
                const originalConsoleError = console.error;
                console.error = jest.fn(); // Mock console.error
                const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {
                }); // Mock window.alert

                const {getByText} = render(renderParkInfo(mockPark, null, jest.fn(), 'search'));

                fireEvent.click(getByText('Test Park'));

                await waitFor(() => {
                    expect(mockAlert).toHaveBeenCalledWith('Fetch Error');
                    // expect(console.error).toHaveBeenCalledWith(new Error('Fetch Error'));
                });

                console.error = originalConsoleError; // Restore original console.error
                mockAlert.mockRestore(); // Restore mockAlert
            });

            // it('should log "Added to favorites!"', () => {
            //     const mockPark = {fullName: 'Test Park', parkCode: 'TP'};
            //     const consoleSpy = jest.spyOn(console, 'log');
            //
            //     const {getByTestId} = render(renderParkInfo(mockPark, null, jest.fn(), 'search'));
            //     fireEvent.mouseEnter(getByTestId('list-element-toggle'));
            //     const addButton = getByTestId('plus-button');
            //     fireEvent.click(addButton);
            // });
            // it('should alert "Added to favorites!"', () => {
            //     const mockPark = { fullName: 'Test Park', parkCode: 'TP' };
            //     const consoleSpy = jest.spyOn(console, 'log');
            //     const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            //
            //     const { getByTestId } = render(renderParkInfo(mockPark, null, jest.fn(), 'search'));
            //     fireEvent.mouseEnter(getByTestId('list-element-toggle'));
            //     const addButton = getByTestId('plus-button');
            //     fireEvent.click(addButton);
            //
            //     expect(alertMock).toHaveBeenCalledWith('Added to favorites!');
            //
            //     alertMock.mockRestore(); // Restore console.log
            // });
            // it('should log "Park already added"', () => {
            //     const mockPark = { fullName: 'Test Park', parkCode: 'TP' };
            //     const consoleSpy = jest.spyOn(console, 'log');
            //     const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            //
            //     const { getByTestId } = render(renderParkInfo(mockPark, null, jest.fn(), 'search'));
            //     fireEvent.mouseEnter(getByTestId('list-element-toggle'));
            //     const addButton = getByTestId('plus-button');
            //     fireEvent.click(addButton);
            //     fireEvent.click(addButton);
            //
            //     expect(alertMock).toHaveBeenCalledWith('This Park was already added to favorites!');
            //     alertMock.mockRestore(); // Restore console.log
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


            it('test clicking state code', async () => {

                const {getByText, getByTestId} = render(
                    renderParkInfo(park, parkDetails, setParkDetails, page)
                );

                fireEvent.click(getByTestId('list-element-toggle'));
                fireEvent.click(getByText('TS'));
                await waitFor(() => {
                    expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=TS&searchType=state');
                });

            });

            it('test clicking activity', async () => {

                const {getByText, getByTestId} = render(
                    renderParkInfo(park, parkDetails, setParkDetails, page)
                );

                fireEvent.click(getByTestId('list-element-toggle'));
                fireEvent.click(getByText('Hiking'));
                await waitFor(() => {
                    expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=Hiking&searchType=activity');
                });

            });

            // it('test clicking amenity', async () => {
            //     const { getByText, getByTestId } = render(
            //         renderParkInfo(park, parkDetails, setParkDetails, page)
            //     );
            //
            //     fireEvent.click(getByTestId('list-element-toggle'));
            //     fireEvent.click(getByText(''));
            //     await waitFor(() => {
            //         expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=NA&searchType=amenity');
            //     });
            // });


            it('underline mouse enter and remove underline mouse leave activity', () => {
                const {getByText, getByTestId} = render(
                    renderParkInfo(park, parkDetails, setParkDetails, page)
                );
                fireEvent.click(getByTestId('list-element-toggle'));
                const activityLink = getByText('Hiking');

                fireEvent.mouseEnter(activityLink);
                expect(activityLink).toHaveStyle('text-decoration: underline;');

                fireEvent.mouseLeave(activityLink);
                expect(activityLink).not.toHaveStyle('text-decoration: underline;');
            });

            it('underline mouse enter and remove underline mouse leave state', () => {
                const {getByText, getByTestId} = render(
                    renderParkInfo(park, parkDetails, setParkDetails, page)
                );
                fireEvent.click(getByTestId('list-element-toggle'));
                const activityLink = getByText('TS');

                fireEvent.mouseEnter(activityLink);
                expect(activityLink).toHaveStyle('text-decoration: underline;');

                fireEvent.mouseLeave(activityLink);
                expect(activityLink).not.toHaveStyle('text-decoration: underline;');
            });

            it('should render NA for entrance fee when parkDetails.entranceFees is falsy', () => {
                const parkDetailsWithoutEntranceFees = {...parkDetails, entranceFees: null};
                const {getByText, getByTestId} = render(
                    renderParkInfo(park, parkDetailsWithoutEntranceFees, setParkDetails, page)
                );
                fireEvent.click(getByTestId('list-element-toggle'));
                expect(getByText('Entrance Fee:')).toBeInTheDocument();
                expect(screen.getAllByText('NA')).toBeTruthy();
            });


// test('should update search results', async () => {
//     const updateSearchResultsMock = jest.fn();
//
//     render(
//         <BrowserRouter>
//             <Search />
//         </BrowserRouter>
//     );
//
//     global.fetch = jest.fn().mockResolvedValueOnce({
//         json: async () => ({
//             data: [
//                 {
//                     name: 'Hiking',
//                     parks: [{ fullName: 'Test Park'} ]
//                 },
//             ]
//         })
//     });
//     fireEvent.click(screen.getByLabelText('Search by Activity'));
//
//     fireEvent.change(screen.getByPlaceholderText('Enter activity'), { target: { value: 'Hiking' } });
//     fireEvent.click(screen.getByText('Search'));
//
//     // Wait for search results to be displayed
//     await waitFor(() => {
//         expect(screen.getByText('Test Park')).toBeInTheDocument();
//     });
//
//     // Wait for the park details to be visible
//     await waitFor(() => {
//         fireEvent.click(screen.getByText('Test Park'));
//     });
//
//     // Wait for the park details to be visible
//     await waitFor(() => {
//         fireEvent.click(getByText('Hiking'));
//     });
//
//     await waitFor(() => {
//         expect(global.fetch).toHaveBeenCalledWith('/api/parks?searchTerm=Hiking&searchType=activity');
//         expect(updateSearchResultsMock()).toHaveBeenCalledWith(data.data, 'activity');
//     });
//
// });

            // describe('Compare component', () => {
            //     beforeEach(() => {
            //         fetchMock.resetMocks();
            //         jest.clearAllMocks();
            //     });
            //
            //     test('renders correctly', () => {
            //         const { getByText } = render(
            //             <BrowserRouter>
            //                 <Compare />
            //             </BrowserRouter>
            //         );
            //         expect(getByText('Compare and Suggest')).toBeInTheDocument();
            //         expect(screen.getByPlaceholderText('Search for user')).toBeInTheDocument();
            //     });

            // test('handles user search and privacy check', async () => {
            //     fetchMock.mockResponseOnce(JSON.stringify("User exists"), { status: 200 });
            //     fetchMock.mockResponseOnce(JSON.stringify(true), { status: 200 });
            //     fetchMock.mockResponseOnce(JSON.stringify(['Park1', 'Park2']), { status: 200 });
            //
            //     render(<BrowserRouter><Compare /></BrowserRouter>);
            //
            //     // Simulate user typing in the search input and clicking the search button
            //     fireEvent.change(screen.getByPlaceholderText('Search for user'), { target: { value: 'johnDoe' } });
            //     fireEvent.click(screen.getByRole('button', { name: /search/i }));
            //
            //     // Wait for all fetch calls to complete
            //     await waitFor(() => {
            //         expect(fetchMock).toHaveBeenCalledTimes(3);
            //         expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/users/exists?username=johnDoe');
            //         expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/favorites/privacy/johnDoe', { credentials: 'include' });
            //         expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/favorites/display/johnDoe', { credentials: 'include' });
            //     });
            //
            //     // Expect the user to be added to the suggestion list if privacy is public and favorites exist
            //     await waitFor(() => {
            //         expect(screen.getByText('johnDoe')).toBeInTheDocument();
            //     });
            // });


            // });

            function renderComponent() {
                render(
                    <MemoryRouter>
                        <Compare updateAuthenticationStatus={jest.fn()}/>
                    </MemoryRouter>
                );
            }

            describe('Compare Component', () => {
                beforeEach(() => {
                    // Clear all mocks before each test
                    jest.clearAllMocks();
                });

                it('renders without crashing', () => {
                    renderComponent();
                    expect(screen.getByText(/Compare and Suggest/i)).toBeInTheDocument();
                });
                // test('updates search term state on input change', () => {
                //     render(<Compare />);
                //     const input = screen.getByPlaceholderText('Search for user');
                //     fireEvent.change(input, { target: { value: 'john_doe' } });
                //     expect(input.value).toBe('john_doe');
                // });
                //
                // test('displays error when trying to search with an empty input', () => {
                //     render(<Compare />);
                //     const button = screen.getByRole('button', { name: 'Search' });
                //     fireEvent.click(button);
                //     expect(screen.getByText('Please enter a username to search')).toBeInTheDocument();
                // });
                //
                // test('handles user existence check', async () => {
                //     fetchMock.get('/api/users/exists?username=john_doe', 'User exists');
                //     render(<Compare />);
                //     const input = screen.getByPlaceholderText('Search for user');
                //     const button = screen.getByRole('button', { name: 'Search' });
                //     fireEvent.change(input, { target: { value: 'john_doe' } });
                //     fireEvent.click(button);
                //     await waitFor(() => {
                //         expect(screen.getByText('User does not exist.')).toBeInTheDocument();
                //     });
                // });
                //
                // test('suggests a park correctly after fetching user favorites', async () => {
                //     fetchMock.getOnce('/api/users/exists?username=jane_doe', 'User exists');
                //     fetchMock.getOnce('/api/favorites/privacy/jane_doe', { body: { isPublic: true }, headers: { 'content-type': 'application/json' } });
                //     fetchMock.getOnce('/api/favorites/display/jane_doe', { body: ['Yellowstone', 'Yosemite'], headers: { 'content-type': 'application/json' } });
                //
                //     render(<Compare />);
                //     const input = screen.getByPlaceholderText('Search for user');
                //     const buttonSearch = screen.getByRole('button', { name: 'Search' });
                //     fireEvent.change(input, { target: { value: 'jane_doe' } });
                //     fireEvent.click(buttonSearch);
                //
                //     await waitFor(() => {
                //         const buttonSuggest = screen.getByRole('button', { name: 'Suggest a Park' });
                //         fireEvent.click(buttonSuggest);
                //         expect(screen.getByText('Most common park: Yellowstone')).toBeInTheDocument();
                //     });
                // });


                // it('displays an error message when search is triggered with an empty input', async () => {
                //     renderComponent();
                //     fireEvent.click(screen.getByText(/Search/i));
                //     expect(await screen.findByText(/Please enter a username to search/i)).toBeInTheDocument();
                // });

                // it('displays an error when user does not exist', async () => {
                //     // Mock fetch to simulate user not existing
                //     global.fetch = jest.fn(() =>
                //         Promise.resolve({
                //             ok: true,
                //             text: () => Promise.resolve("User does not exist.")
                //         })
                //     );
                //
                //     renderComponent();
                //     fireEvent.change(screen.getByPlaceholderText(/Search for user/i), { target: { value: 'nonexistentuser' } });
                //     fireEvent.click(screen.getByText(/Search/i));
                //     expect(fetch).toHaveBeenCalledWith(`/api/users/exists?username=nonexistentuser`);
                //     await waitFor(() => expect(screen.getByText(/User does not exist./i)).toBeInTheDocument());
                // });

                it('successfully searches for an existing user and checks privacy', async () => {
                    // Mock fetch for checking user existence and privacy
                    global.fetch = jest.fn((url) => {
                        if (url.includes('/exists')) {
                            return Promise.resolve({ok: true, text: () => Promise.resolve("User exists")});
                        } else if (url.includes('/privacy')) {
                            return Promise.resolve({ok: true, json: () => Promise.resolve(true)});
                        }
                        return Promise.reject(new Error('not found'));
                    });

                    renderComponent();
                    fireEvent.change(screen.getByPlaceholderText(/Search for user/i), {target: {value: 'existinguser'}});
                    fireEvent.click(screen.getByText(/Search/i));
                    expect(fetch).toHaveBeenCalledWith(`/api/users/exists?username=existinguser`);
                    await waitFor(() => expect(fetch).toHaveBeenCalledWith(`/api/favorites/privacy/existinguser`, {
                        credentials: 'include'
                    }));
                });
            });


        });


// import { useIdleTimer } from 'react-idle-timer';
// // Define the sleep function
// export function sleep(time = 0) {
//     return new Promise(resolve => setTimeout(resolve, time));
// }
//
// describe('useIdleTimer', () => {
//     let props
//
//     const idleTimer = () => {
//         return renderHook(() => useIdleTimer(props))
//     }
//
//
//     beforeEach(() => {
//         props = {
//             timeout: undefined,
//             promptTimeout: undefined,
//             element: undefined,
//             events: undefined,
//             timers: undefined,
//             immediateEvents: undefined,
//             onPresenceChange: undefined,
//             onPrompt: undefined,
//             onIdle: undefined,
//             onActive: undefined,
//             onAction: undefined,
//             onMessage: undefined,
//             debounce: undefined,
//             throttle: undefined,
//             eventsThrottle: undefined,
//             startOnMount: undefined,
//             startManually: undefined,
//             stopOnIdle: undefined,
//             capture: undefined,
//             passive: undefined,
//             crossTab: undefined,
//             name: undefined,
//             syncTimers: undefined,
//             leaderElection: undefined,
//             disabled: undefined
//         }
//     })
//
// test('logout idle user', async () => {
//     const updateAuthenticationStatusMock = jest.fn();
//
//     render(
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     );
//
//     await waitFor (()=>{
//         expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
//     })
//
//     // Set a short timeout for testing purposes
//     props.timeout = 2000;
//
//     // Simulate user activity to prevent idle state
//     fireEvent.mouseMove(document);
//
//     // Wait for the timeout to trigger idle state
//     await sleep(2500);
//
//     // Mock the axios post request
//     jest.spyOn(axios, 'post').mockResolvedValueOnce();
//
//     await waitFor(() =>{
//         // Check if axios.post is called with the correct endpoint
//     expect(axios.post).toHaveBeenCalledWith('/api/users/logout');
//     });
//
//     // // Wait for axios.post to be called
//     //     await waitFor(() => {
//     //         expect(mockPost).toHaveBeenCalledWith('/api/users/logout');
//     //     });
//
//         // Check if updateAuthenticationStatus and navigate are called
//         await waitFor(() =>{
//             expect(updateAuthenticationStatusMock).toHaveBeenCalledWith(false);
//             expect(window.location.pathname).toBe("/login");
//         });
// });
//
// });

// const SECONDS = 1000;
// jest.useFakeTimers();
// it('logout idle user', async () => {
//     const updateAuthenticationStatusMock = jest.fn();
//     const mockedResponse = {
//         data: {
//             username: "testuser",
//             token: "testtoken"
//         }
//     };
//     axios.post.mockResolvedValueOnce({ data: mockedResponse });
//
//
//     render(
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     );
//
//     await waitFor (()=>{
//         expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
//     })
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
//
//     jest.advanceTimersByTime(5000);
//
//     // Mock the axios post request
//     jest.spyOn(axios, 'post').mockResolvedValueOnce();
//
//     await waitFor(() =>{
//         // Check if axios.post is called with the correct endpoint
//     expect(axios.post).toHaveBeenCalledWith('/api/users/logout');
//     });
//
//     // // Wait for axios.post to be called
//     //     await waitFor(() => {
//     //         expect(mockPost).toHaveBeenCalledWith('/api/users/logout');
//     //     });
//
//         // Check if updateAuthenticationStatus and navigate are called
//         await waitFor(() =>{
//             expect(updateAuthenticationStatusMock).toHaveBeenCalledWith(false);
//             expect(window.location.pathname).toBe("/login");
//         });
// }, 70 * SECONDS);



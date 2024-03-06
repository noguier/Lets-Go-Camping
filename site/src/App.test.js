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
                data: [{ fullName: 'Castle Mountains National Monument', description: 'Description: Castle Mountains represents some of the most unique elements of the Mojave Desert. Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history. This intriguing area provides serenity and solitude from nearby metropolitan areas.'},
                    { fullName: 'Joshua Tree National Park', description: 'Description: Two distinct desert ecosystems, the Mojave and the Colorado, come together in Joshua Tree National Park. A fascinating variety of plants and animals make their homes in a land sculpted by strong winds and occasional torrents of rain. Dark night skies, a rich cultural history, and surreal geologic features add to the wonder of this vast wilderness in southern California. Come explore for yourself!' },
                    { fullName: 'Mojave National Preserve', description: 'Description: Mojave preserves a diverse mosaic of ecological habitats and a 10,000 year history of human connection with the desert. Offering extensive opportunities to experience desert landscapes, the preserve promotes understanding and appreciation for the increasingly threatened resources of the Mojave Desert. This remote preserve encourages a sense of discovery and a connection to wild places.' }]
            })
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter park name/), { target: { value: 'Park' } });
        fireEvent.click(screen.getByLabelText('Search by Name'));
        fireEvent.click(screen.getByText("Search"));


        await waitFor(() => {
            expect(screen.getByText("Castle Mountains National Monument")).toBeInTheDocument();
            expect(screen.getByText("Description: Castle Mountains represents some of the most unique elements of the Mojave Desert. Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history. This intriguing area provides serenity and solitude from nearby metropolitan areas.")).toBeInTheDocument();

            expect(screen.getByText("Joshua Tree National Park")).toBeInTheDocument();
            expect(screen.getByText("Description: Two distinct desert ecosystems, the Mojave and the Colorado, come together in Joshua Tree National Park. A fascinating variety of plants and animals make their homes in a land sculpted by strong winds and occasional torrents of rain. Dark night skies, a rich cultural history, and surreal geologic features add to the wonder of this vast wilderness in southern California. Come explore for yourself!")).toBeInTheDocument();

            expect(screen.getByText("Mojave National Preserve")).toBeInTheDocument();
            expect(screen.getByText("Description: Mojave preserves a diverse mosaic of ecological habitats and a 10,000 year history of human connection with the desert. Offering extensive opportunities to experience desert landscapes, the preserve promotes understanding and appreciation for the increasingly threatened resources of the Mojave Desert. This remote preserve encourages a sense of discovery and a connection to wild places.")).toBeInTheDocument();
        });
    });
    test('search by state', async () => {
        render(<Search />);
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
            expect(screen.getByText("Alcatraz Island")).toBeInTheDocument();
            expect(screen.getByText("Description: Alcatraz reveals stories of American incarceration, justice, and our common humanity. This small island was once a fort, a military prison, and a maximum security federal penitentiary. In 1969, the Indians of All Tribes occupied Alcatraz for 19 months in the name of freedom and Native American civil rights. We invite you to explore Alcatraz's complex history and natural beauty.")).toBeInTheDocument();

            expect(screen.getByText("Butterfield Overland National Historic Trail")).toBeInTheDocument();
            expect(screen.getByText("Description: In 1857, businessman and transportation entrepreneur John Butterfield was awarded a contract to establish an overland mail route between the eastern United States and growing populations in the Far West. What became known as the Butterfield Overland Trail made an arcing sweep across the southern rim of the country. Stagecoaches left twice a week carrying passengers, freight, and mail.")).toBeInTheDocument();

            expect(screen.getByText("Cabrillo National Monument")).toBeInTheDocument();
            expect(screen.getByText("Description: Climbing out of his boat and onto shore in 1542, Juan Rodriguez Cabrillo stepped into history as the first European to set foot on what is now the West Coast of the United States. In addition to telling the story of 16th century exploration, the park is home to a wealth of cultural and natural resources. Join us and embark on your own Voyage of Exploration.")).toBeInTheDocument();
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
        render(<Search />);

        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({
                data: [
                    [
                        { name: 'ATM/Cash Machine', parks: [{ fullName: 'Park Name: Badlands National Park' }, { fullName: 'Park Name: Big Bend National Park' }] },
                    ]
                ]
            })
        });

        fireEvent.click(screen.getByLabelText('Search by Amenity'));
        fireEvent.change(screen.getByPlaceholderText('Enter amenity'), { target: { value: 'ATM/Cash Machine' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText('ATM/Cash Machine')).toBeInTheDocument();
            expect(screen.getByText('Park Name: Badlands National Park')).toBeInTheDocument();
            expect(screen.getByText('Park Name: Big Bend National Park')).toBeInTheDocument();
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



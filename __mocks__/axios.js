// __mocks__/axios.js
export default {
    post: jest.fn(() => Promise.resolve({ data: {} })),
};

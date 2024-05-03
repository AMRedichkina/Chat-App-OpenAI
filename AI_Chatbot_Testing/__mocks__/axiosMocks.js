import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a new instance of MockAdapter and pass axios to it
const mock = new MockAdapter(axios);

// Configure the mock to reply with user statistics when POST request is made to '/api/statistics'
mock.onPost('/api/statistics').reply(200, {
    // Sample user statistics data
    labels: ['January', 'February', 'March'],
    datasets: [{
        label: 'Number of Users',
        data: [100, 200, 150]
    }]
});

export default mock;

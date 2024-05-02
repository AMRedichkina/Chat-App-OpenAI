import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
mock.onPost('/api/statistics').reply(200, {
    labels: ['January', 'February', 'March'],
    datasets: [{
        label: 'Number of Users',
        data: [100, 200, 150]
    }]
});
export default mock;
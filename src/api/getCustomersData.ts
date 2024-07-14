import axios from 'axios';

async function getCustomersData() {
  const response = await axios.get('http://localhost:8000/customers');
  return response.data;
}

export default getCustomersData;

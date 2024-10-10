import axios from './axios';

const addCustomisedDesign = async (data) => {
  try {
    const response = await axios.post('/customisedDesign', data);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const addMainDesign = async (data) => {
  try {
    const response = await axios.post('/customisedDesign/mainDesign', data);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getCustomisedDesign = async (queryParams) => {
  try {
    let endpoint = '/customisedDesign';
    
    if (queryParams)
      endpoint += `?${queryParams}`;

    const response = await axios.get(endpoint);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const customisedDesignService = {
  addCustomisedDesign,
  addMainDesign,
  getCustomisedDesign,
};

export default customisedDesignService;

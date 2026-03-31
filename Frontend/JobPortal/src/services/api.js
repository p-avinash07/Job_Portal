import axios from 'axios';

const api = axios.create({
  baseURL: 'https://job-portal-ev3y.onrender.com',
});

export const UserAPI = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  }
};

export const JobAPI = {
  getAllJobs: async () => {
    const response = await api.get('/jobs/all');
    return response.data;
  },
  postJob: async (jobData) => {
    const response = await api.post('/jobs/add', jobData);
    return response.data;
  }
};

export const ApplicationAPI = {
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications/apply', applicationData);
    return response.data;
  },
  getUserApplications: async (userId) => {
    const response = await api.get(`/applications/user/${userId}`);
    return response.data;
  }
};

export default api;

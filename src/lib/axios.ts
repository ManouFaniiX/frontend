import axios from 'axios';

export const axiosCredential = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const catchAxios = (error: unknown) => {
  throw error;
};
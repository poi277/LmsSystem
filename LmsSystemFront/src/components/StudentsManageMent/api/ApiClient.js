import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// baseURL: 'http://localhost:5000',
export const RegisterApiClient = axios.create({
  baseURL: BASE_URL,
    
});
  
// 0. 관리자용
export const AdministratorApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// apiClients.js
// 1. 학생용
export const studentApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const professorApiClient = axios.create({
  baseURL: BASE_URL,
    withCredentials: true,
});

studentApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('studentToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 2. 수강신청용
export const subjectApiClient = axios.create({
  baseURL: BASE_URL,
   withCredentials: true,
});


subjectApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('subjectToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});


AdministratorApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('administratorToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});


//교수용

professorApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('professorToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});


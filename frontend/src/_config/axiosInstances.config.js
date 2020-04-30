import axios from 'axios';
import { getServerUrl } from './getEnv.config';

const serverUrl = getServerUrl();

// Base Axios Instance - basic error handling
export const baseAxios = axios.create({ baseURL: serverUrl });

// Authenticated Axios Instance
export const authAxios = axios.create({ baseURL: serverUrl });

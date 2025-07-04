import axios from "axios";
import https from 'https';
import { SERVER_BASE_URL } from "./services-config";

export const axiosInstance = axios.create({
    baseURL: SERVER_BASE_URL, httpsAgent: new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV !== 'development'
    })
})
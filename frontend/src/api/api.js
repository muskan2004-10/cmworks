/* A CENTRAL API CONFIG*/ 
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
/* if backend URL changes → one place*/


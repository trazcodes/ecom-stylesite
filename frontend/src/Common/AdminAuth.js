import axios from "axios";
import { isAuth } from "./auth";

export const isAdminAuth = async () => {
  if (isAuth()) {
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.get('/api/isadmin', {
        headers: {'Authorization': `Bearer ${token}`}
      }); 
      return resp.data.result !== 0; // Convert result to boolean
    } catch (error) {
      console.error("Error checking admin authentication:", error);
      return false; // Return false in case of an error
    }
  } else {
    return false; // Return false if user is not authenticated
  }
}

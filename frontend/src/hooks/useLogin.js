import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();

  const login = async (username, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      const json = response.data;
      console.log("hereeee",json)

      if (response.status === 200) {
        // save the user to a cookie
        Cookies.set('token', json.token, { expires: 3 })

        // update the auth context
        dispatch({type: 'LOGIN', payload: json})
        if (json.role === 'patient') {
          navigate(`/dashboard/patient/${username}`);
        }else if(json.role === 'doctor'){
          navigate(`/dashboard/doctor/${username}`);
        }
        else if(json.role === 'admin' ) {
          navigate(`/dashboard/admin/${username}`);
        }
        else{
          navigate(`/pendingDoctors/${username}`);
        
        }
      } else {
        setError(json.error)
      }
    } catch (error) {
      setError('Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
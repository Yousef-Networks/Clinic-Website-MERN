import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();

  const logout = () => {
    // remove user from cookie
    Cookies.remove('token')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    navigate('/login');
  }

  return { logout }
}
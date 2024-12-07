import { createContext, useReducer, useEffect } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log("user:",action.payload.role)
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      
        const user = jwtDecode(token);
      dispatch({ type: 'LOGIN', payload: user }) 
    }
  }, [])
  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}
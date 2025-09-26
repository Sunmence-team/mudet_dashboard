import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { token, logout } = useUser()
  const isAuthenticated = !!token

  return isAuthenticated ? <Component {...rest} /> : logout()
};

export default ProtectedRoute;

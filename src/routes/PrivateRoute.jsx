import { Navigate } from 'react-router-dom'
import { useAuth } from '../context'
import PropTypes from 'prop-types'

export const PrivateRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to={"/login"} />
}

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
}


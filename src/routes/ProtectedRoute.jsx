import { Navigate } from "react-router-dom";
import { useAuth } from "../context";
import PropTypes from 'prop-types'

export const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to={"/login"} />;
    if (!allowedRoles.includes(user.role)) return <Navigate to={"/dashboard"} />;

    return element;
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.string.isRequired,
    element: PropTypes.any.isRequired
}
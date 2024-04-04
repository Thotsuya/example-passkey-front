import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const GuestRoute = ({ component: Component, ...rest }) => {
    const user = useSelector((state) => state.user.user);
    if (user) {
        return <Navigate to="/"/>;
    }
    return <Component {...rest}/>;
}

export default GuestRoute;
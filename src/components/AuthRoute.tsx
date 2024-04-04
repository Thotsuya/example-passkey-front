import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {Navigate} from "react-router-dom";

const AuthRoute = ({component: Component, ...rest}) => {

    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
        return <Navigate to="/login"/>;
    }

    return <Component {...rest} />;
}

export default AuthRoute;
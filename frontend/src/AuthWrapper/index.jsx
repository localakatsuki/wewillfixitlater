import { useEffect } from "react";

const AuthWrapper = (props) => {
    const dispatch = useDispatch();
    const {isLoggedIn} = useSelector(state => state.auth);
    

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(checkAuth());
        }
    }, [isLoggedIn, dispatch]);
}
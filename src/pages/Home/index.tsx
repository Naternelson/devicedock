import { useNavigate } from "react-router-dom";
import { useAuth } from "../../util";
import { useEffect } from "react";

export const Home = () => {
    const nav = useNavigate();
	const authState = useAuth();
    useEffect(() => {
        if (!authState.loading && !authState.user) {
            // Redirect to login
            nav('/login', { replace: true });
        } else {
            nav('/dashboard', { replace: true });
        }
    }, [authState.loading, authState.user, nav]);
    return null;
}
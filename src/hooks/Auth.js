
import { useContext } from "react";
import UserContext from "../context/User/UserContext";

const useAuth = () => {
    return useContext(UserContext);
}

export default useAuth;

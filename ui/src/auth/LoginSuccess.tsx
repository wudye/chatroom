import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import  {login} from '../store/authSlice'
import { useNavigate } from "react-router-dom";
const LoginSuccess = () => {
      const dispatch = useDispatch()
      const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8869/api/auth/token", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      
        const authData = { accessToken, refreshToken };
        console.log("Auth data:", authData);

        localStorage.setItem('auth', JSON.stringify(authData));
        dispatch(login());
        navigate('/', { replace: true })


      });
  }, []);
  return (
    <div>

    </div>
  );
    

}

export default LoginSuccess

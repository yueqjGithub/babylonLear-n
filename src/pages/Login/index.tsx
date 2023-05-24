import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate()
  const loginHandler = () => {
    const token = Math.random().toString(16)
    localStorage.setItem('token', token)
    navigate('/')
  }
  return (
    <div>
      <button onClick={() => loginHandler()}>登录</button>
    </div>
  );
};

export default LoginPage

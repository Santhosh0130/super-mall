import React, { useState } from 'react';
import { loginUser } from '../services/authService'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoding] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoding(true)
    try {
      const user = await loginUser(email, password);
      console.log(user)
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.isActive == true) {
        navigate("/merchant/dashboard")
        // console.log("Hello from merchant")
      } else if (user.isActive == false) {
        alert("The Merchant Request Pending. Waiting for the Responce.")
      }
      else {
        navigate("/customer/dashboard")
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoding(false)
    }
  };

  return (
    <div>
      {loading ?
        <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading...</div> :
        <div className="min-h-screen flex flex-col gap-10 items-center justify-center bg-gray-100">
          <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-lg w-100">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <input
              className="w-full p-2 mb-3 border rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer"
            >
              Login
            </button>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <button
                type='button'
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Register
              </button>
            </div>

          </form>
        </div>}
    </div>
  );
};

export default Login;

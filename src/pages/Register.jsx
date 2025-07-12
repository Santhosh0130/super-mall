import React, { useState } from 'react';
import { registerUser } from '../services/authService'
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    shopName: "",
    shopAddress: "",
    contactNumber: "",
  });
  const [loading, setLoding] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoding(true);
    try {
      const val = await registerUser(formData, role)
      if (!val) {
        alert("This Email is already in use. Use Different Email")
      } else {
        navigate("/login")
      }
      console.log(val)
    } catch (err) {
      console.log(err)
    } finally {
      setLoding(false);
    }

  };

  return (
    <div>
      {loading ?
        <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading...</div> :

        <div className="h-dvh flex justify-center items-center">

          <div className="max-w-md mx-auto p-6 bg-blend-difference shadow-xl rounded-lg flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>

            <div className="flex gap-6 mb-4">
              {['customer', 'merchant'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded ${role === r ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />

              {role === "merchant" && (
                <>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.shopName}
                    name="shopName"
                    placeholder="Shop Name"
                    required
                    onChange={handleChange} />

                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.shopAddress}
                    name="shopAddress"
                    placeholder="Shop Address"
                    required
                    onChange={handleChange} />

                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={formData.contactNumber}
                    name="contactNumber"
                    placeholder="Contact Number"
                    required
                    onChange={handleChange} />
                </>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer">
                Register
              </button>
            </form>
          </div>
        </div>}
    </div>
  );
};

export default RegisterPage;

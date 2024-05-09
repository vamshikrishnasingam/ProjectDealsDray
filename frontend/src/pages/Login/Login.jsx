import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { loginContext } from "../../contexts/loginContext";
import { Button } from "react-bootstrap";

function Login() {
  let [, loginUser, userLoginStatus, loginErr] = useContext(loginContext);
  const navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let submitForm = async (userCredObj) => {
    await loginUser(userCredObj);
    if (userLoginStatus) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 shadow-gray-900 rounded shadow-2xl w-full md:w-1/2 lg:w-1/3 bg-secondary bg-opacity-75">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Administrator
          </h2>
          <h1 className="text-2xl text-green-600">Sign In</h1>
          <p className="text-gray-300 font-extrabold">The key to happiness is to sign in.</p>
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-6 text-left">
            <label htmlFor="username" className="m-2 text-white font-extralight font-extrabold">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: true,
                minLength: 4,
                maxLength: 12,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                * Username must be between 4 and 12 characters
              </p>
            )}
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="password" className=" text-md m-2 block text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: true,
                minLength: 8,
                maxLength: 16,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                * Password must be between 8 and 16 characters
              </p>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Forget Password?
            <NavLink className="text-green-900 font-extrabold ml-2" to="/login">
              Reset here
            </NavLink>
          </p>
          <div className="text-center">
            {loginErr.length !== 0 && (
              <p className="text-red-500 text-sm mb-4">{loginErr}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md border-green-500 focus:outline-none hover:bg-green-600"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

import "./App.css";
import { useState, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteLayout from "./Route/RouteLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import EmployeeList from "./pages/Employee/EmployeeList/EmployeeList";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddEmployee from "./pages/Employee/AddorDelete/AddEmployee";
import { loginContext } from "./contexts/loginContext";
import Logo from "./components/Logo/Logo";
import DeletedEmployeeList from "./pages/Employee/DeletedEmployee/DeletedEmployeeList";
function App() {
  let [, , userLoginStatus, , logoutUser] = useContext(loginContext);
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <div>
          <Logo />
          <Login />
        </div>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: userLoginStatus ? (
        <RouteLayout />
      ) : (
        <div>
          <Logo />
          <Login />
        </div>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "/employeelist",
          element: <EmployeeList />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/deletedlist",
          element: <DeletedEmployeeList />,
        },
        {
          path: "/createemp",
          element: <AddEmployee />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

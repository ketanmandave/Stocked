import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import "./Login.css";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser, navigate, axios } = useAppContext();

  const onSubmitHandler = async (e) => {

    try {
      e.preventDefault();

      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password
      });

      if (data.success) {
        navigate("/");
        setUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }

  };

  return (
    <div className="login-page">
      <form onSubmit={onSubmitHandler} className="login-card">

        <h2 className="login-title">
          Stocked.
        </h2>

        <p className="login-subtitle">
          {state === "login"
            ? "Welcome back! Please login"
            : "Create your fresh account"}
        </p>

        {state === "register" && (
          <div className="login-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p className="login-toggle">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("login")}>Login</span>
            </>
          ) : (
            <>
              New here?{" "}
              <span onClick={() => setState("register")}>Create account</span>
            </>
          )}
        </p>

        <button className="login-btn">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

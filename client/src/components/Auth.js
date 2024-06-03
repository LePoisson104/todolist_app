import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [cookie, setCookie, removeCookie] = useCookies(null);
  const [error, setError] = useState(null);
  const [isLogIn, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogIn && password !== confirmPassword) {
      setError("Make Sure Passwords Match!");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    console.log(data);
    if (data === "error") {
      setError(`${email} already exist`);
    } else if (data.message) {
      viewLogin(true);
      resetForm();
    } else if (data.detail) {
      setError("Either Email or Password does not exists!");
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
      window.location.reload();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLogIn ? "Please Log In" : "Please Sign Up"}</h2>
          <input
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogIn && (
            <input
              type="password"
              value={confirmPassword}
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            value={isLogIn ? "login" : "sign up"}
            className="create"
            onClick={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button
            onClick={() => {
              viewLogin(false);
              resetForm();
            }}
            style={{
              backgroundColor: !isLogIn
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              viewLogin(true);
              resetForm();
            }}
            style={{
              backgroundColor: isLogIn
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

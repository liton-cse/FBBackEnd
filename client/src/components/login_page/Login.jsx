import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import "./login.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("message", result.message);

        setMessage("Login Successfull");
        navigate("/home");
      } else {
        setErrorMessage("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      <h3>Log In </h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="btn btn-primary">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {message && <p style={{ color: "red" }}>{message}</p>}
      </form>
    </div>
  );
}

export default LoginForm;

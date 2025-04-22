import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import axios from "axios"; // Import axios
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
      const response = await axios.post(
        "https://fbbackend-server.onrender.com/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("message", response.data.message);

        setMessage("Login Successful");
        navigate("/home");
      } else {
        setErrorMessage("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      <h3>Log In</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="btn btn-primary">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </div>
  );
}

export default LoginForm;

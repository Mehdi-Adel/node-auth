import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LoginView.css";

const LoginView = ( {history}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Une fois que l'utilisateur est connecté, on ne veut pas qu'il aille sur les pages Register et Login
  useEffect(() => {
    if(localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history])

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }

    try {
      const {data} = await axios.post("/api/auth/login", {email, password}, config);

      localStorage.setItem("authToken", data.token);

      history.push("/");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000)
    }

  }

  return (
    <div className="login-screen">

      <form onSubmit={loginHandler} className="login-screen__form">
        <h3 className="login-screen__title">Se connecter</h3>
        {error && <span className="error-message">{error}</span>}

        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Entrez votre adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            tabIndex={1}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :
          <Link to="/forgotpassword" className="login-screen__forgotpassword" tabIndex={4}></Link>
          </label>
          <input
            type="password"
            required
            id="password"
            placeholder="Choisissez un mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={2}
          />
        </div>


      <button type="submit" className="btn btn-primary" tabIndex={3}>Se connecter</button>

      <span className="login-screen__subtext">
          Vous n'avez pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </span>

      </form>
    </div>
  )
}

export default LoginView;
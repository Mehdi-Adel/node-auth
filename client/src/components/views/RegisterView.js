import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./RegisterView.css";

const RegisterView = ( {history}) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if(localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history])

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }

    if(password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(()=> {
        setError("")
      }, 5000);
      return setError("Les mots de passe ne correspondent pas");
    }

    try {
      const {data} = await axios.post("/api/auth/register", {username, email, password}, config);

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
    <div className="register-screen">

      <form onSubmit={registerHandler} className="register-screen__form">
        <h3 className="register-screen__title">S'inscrire</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="name">Nom d'utilisateur :</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Choisissez un nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Entrez votre adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            required
            id="password"
            placeholder="Choisissez un mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmpassword">Confirmez votre mot de passe :</label>
          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

      <button type="submit" className="btn btn-primary">S'inscrire</button>

      <span className="register-screen__subtext">
          Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
        </span>

      </form>
    </div>
  )
}

export default RegisterView;
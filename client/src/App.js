import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Routing
import PrivateRoute from "./components/routing/PrivateRoute";

// Views
import PrivateView from "./components/views/PrivateView";
import LoginView from "./components/views/LoginView";
import RegisterView from "./components/views/RegisterView";
import ForgotPasswordView from "./components/views/ForgotPasswordView";
import ResetPasswordView from "./components/views/ResetPasswordView";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <PrivateRoute exact path="/" component={PrivateView} />
          <Route exact path="/login" component={LoginView} />
          <Route exact path="/register" component={RegisterView} />
          <Route
            exact
            path="/forgotpassword"
            component={ForgotPasswordView}
          />
          <Route
            exact
            path="/passwordreset/:resetToken"
            component={ResetPasswordView}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

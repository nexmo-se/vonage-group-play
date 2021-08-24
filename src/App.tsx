import "@vonagevolta/volta2/dist/css/volta.min.css";

import MainPage from "./pages/Main";
import ThankYouPage from "pages/ThankYou";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/thank-you" component={ThankYouPage} />
        <Route path="/" component={MainPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

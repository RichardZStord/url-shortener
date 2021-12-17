import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap.min (1).css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import URLShortenerForm from "./components/URLShortenerForm";
import NoShortURL from "./components/NoShortURL";
function App() {
  return (
    <div className="background">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<URLShortenerForm />} />
          {/* The Not Found Route below would only be rendered if the api 
          cannot find an associated alias. Running only the client side will
          make this route alway render. */}
          <Route path="/*" element={<NoShortURL />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

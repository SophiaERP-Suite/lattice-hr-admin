import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import 'tippy.js/dist/tippy.css';



function App() {
  return (
    <BrowserRouter basename="/one/lhr_adm">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

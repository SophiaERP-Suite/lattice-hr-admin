import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/animate.css";
import "./assets/css/vendor/spacing.css";
import "./assets/css/vendor/magnific-popup.css";
import "./assets/css/plugins/simplebar.min.css";
import "./assets/css/plugins/waves.min.css";
import "./assets/css/plugins/nano.min.css";
import "./assets/css/plugins/line-awesome.min.css";
import "./assets/css/plugins/remixicon.css";
import "./assets/css/plugins/tabler-icons.css";
import "./assets/css/plugins/jsvectormap.min.css";
import "./assets/css/plugins/swiper.min.css";
import "./assets/css/main.css";
import "./assets/js/vendor/bootstrap.bundle.min.js";
import "./assets/js/vendor/jquery-3.7.0.js";
import "./assets/js/plugins/popper.min.js";
import "./assets/js/plugins/simplebar.min.js";
import "./assets/js/vendor/height-equal.js";
import "./assets/js/vendor/isotope.pkgd.js";
import "./assets/js/vendor/magnific-popup.min.js";
import "./assets/js/vendor/backtotop.js";
import "./assets/js/plugins/apexcharts.min.js";
import "./assets/js/plugins/jsvectormap.min.js";
import "./assets/js/plugins/world-merc.js";
import "./assets/js/plugins/swiper.min.js";
import "./assets/js/main.js";
import "./assets/js/vendor/sidebar.js";


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

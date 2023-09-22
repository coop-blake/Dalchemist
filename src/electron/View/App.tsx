//React 
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
// State
import { Provider } from "react-redux";
import { store } from "./store";
// React Components
import CoreSetsView from "../CoreSupport/View/CoreSets"
// HTML and CSS
import MainView from "./Main"

//App
export default function App(props: { onLoad: () => void }) {
  useEffect(() => {
    props.onLoad();
  }, [props.onLoad]);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/CoreSets" element={<CoreSetsView />} />
        </Routes>
      </Router>
    </Provider>
  );
}

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import {CoreSetsStatus, CoreSupportEntry} from "../CoreSupport/shared"
import { Provider } from 'react-redux'
import {store} from './store'

import { setStatus as setCoreSetStatus } from '../CoreSupport/View/CoreSetSlice';

import { useAppSelector, useAppDispatch } from './hooks'

import icon from "../Resources/images/Icon.svg";
import "../Resources/css/index.css";



function MainView(){

  const mainStatus = useAppSelector(state => state.Main.status)
  
  

    return <div>
          <span id="loaderContainer" style={{position: "relative", top: "15px", left: "1px"}}
          className={`${mainStatus === "Running" ? "fadeOut" : ""}`}
          ><div className="lds-ripple">
            <div></div>
            <div></div></div></span><br />
        <div className={`image-container ${mainStatus === "Running" ? "shrink" : ""}`} id="iconImageContainer">
          <img
            id="iconImage"
            className={`image ${mainStatus !== "Running" ? "pulsating" : ""}`}
            src={icon}
            alt="Dalchemist Image"
          />
        </div>
        <br />
        <div className="content-container">
          <div className="content">
            <span id="title">Dalchemist</span>
            <div id="statusContent" className={`${mainStatus === "Running" ? "fadeOut" : ""}`}>{mainStatus}</div>
    
            <span style={{opacity: 0}} id="menuContent"  className={`${mainStatus === "Running" ? "fadeIn" : ""}`}>
              <span className="menuButton" id="inventoryMenuButton">Inventory</span>
            <br/>
              <span className="menuButton" id="addDropMenuButton">Add Drop</span>
            <br/>
              <span className="menuButton" id="closeMenuButton">Close</span>
            </span>
          </div>
        </div>
      </div>

}



export default function App(props: {onLoad:() => void }) {

  useEffect(() => {
    // Call the onLoadHandler function when the component is loaded or reloaded
    props.onLoad();
  }, [props.onLoad]);

    return (
      <Provider store={store} >
      <Router>
        <Routes>
          <Route path="/" element={<MainView/>} />
        </Routes>
      </Router>
      </Provider>
    );
  }
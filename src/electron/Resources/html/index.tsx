
console.log("From index.tsx")

import icon from "../images/Icon.svg"; 
import "../css/index.css"



window.electron.ipcRenderer.once('status', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
  });

if (document.readyState === 'complete' || document.readyState === 'interactive') {

    let iconImage = document.getElementById('iconImage');
    console.log(icon)
    if(iconImage){
     iconImage.src = icon;
    }

  } else {
      document.addEventListener('DOMContentLoaded', () =>{

      });
    }


function updateErrorMessage( error){

    if (document.readyState === 'complete' || document.readyState === 'interactive') {


      let statusContent = document.getElementById('statusContent');
      let iconImage = document.getElementById('iconImage');
      
      if (statusContent) {
        let errorMessage = error.replace(/'/g, "\\'").replace(/"/g, '\\"')
        statusContent.innerHTML = `Error Loading! </br>${errorMessage}`;
        statusContent.style.color = 'red';
      }
      if(iconImage){
        iconImage.classList.remove('pulsating');
      }

    } else {
        document.addEventListener('DOMContentLoaded', updateErrorMessage, error);
      }

  }

  function updateStatusMessage( statusMessage: string){

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      const statusContent = document.getElementById('statusContent');
     
      if (statusContent) {
        
        statusContent.innerHTML = `${statusMessage.replace(/'/g, "\\'").replace(/"/g, '\\"')}`;
      }
     
    } else {
        document.addEventListener('DOMContentLoaded', updateStatusMessage, statusMessage);
    }
  }


  const receiveMessageFromMain = ((message: string) => {
   
    console.log(`Received: ${message}`)

    updateStatusMessage(message)
  });
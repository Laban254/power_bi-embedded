import React, { useState, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import './App.css'; // Import the CSS file

function App() {
 const [embedConfig, setEmbedConfig] = useState(null);
 
 useEffect(() => {
     // Make a GET request to retrieve the embed config
     fetch('http://127.0.0.1:8000/pms/getembedinfo/')
       .then((response) => response.json())
       .then((data) => {
        let jsonData = JSON.parse(data);
        console.log(jsonData.reportConfig[0].reportId)
         setEmbedConfig({
           type: 'report',
           id: jsonData.reportConfig[0].reportId, 
           embedUrl: jsonData.reportConfig[0].embedUrl,
           accessToken: jsonData.accessToken,
           tokenType: models.TokenType.Embed, 
           settings: {
             panes: {
               filters: {
                 expanded: false,
                 visible: true,
               },
             },
             background: models.BackgroundType.Transparent,
           },
         });
       })
       .catch((error) => console.error('Error fetching embed config:', error));
 }, []); // Empty dependency array ensures this effect runs only once on mount
 
 return (
    <div className="fullscreen-container">
      <h1> (Business Intelligence)</h1>
      {embedConfig && (
        <PowerBIEmbed
          embedConfig={embedConfig}
          eventHandlers={new Map([
            ['loaded', () => console.log('Report loaded')],
            ['rendered', () => console.log('Report rendered')],
            ['error', (event) => console.log(event.detail)],
            ['visualClicked', () => console.log('Visual clicked')],
            ['pageChanged', (event) => console.log(event)],
          ])}
          cssClassName="bi-embedded"
          getEmbeddedComponent={(embeddedReport) => {
            window.report = embeddedReport; 
          }}
        />
      )}
    </div>
 );
}

export default App;

import React from "react";
import './App.css';
import FileUpload from "./FileUpload";

const App = () => {
    return (
        <div className="App">
            <header className="App-Header">
                <h1>Certificate Generator</h1>
                <FileUpload />
            </header>
        </div>
    );
};

export default App;
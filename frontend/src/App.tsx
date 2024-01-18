import React  from 'react';
import './App.css';
import {PharmacyCardProps, PharmacyCard} from "./PharmacyCard";
import  {useLoaderData} from "react-router-dom";
import {TempCard} from "./TempCard";

import axiosBase, {AxiosResponse} from "axios";


function App() {

    return (
        <div id="pharmacy">
                <TempCard/>
        </div>
    );
}

export default App;
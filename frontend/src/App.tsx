import React  from 'react';
import './App.css';
import {PharmacyCardProps, PharmacyCard} from "./PharmacyCard";
import  {useLoaderData} from "react-router-dom";

import axiosBase, {AxiosResponse} from "axios";

export const axios = axiosBase.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 5000,
});

function App() {
    let { data: pharmacy } = useLoaderData() as AxiosResponse<PharmacyCardProps>;

    return (
        <div id="pharmacy">
                <PharmacyCard name={pharmacy.name} address={pharmacy.address} phone={pharmacy.phone}/>
        </div>
    );
}

export default App;
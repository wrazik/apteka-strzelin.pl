import React, {useEffect, useState} from 'react';
import './App.css';

import axiosBase from "axios";

export const axios = axiosBase.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 5000,
});

interface Pharmacy {
    name: String,
    address: String,
    phone: String,
}

function App() {
    const [data, setData] = useState<Pharmacy>({name: "", address: "", phone: ""});

    useEffect(() => {
        const fetch_pharmacy = async()  => {
            const pharmacy = await axios.get<Pharmacy>('/pharmacy');
            setData(pharmacy.data);
        };
        fetch_pharmacy();
    }, []);

    return (
        <div className="current-pharmacy">
            <div className="welcome-msg"> Dyżur pełni: </div>
            <div className="pharmacy-name"> {data.name} </div>
            <div className="pharmacy-address"> {data.address} </div>
            <div className="pharmacy-phone"> {data.phone} </div>
        </div>
    );
}

export default App;
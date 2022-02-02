import React, {useEffect, useState} from 'react';
import './App.css';
import {PropagateLoader} from "react-spinners";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetch_pharmacy = async()  => {
            const pharmacy = await axios.get<Pharmacy>('/pharmacy');
            setData(pharmacy.data);
            setIsLoading(false);
        };
        fetch_pharmacy();
    }, []);

    return (
        <div className="current-pharmacy">
            <div className="welcome-msg"> Dyżur pełni: </div>
            {isLoading ? (
                <PropagateLoader color="#e73c7e" size={10}/>
            ): (
                <React.Fragment>
                    <div className="pharmacy-name"> {data.name} </div>
                    <div className="pharmacy-address"> {data.address} </div>
                    <div className="pharmacy-phone"> {data.phone} </div>
                </React.Fragment>
            )}
        </div>
    );
}

export default App;
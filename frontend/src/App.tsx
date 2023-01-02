import React, {useEffect, useState} from 'react';
import './App.css';
import {PropagateLoader} from "react-spinners";
import {PharmacyCardProps, PharmacyCard} from "./PharmacyCard";
import { css } from "@emotion/react";

import axiosBase from "axios";

export const axios = axiosBase.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 5000,
});

function App() {
    const [data, setData] = useState<PharmacyCardProps>({name: "", address: "", phone: "", date: new Date()});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Can be a string as well. Need to ensure each key-value pair ends with ;
    const override = css`
        display: grid;
        align-items: center;
        place-items: center;
        height: 100vh;
    `;

    useEffect(() => {
        const fetch_pharmacy = async()  => {
            const pharmacy = await axios.get<PharmacyCardProps>('/pharmacy');
            pharmacy.data.date = new Date();
            setData(pharmacy.data);
            setIsLoading(false);
        };
        fetch_pharmacy();
    }, []);

    return (
        <div id="pharmacy">
            {isLoading ? (
                <PropagateLoader color="#e73c7e" size={20} css={override}/>
            ) : (
                <PharmacyCard name={data.name} address={data.address} phone={data.phone} date={data.date}/>
            )}
        </div>
    );
}

export default App;
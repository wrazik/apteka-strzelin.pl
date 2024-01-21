import {PharmacyCardProps} from "./PharmacyCard";
import {axios} from "./App";
import {LoaderFunctionArgs} from "react-router-dom"
import {AxiosResponse} from "axios";


export async function load_pharmacy({params}: LoaderFunctionArgs): Promise<AxiosResponse<PharmacyCardProps>> {
    if (params.date) {
        return await axios.get<PharmacyCardProps>(`/pharmacy/${params.date}`);
    }
    else {
        return await axios.get<PharmacyCardProps>(`/pharmacy`);
    }

}
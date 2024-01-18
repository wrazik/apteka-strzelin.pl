import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from "./ErrorPage";
//import { load_pharmacy} from "./PharmacyLoader";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App></App>,
        errorElement: <ErrorPage />,
//        loader: load_pharmacy
    },
    {
        path: "/date/:date",
        element: <App></App>,
        errorElement: <ErrorPage />,
//        loader: load_pharmacy
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import images from "./img/index";
import {Box, createTheme, IconButton, ThemeProvider} from "@mui/material";
import 'react-datepicker/dist/react-datepicker.css'

import DatePicker, {registerLocale} from 'react-datepicker';
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);

interface PharmacyCardProps {
    name: string,
    address: string,
    phone: string,
}

export type {PharmacyCardProps};


const theme = createTheme({
    typography: {
        "fontFamily": "Vertigo", "fontWeightBold": "bold"
    }

})

theme.typography.body1 = {
    "fontFamily": "Vertigo",
    "fontSize": "small",
}

enum Case {
    Nominative ,
    Accusative = 1,
    Genitive
}

export function TempCard() {
    return (<ThemeProvider theme={theme}>
        <Card sx={{maxWidth: 400, boxShadow: 10, margin: "auto auto"}}>
            <CardHeader subheader="Strona w przebudowie! Wkrótce wrócimy z nową wersją strony." />
            <CardContent>
                <Typography component={'span'} variant="body2" color="red" marginBottom="0.5rem">
                    Uwaga! Wszystkie apteki w Strzelinie są zamknięte w godzinach 22:00-8:00 (w niedzielę do 10:00). Wynika to z nowego sposobu finansowania dyżurowania aptek przez NFZ.
                    POWIAT MOŻE FINANSOWAĆ NOCNE DYŻURY APTEK! <br/> Jeśli potrzebujesz pomocy, zadzwoń na numer 112.
                </Typography>
                <Typography gutterBottom variant="body1" component="div" marginTop="2rem">
                    <b>Najbliższe dyżury: </b><br/>
                    27.01: Pod Złotym Lwem (rondo) <br/>
                    28.01: Nova (koło Artura) <br/>
                    29.01: Kalina (koło Tony) <br/>
                    30.01: Pod paprocią (rynek) <br/>
                    31.01: Pod Złotym Lwem (rondo) <br/>
                    01.02: Inter Apteka (Carrefour) <br/>
                    02.02: Centrum Zdrowia (bielany) <br/>
                    03.02: Pod Paprocią (rynek) <br/>
                </Typography>
            </CardContent>
        </Card>
    </ThemeProvider>);

}

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import images from "./img/index";
import {createTheme, ThemeProvider} from "@mui/material";


const theme = createTheme({
    typography: {
        "fontFamily": "Vertigo",
        "fontWeightBold": "bold"
    }
})

export function Break() {
    return (
        <ThemeProvider theme={theme}>
            <Card sx={{ maxWidth: 400 , boxShadow: 10, margin: "auto auto"}}>
                <CardMedia
                    component="img"
                    image={images.maintanance_break}
                    title={"Przerwa techniczna, kodowanie w pełni "}
                    alt={"Przerwa techniczna, kodowanie w pełni "}
                />
                <CardContent>
                    <Typography variant="body2" color="red">
                        <h1> Przerwa techniczna!!!!! </h1>
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        Prace w trakcie
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Niestety, Gmina Strzelin zmieniła sposób dyżurowania aptek. Obecnie, rozpisany jest on na konkretne dni. Ta strona bazowała na podziale tygodniowym, stąd potrzebuję czasu na dostosowanie.
                        Proszę o cierpliwość!
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

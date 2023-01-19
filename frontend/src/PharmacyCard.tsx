import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import images from "./img/index";
import {Box, createTheme, IconButton, ThemeProvider} from "@mui/material";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import {Link, useParams} from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from "react-router-dom";

import parse from 'date-fns/parse'
import sub from 'date-fns/sub'
import add from 'date-fns/add'
import isTomorrow from "date-fns/isTomorrow";
import isYesterday from "date-fns/isYesterday";
import isToday from "date-fns/isToday";
import isPast from 'date-fns/isPast';
import DatePicker, {registerLocale} from 'react-datepicker';
import pl from "date-fns/locale/pl";
import {useState} from "react";
import styles from "./PharmacyCard.module.css"
registerLocale("pl", pl);

interface PharmacyCardProps {
    name: string,
    address: string,
    phone: string,
}

export type {PharmacyCardProps};

const name_to_img: Record<string, string> = {
    "Apteka Pod Paprocią": images.pod_paprocia,
    "Inter Apteka": images.inter_apteka,
    "Apteka Nova": images.nova,
    "Apteka Kalina": images.kalina,
    "Apteka Pod Złotym Lwem": images.pod_zlotym_lwem,
    "Apteka Centrum Zdrowia": images.centrum_zdrowia,
    "Apteka Pod Złotym Strzelcem": images.pod_zlotym_strzelcem,
}

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

function get_day_name(some_date: Date, declension: Case) {
    const index = some_date.getDay()
    let days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    if (declension === Case.Accusative) {
        days = ["w niedzielę", "w poniedziałek", "we wtorek", "w środę", "w czwartek", "w piątek", "w sobotę"];
    }
    else if (declension === Case.Genitive) {
        days = ["do niedzieli", "do poniedziałku", "do wtorku", "do środy", "do czwartku", "do piątku", "do soboty"];
    }
    return days[index];
}

function generate_date_string(some_date: Date): string {
    const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

    const prefix = `${get_day_name(some_date, Case.Nominative)}, `;

    return `${prefix}${some_date.getDate()} ${months[some_date.getMonth()]} ${some_date.getFullYear()}`;
}

function parse_date(date: string | undefined): Date {
    if (date === undefined) {
        return new Date();
    }
    return parse(date, "y-MM-dd", new Date());
}

function format_link_to_date(date: Date): string {
    return `/date/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function is_this_years_date(date: Date) {
    return date.getFullYear() === 2023;
}

function NextArrow() {
    return (<IconButton aria-label="Później" size='small'>
            <ChevronRight/>
        </IconButton>);
}

function PreviousArrow() {
    return (<IconButton aria-label="Wcześniej" size='small'>
            <ChevronLeft/>
        </IconButton>);
}

function Next({date}: { date: Date }) {
    const tomorrow = add(date, {days: 1});
    const link = format_link_to_date(tomorrow);
    if (is_this_years_date(tomorrow)) {
        return (<div>
                <Link to={link}>
                    <NextArrow/>
                </Link>
            </div>);
    } else {
        return (<div className="disabled">
                <NextArrow/>
            </div>)
    }
}

function Previous({date}: { date: Date }) {
    const yesterday = sub(date, {days: 1});
    const link = format_link_to_date(yesterday);
    if (is_this_years_date(yesterday)) {
        return (<div>
                <Link to={link}>
                    <PreviousArrow/>
                </Link>
            </div>);
    } else {
        return (<div className="disabled">
                <PreviousArrow/>
            </div>)
    }
}


function Calendar({date}: { date: Date }) {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(date);
    return (
        <label>
                <CalendarMonth/>
                <DatePicker
                    todayButton="Dzisiaj"
                    className={styles.calendar_input}
                    locale="pl"
                    selected={startDate}
                    minDate={parse_date("2023-01-01")}
                    maxDate={parse_date("2023-12-31")}
                    shouldCloseOnSelect={true}
                    onChange={(date, e) => {
                        if (e && typeof e.preventDefault === 'function') {
                            e.preventDefault();
                        }
                        if (date) {
                            setStartDate(date);
                            navigate(format_link_to_date(date));
                        }
                    }}
                />
        </label>);
}

function HeaderString({date, is_homepage}: { date: Date, is_homepage: boolean }) {
    let message = "";
    const suffix = "dyżur w Strzelinie"

    if (is_homepage) {
        message = `Teraz ${suffix} pełni: `;
    }
    else if (isYesterday(date)) {
        message = `Wczoraj ${suffix} pełniła: `;
    } else if (isToday(date)) {
        message = `Dzisiaj ${suffix} będzie pełnić: `;
    } else if (isTomorrow(date)) {
        message = `Jutro ${suffix} pełni: `;
    } else if (isPast(date)) {
        message = `Tego dnia ${suffix} pełniła: `;
    } else {
        message = `Tego dnia ${suffix} będzie pełnić: `;
    }


    return (<h1> {message} </h1>)
}

export function PharmacyCard(props: PharmacyCardProps) {
    const {date} = useParams();
    let is_home_page = true;
    if (date) {
        is_home_page = false;
    }
    let date_parsed = parse_date(date)

    if (date_parsed.getHours() < 8 && is_home_page) {
        date_parsed = sub(date_parsed, {days: 1})
    }

    return (<ThemeProvider theme={theme}>
            <Card sx={{maxWidth: 400, boxShadow: 10, margin: "auto auto"}}>
                <CardHeader subheader={generate_date_string(date_parsed)}
                />
                <CardMedia
                    component="img"
                    image={name_to_img[props.name]}
                    title={"Aktualnie dyżur w Strzelinie pełni " + props.name}
                    alt={"Aktualnie dyżurująca apteka w Strzelinie to " + props.name}
                />
                <CardContent>
                    <Typography component={'span'} variant="body2" color="red">
                        <HeaderString date={date_parsed} is_homepage={is_home_page}/>
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.phone}
                    </Typography>
                    <div  className={styles.info_text}>
                        <Typography variant="body1" color="text.secondary" >
                                Pamiętaj! Apteka rozpoczyna swój dyżur {get_day_name(date_parsed, Case.Accusative)} o godzinie 8:00 i jej
                                dyżur trwa {get_day_name(add(date_parsed, {days: 1}), Case.Genitive)} do 8:00
                        </Typography>
                    </div>
                </CardContent>
                <Box sx={{display: 'flex', justifyContent: "space-between", pl: 1, pb: 1}}>
                    <Previous date={date_parsed}/>
                    <Calendar date={date_parsed}/>
                    <Next date={date_parsed}/>
                </Box>
            </Card>
        </ThemeProvider>);
}

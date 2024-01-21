import * as React from 'react';
import images from "./img/index";
import {createTheme, IconButton, ThemeProvider} from "@mui/material";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import {Link, useParams} from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from "react-router-dom";
import {Card, CardFooter, Image, Button} from "@nextui-org/react";

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

function get_begin_hour(some_date: Date): string {
    const index = some_date.getDay()
    if (index === 0) {
        return "10:00";
    }
    return "08:00";
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
    return date.getFullYear() === 2024;
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
                    minDate={parse_date("2024-01-01")}
                    maxDate={parse_date("2024-12-31")}
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
        <Card
            isFooterBlurred
            radius="lg"
            className="border-none"
        >
            <Image
                alt="Woman listing to music"
                className="object-cover"
                height={200}
                src="/images/hero-card.jpeg"
                width={200}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Available soon.</p>
                <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                    Notify me
                </Button>
            </CardFooter>
        </Card>
        </ThemeProvider>);
}

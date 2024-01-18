use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::error::Error;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Pharmacy {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) address: String,
    pub(crate) phone: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct OnCallData {
    pub(crate) id: String,
    pub(crate) days: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct Db {
    pub(crate) pharmacies: Vec<Pharmacy>,
    pub(crate) on_call: Vec<OnCallData>,
}

#[derive(Debug)]
pub(crate) struct Calendar {
    pharmacies: Vec<Pharmacy>,
    days: BTreeMap<NaiveDate, String>,
}

impl From<Db> for Calendar {
    fn from(value: Db) -> Self {
        let mut days = BTreeMap::new();
        for i in value.on_call.iter() {
            for day in &i.days {
                let day = Calendar::string_to_date(day);
                if let Some(day) = day {
                    days.insert(day, i.id.clone());
                }
            }
        }
        Calendar {
            pharmacies: value.pharmacies,
            days,
        }
    }
}

impl Calendar {
    fn string_to_date(date: &str) -> Option<NaiveDate> {
        let date = date.to_owned() + ".2024";
        NaiveDate::parse_from_str(&date, "%d.%m.%Y").ok()
    }

    pub(crate) fn get_pharmacy(&self, date: NaiveDate) -> Option<Pharmacy> {
        let pharmacy = self.days.get(&date)?;
        self.pharmacies.iter().find(|x| x.id == *pharmacy).cloned()
    }
}

impl Db {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Db, Box<dyn Error>> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let u = serde_json::from_reader(reader)?;
        Ok(u)
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_parsing_correct_date() {
        assert_eq!(
            Calendar::string_to_date("07.01").unwrap(),
            NaiveDate::from_ymd_opt(2024, 1, 7).unwrap()
        );
        assert_eq!(
            Calendar::string_to_date("7.1").unwrap(),
            NaiveDate::from_ymd_opt(2024, 1, 7).unwrap()
        );
        assert_eq!(
            Calendar::string_to_date("7.01").unwrap(),
            NaiveDate::from_ymd_opt(2024, 1, 7).unwrap()
        );
        assert_eq!(
            Calendar::string_to_date("7.01").unwrap(),
            NaiveDate::from_ymd_opt(2024, 1, 7).unwrap()
        );
    }
    #[test]
    fn test_parsing_incorrect_date() {
        let correct = vec!["7.13", "piecgwiazdektrzygwiazdki", "30.2", "21.37"];
        let converted = correct
            .iter()
            .map(|x| Calendar::string_to_date(x))
            .collect::<Vec<Option<NaiveDate>>>();

        for date in converted {
            assert_eq!(date, None);
        }
    }
}

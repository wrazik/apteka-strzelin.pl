use chrono::{DateTime, Datelike, Timelike, Utc};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::error::Error;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Pharmacy {
    name: String,
    address: String,
    phone: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Db {
    pub pharmacies: BTreeMap<String, Pharmacy>,
    pub on_call: BTreeMap<String, i32>,
}

impl Db {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Db, Box<dyn Error>> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let u = serde_json::from_reader(reader)?;
        Ok(u)
    }

    pub fn from_week(&self, week: &str) -> Option<Pharmacy> {
        let pharmacy_nb = self.on_call.get(week)?;
        self.pharmacies.get(&pharmacy_nb.to_string()).cloned()
    }

    pub fn from_datetime(&self, timestamp: DateTime<Utc>) -> Option<Pharmacy> {
        self.from_week(&Db::get_week(timestamp).to_string())
    }

    fn get_week(timestamp: DateTime<Utc>) -> u32 {
        use chrono_tz::Europe::Warsaw;
        let timestamp = timestamp.with_timezone(&Warsaw);
        let current_week = timestamp.iso_week().week();
        if chrono::Weekday::Mon == timestamp.weekday() && timestamp.time().hour() < 8 {
            return current_week - 1;
        }
        current_week
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use chrono::{TimeZone, Utc};

    #[test]
    fn test_wednesday_midnight_12week() {
        let datetime = Utc.ymd(2022, 3, 23).and_hms(19, 0, 0);
        assert_eq!(12, Db::get_week(datetime));
    }

    #[test]
    fn test_sunday_midnight() {
        let datetime = Utc.ymd(2022, 1, 30).and_hms(0, 0, 0);
        assert_eq!(4, Db::get_week(datetime));
    }

    #[test]
    fn test_monday_midnight_should_return_previous() {
        let datetime = Utc.ymd(2022, 1, 31).and_hms(0, 0, 0);
        assert_eq!(4, Db::get_week(datetime));
    }

    #[test]
    fn test_tuesday_midnight_should_return_normal() {
        let datetime = Utc.ymd(2022, 2, 1).and_hms(0, 0, 0);
        assert_eq!(5, Db::get_week(datetime));
    }

    #[test]
    fn test_monday_before_eight_should_return_previous() {
        let datetime = Utc.ymd(2022, 1, 31).and_hms(4, 0, 0);
        assert_eq!(4, Db::get_week(datetime));
    }
}

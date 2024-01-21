mod database;

use crate::database::Calendar;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use chrono::prelude::*;
use chrono::Days;
use database::Db;
use std::sync::RwLock;
use actix_files as af;

async fn pharmacy(req: HttpRequest) -> HttpResponse {
    println!("Received request for pharmacy");
    let naive_date = req
        .match_info()
        .get("naive_date")
        .map(str::to_string)
        .unwrap_or_else(|| {
            println!("No argument, taking current timestamp");
            let now = Utc::now();
            let datetime = now.naive_local().date();
            println!("{}", now.hour());
            if now.hour() < 7 {
                datetime.checked_sub_days(Days::new(1)).unwrap().to_string()
            } else {
                datetime.to_string()
            }
        });
    let naive_date = NaiveDate::parse_from_str(&naive_date, "%Y-%m-%d").ok();
    println!("Getting time for {:?}", naive_date);

    if let Some(naive_date) = naive_date {
        let calendar = req
            .app_data::<web::Data<RwLock<Calendar>>>()
            .expect("Test data missing in request handler.");
        let pharmacy = calendar.read().expect("Cannot read the calendar").get_pharmacy(naive_date).expect("Missing date");
        println!("Found pharmacy: {}", pharmacy.name);
        HttpResponse::Ok().json(pharmacy)
    } else {
        HttpResponse::BadRequest().into()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting....");
    let db = Db::new("./db.json").expect("Cannot read the database");
    let calendar: Calendar = db.into();
    let calendar = RwLock::new(calendar);
    let calendar = web::Data::new(calendar);
    let port_nb = 8080;
    let ip = "0.0.0.0";

    if let Err(e) = HttpServer::new(move || {
        App::new()
            .app_data(calendar.clone())
            .route("/api/pharmacy", web::get().to(pharmacy))
            .route("/api/pharmacy/{naive_date}", web::get().to(pharmacy))
            .service(af::Files::new("/", "./public").index_file("index.html"))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
    {
        println!("Error running service: {:?}", e);
    }

    Ok(())
}

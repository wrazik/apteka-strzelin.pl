mod database;

use crate::database::Calendar;
use actix_cors::Cors;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use chrono::prelude::*;
use chrono::Days;
use database::Db;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use std::sync::RwLock;

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
        let pharmacy = calendar.read().unwrap().get_pharmacy(naive_date).unwrap();
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

    let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    builder
        .set_private_key_file("key.pem", SslFiletype::PEM)
        .unwrap();
    builder.set_certificate_chain_file("cert.pem").unwrap();

    if let Err(e) = HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("https://apteka-strzelin.pl")
            .allowed_origin("https://www.apteka-strzelin.pl")
            .allowed_methods(vec!["GET"])
            .max_age(3600);
        App::new()
            .wrap(cors)
            .app_data(calendar.clone())
            .route("/pharmacy", web::get().to(pharmacy))
            .route("/pharmacy/{naive_date}", web::get().to(pharmacy))
    })
    .bind_openssl("0.0.0.0:8081", builder)?
    .run()
    .await
    {
        println!("Error running service: {:?}", e);
    }

    Ok(())
}

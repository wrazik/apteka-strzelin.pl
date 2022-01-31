mod database;

use database::Db;
use actix_web::{web, App, HttpRequest, HttpServer, Responder, web::{Data}, HttpResponse};
use chrono::prelude::*;
use std::sync::{Arc, RwLock};

async fn pharmacy(req: HttpRequest) -> HttpResponse {
    let timestamp = req.match_info().get("timestamp").map(str::to_string).unwrap_or(Utc::now().to_rfc3339());
    match chrono::DateTime::parse_from_rfc3339(&timestamp) {
        Ok(timestamp) => {
            let db = req.app_data::<web::Data<RwLock<Db>>>().expect("Test data missing in request handler.");
            let timestamp: DateTime<Utc> = timestamp.with_timezone(&Utc);
            let pharmacy = db.read().unwrap().from_datetime(timestamp).unwrap();
            HttpResponse::Ok().json(pharmacy)
        }
        Err(_) => {
            HttpResponse::BadRequest().body("Incorrect timestamp")
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = database::Db::new("./db.json").expect("Cannot read the database");
    let db = RwLock::new(db);
    let db = actix_web::web::Data::new(db);

    HttpServer::new(move || {
        App::new()
            .app_data(db.clone())
            .route("/pharmacy", web::get().to(pharmacy))
            .route("/pharmacy/{timestamp}", web::get().to(pharmacy))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await;

    Ok(())
}
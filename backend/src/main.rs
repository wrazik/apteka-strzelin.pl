mod database;

use database::Db;
use actix_web::{web, App, HttpRequest, HttpServer, HttpResponse};
use chrono::prelude::*;
use std::sync::RwLock;
use actix_cors::Cors;

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

    if let Err(e) = HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("https://apteka-strzelin.pl")
            .allowed_methods(vec!["GET"])
            .max_age(3600);
        App::new()
            .wrap(cors)
            .app_data(db.clone())
            .route("/pharmacy", web::get().to(pharmacy))
            .route("/pharmacy/{timestamp}", web::get().to(pharmacy))
    })
        .bind(("0.0.0.0", 8081))?
        .run()
        .await {
        println!("Error running service: {:?}", e);
    }

    Ok(())
}
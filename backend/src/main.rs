mod database;

use actix_cors::Cors;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use chrono::prelude::*;
use database::Db;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use std::sync::RwLock;

async fn pharmacy(req: HttpRequest) -> HttpResponse {
    let timestamp = req
        .match_info()
        .get("timestamp")
        .map(str::to_string)
        .unwrap_or_else(|| Utc::now().to_rfc3339());
    match chrono::DateTime::parse_from_rfc3339(&timestamp) {
        Ok(timestamp) => {
            let db = req
                .app_data::<web::Data<RwLock<Db>>>()
                .expect("Test data missing in request handler.");
            let timestamp: DateTime<Utc> = timestamp.with_timezone(&Utc);
            let pharmacy = db.read().unwrap().from_datetime(timestamp).unwrap();
            HttpResponse::Ok().json(pharmacy)
        }
        Err(_) => HttpResponse::BadRequest().body("Incorrect timestamp"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = database::Db::new("./db.json").expect("Cannot read the database");
    let db = RwLock::new(db);
    let db = actix_web::web::Data::new(db);

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
            .app_data(db.clone())
            .route("/pharmacy", web::get().to(pharmacy))
            .route("/pharmacy/{timestamp}", web::get().to(pharmacy))
    })
    .bind_openssl("0.0.0.0:8081", builder)?
    .run()
    .await
    {
        println!("Error running service: {:?}", e);
    }

    Ok(())
}

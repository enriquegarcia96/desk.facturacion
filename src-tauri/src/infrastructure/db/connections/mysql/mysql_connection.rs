use diesel::{MysqlConnection, r2d2::{ConnectionManager, Pool}};
use dotenvy::dotenv;
use log::trace;
use std::env;

pub type DbPool = Pool<ConnectionManager<MysqlConnection>>;
//pub type DbConnection = PooledConnection<ConnectionManager<MysqlConnection>>;

pub fn create_pool() -> DbPool {
  dotenv().ok();

  let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
  trace!("URL connection {}", database_url);
  
  let manager = ConnectionManager::<MysqlConnection>::new(database_url);
  
  Pool::builder()
    .max_size(10)
    .connection_timeout(std::time::Duration::from_secs(10))
    .build(manager)
    .expect("Failed to create database connection pool")
}

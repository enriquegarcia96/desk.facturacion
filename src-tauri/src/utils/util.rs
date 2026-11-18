use std::fmt::format;

use chrono::{DateTime, NaiveDateTime};
use chrono::{Local, TimeZone, Utc, FixedOffset};
use diesel::result::Error::DeserializationError;

pub fn uppercase_words(data: String) -> String {
  let mut result: String = String::new();
  let mut first: bool = true;

  for value in data.chars() {
    if first {
      result.push(value.to_ascii_uppercase());
      first = false;
    } else {
      result.push(value);
      if value == ' ' {
        first = true;
      }
    }
  }
  result
}

pub fn get_now() -> NaiveDateTime {
  Utc::now().naive_utc()
}

pub fn format_utc_as_honduras_time(date: NaiveDateTime) -> String {
  let time_hn = FixedOffset::west_opt(6 * 3600).unwrap();

  let fecha_actual = Utc.from_utc_datetime(&date)
    .with_timezone(&time_hn)
    .format("%Y-%m-%d %H:%M:%S")
    .to_string();

  fecha_actual
}
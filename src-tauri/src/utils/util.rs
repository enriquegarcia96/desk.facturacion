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
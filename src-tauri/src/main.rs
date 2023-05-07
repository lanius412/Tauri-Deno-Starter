#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::Path;

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    let filepath: &Path = Path::new(&path);

    let mut asins: String = String::new();
    let rdr = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_path(filepath);
    match rdr {
        Ok(mut reader) => {
            let mut records = reader.records().peekable();
            while let Some(result) = records.next() {
                match result {
                    Ok(record) => {
                        asins.push_str(&record[0]);
                        if !records.peek().is_none() {
                            asins.push(',')
                        }
                    }
                    Err(e) => return Err(e.to_string()),
                };
            }
        }
        Err(e) => return Err(e.to_string()),
    };
    Ok(asins)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use ic_cdk::query;
use ic_cdk::update;
use std::cell::RefCell;
use std::collections::BTreeMap;

type FileId = String;
type File = Vec<u8>;

// In-memory (non-persistent) storage for testing
thread_local! {
    static FILES: RefCell<BTreeMap<FileId, File>> = RefCell::new(BTreeMap::new());
}

#[update]
fn upload_file(id: String, file: Vec<u8>) {
    FILES.with(|store| {
        store.borrow_mut().insert(id, file);
    });
}

#[query]
fn get_file(id: String) -> Vec<u8> {
    FILES.with(|store| {
        store.borrow().get(&id).cloned().unwrap_or_default()
    })
}

#[query]
fn list_files() -> Vec<String> {
    FILES.with(|store| {
        store.borrow().keys().cloned().collect()
    })
}
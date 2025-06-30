use ic_cdk::query;
use ic_cdk::update;
use std::cell::RefCell;
use std::collections::BTreeMap;

type ChunkId = String;
type Chunk = Vec<u8>;

// In-memory (non-persistent) storage for testing
thread_local! {
    static CHUNKS: RefCell<BTreeMap<ChunkId, Chunk>> = RefCell::new(BTreeMap::new());
}

#[update]
fn upload_chunk(id: String, chunk: Vec<u8>) {
    CHUNKS.with(|store| {
        store.borrow_mut().insert(id, chunk);
    });
}

#[query]
fn get_chunk(id: String) -> Vec<u8> {
    CHUNKS.with(|store| {
        store.borrow().get(&id).cloned().unwrap_or_default()
    })
}

#[query]
fn list_chunks() -> Vec<String> {
    CHUNKS.with(|store| {
        store.borrow().keys().cloned().collect()
    })
}

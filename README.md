
---

## ⚙️ Getting Started

> 🧠 Prerequisites:
- [Install Rust](https://www.rust-lang.org/tools/install)
- [Install DFX CLI](https://internetcomputer.org/docs/current/developer-docs/setup/download-install)
- [Install Node.js](https://nodejs.org/)
- Optional: VSCode with Rust/TS support

---

## 🛠️ Installation & Dev Setup


# Clone the repo
git clone https://github.com/<your-username>/icp_cdn.git
cd icp_cdn

# Install frontend dependencies
cd src/icp_cdn_frontend
npm install

# Go back and generate bindings
cd ../..
dfx generate

--
# Start local Internet Computer replica
dfx start --background

#Deploy backend + frontend
dfx deploy

# Run frontend dev server
cd src/icp_cdn_frontend
npm run dev

import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import Login from "./Login";
import Profile from "./Profile";

const App: React.FC = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
      },
    });
  };

  const handleLogout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setPrincipal(null);
  };

  return (
    <div className="container maxContainer">
      <div className="navbar">
        <div className="nav-title">🚀 CDN dApp</div>
        {principal && (
          <button className="logoutBtn" onClick={handleLogout}>Logout</button>
        )}
      </div>

      {!principal ? (
        <div className="centered">
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <Profile principal={principal} />
      )}
    </div>
  );
};

export default App;

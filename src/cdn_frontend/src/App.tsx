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
    <div>
      <h1>🚀 CDN dApp</h1>
      {!principal ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Profile principal={principal} />
        </>
      )}
    </div>
  );
};

export default App;

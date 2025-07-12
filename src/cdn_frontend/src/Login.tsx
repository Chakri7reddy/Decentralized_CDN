import React from "react";

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  return (
    <>
      <h1 className="title">🔐 Please Login</h1>
      <p className="subtitle">Login securely using your Internet Identity to access the CDN dApp features.</p>
      <button className="button" onClick={onLogin}>Login with Internet Identity</button>
    </>
  );
};

export default Login;

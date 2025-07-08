import React from "react";

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  return (
    <div>
      <p>🔐 Please login using Internet Identity</p>
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

export default Login;

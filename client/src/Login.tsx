import React, { useState } from "react";

interface Props {
  onLogin: (user: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [name, setName] = useState("");

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80 text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">DecorAR</h1>
        <input
          type="text"
          placeholder="Escreve o teu nome..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <button
          onClick={() => onLogin(name)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

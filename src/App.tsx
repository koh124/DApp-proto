import React, { useState } from 'react';
import './App.css'
import { ethers } from "ethers";

const SIGN_ENDPOINT = "https://16x138ngnj.execute-api.ap-northeast-1.amazonaws.com/set-message"
const SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/5e96866a807945c383535e62ad51ba32"
const CONTRACT_ADDRESS = "0x99A8646584bEc6A2228Eec885A45F54D0f31848E";
const DATA = "0xef5fb05b";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSign = async () => {
    setIsSigning(true)
    const response = await fetch(SIGN_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        message: input
      })
    })
    console.log(await response.json());
    setIsSigning(false)
  }

  const handleClick = async () => {
    const response = await fetch(SEPOLIA_RPC_URL, {
      method: "POST",
      body: JSON.stringify({
        "jsonrpc":"2.0",
        "method":"eth_call",
        "params":[
          {
            "to": CONTRACT_ADDRESS,
            "data": DATA
          },
          "latest"
        ],
        "id":1
      }),
    });
    const data = await response.json();

    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["string"], data.result);
    console.log(decoded[0]); // → Hello, World!

    setResult(decoded[0]);
  };

  return (
    <div>
      <h1>Hello World</h1>
      <div>
        <input type="text" value={input} onChange={handleChange} />
        <button onClick={handleSign}>Sign🔑</button>
      </div>
      {isSigning ? <p>Signing...</p> : <p></p>}
      <div>
        <button onClick={handleClick}>Fire RPC🔥</button>
        <p>{result}</p>
      </div>
    </div>
  )
}

export default App

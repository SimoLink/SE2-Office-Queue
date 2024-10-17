import React from "react";
import API from "/src/services/API.js";  // Importa la funzione dal file API.js

const OfficerBoard = () => {
  // Funzione per chiamare callNextCustomer
  const handleCallNextCustomer = (counter) => {
    API.callNextCustomer(counter)
      .then((response) => {
        console.log(`Success: Called next customer for Counter ${counter}`);
      })
      .catch((error) => {
        console.error(`Error calling next customer for Counter ${counter}:`, error);
      });
  };

  return (
    <div className="w-1/2 h-1/2 flex flex-col justify-center items-center m-auto space-y-6 p-10">
      <h1 className="text-2xl font-bold">Officer Board</h1>

      {/* Bottone per Counter 1 */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleCallNextCustomer(1)}
      >
        Call Next Customer for Counter 1
      </button>

      {/* Bottone per Counter 2 */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleCallNextCustomer(2)}
      >
        Call Next Customer for Counter 2
      </button>

      {/* Bottone per Counter 3 */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleCallNextCustomer(3)}
      >
        Call Next Customer for Counter 3
      </button>
    </div>
  );
};

export default OfficerBoard;

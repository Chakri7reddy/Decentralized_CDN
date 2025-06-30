import { useState } from 'react';
import { icp_cdn_backend } from 'declarations/icp_cdn_backend';
import logo from './logo2.svg'; // ✅ Ensure logo2.svg is in src/
import './index.css'; // ✅ Includes Tailwind directives

function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    icp_cdn_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
  }

  return (
    <main className="text-center px-4 py-6">
      <img src={logo} alt="DFINITY logo" className="mx-auto w-48" />
      <h1 className="text-3xl font-bold my-4">Hello from the Decentralized CDN!</h1>
      <h1 className="text-blue-500 text-3xl font-bold underline">
      Tailwind Test Heading
      </h1>
      <div className="bg-lime-200 text-red-500 p-6">
      <p className="text-blue-500">This should be blue!</p>
      </div>




      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-center items-baseline gap-2 max-w-xl mx-auto"
      >
        <label htmlFor="name">Enter your name:</label>
        <input
          id="name"
          type="text"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Click Me!
        </button>
      </form>

      {greeting && (
        <section
          id="greeting"
          className="mt-6 border border-gray-800 p-4 max-w-md mx-auto"
        >
          {greeting}
        </section>
      )}
    </main>
  );
}

export default App;


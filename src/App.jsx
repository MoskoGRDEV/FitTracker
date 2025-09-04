import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        FitTracker Web
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BmiCalculator />
        <Calendar />
        <Notes />
        <Settings />
      </div>
    </div>
  );
}


function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const calculateBmi = () => {
    if (!weight || !height) return;
    const h = height / 100;
    setBmi((weight / (h * h)).toFixed(1));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-2">BMI Calculator</h2>
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={calculateBmi}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Calculate
      </button>
      {bmi && <p className="mt-2">Your BMI: {bmi}</p>}
    </div>
  );
}


function Calendar() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-2">Calendar</h2>
      <p className="text-gray-600">[Calendar component will go here]</p>
    </div>
  );
}


function Notes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([...notes, note]);
    setNote("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-2">Notes</h2>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write a note..."
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={addNote}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
      <ul className="mt-2 list-disc list-inside">
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

function Settings() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-2">Settings</h2>
      <p className="text-gray-600">[Settings component will go here]</p>
    </div>
  );
}

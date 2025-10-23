"use client";
import { useState } from "react";
import * as Tone from "tone";

const MusicApp = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackName, setTrackName] = useState<string>("Untitled Beat");
  const [message, setMessage] = useState<string>("");
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>(["Alice", "Bob", "Charlie"]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Track selected users
  const [userChats, setUserChats] = useState<{ [key: string]: string[] }>({
    Alice: [],
    Bob: [],
    Charlie: [],
  });

  // Function to create a mock file (simulated file)
  const handleCreateMockFile = (fileName: string, genre: string) => {
    const mockFile = `${fileName}_${genre}.txt`; // Simulate a file with a name and genre
    setNotes((prevNotes) => [
      ...prevNotes,
      `Created a mock file: ${mockFile}`,
    ]);
    sendToSelectedUsers(mockFile); // Send the "mock file" to selected users
    alert(`🎶 Mock file created: ${mockFile}`);
  };

  // Function to play a sound and generate a "mock file"
  const handleCreateMusic = async () => {
    const fileName = prompt("Enter the file name:") || "Untitled Beat"; // Ask for file name
    const genre = prompt("Enter the genre:") || "Rock"; // Ask for genre

    const synth = new Tone.Synth().toDestination();
    await Tone.start();
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("G4", "8n", now + 1);
    handleCreateMockFile(fileName, genre); // Create the mock file after the sound is played
  };

  // Function to play the sound with note display
  const handlePlayMusic = async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");
    setIsPlaying(true);
    setNotes((prevNotes) => [...prevNotes, "Tune 1 created!"]);
    setTimeout(() => setIsPlaying(false), 1000);
    setTimeout(() => setNotes((prev) => prev.slice(1)), 2000); // Remove note after 2 seconds
  };

  // Function to start the loop with note display
  const handleStartLoop = () => {
    const synth = new Tone.Synth().toDestination();
    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease("C4", "8n", time);
    }, "4n").start(0);
    Tone.Transport.start();
    setIsLooping(true);
    setNotes((prevNotes) => [...prevNotes, "Loop started!"]);
    setTimeout(() => setNotes((prev) => prev.slice(1)), 2000); // Remove note after 2 seconds
  };

  // Function to stop the loop
  const handleStopLoop = () => {
    Tone.Transport.stop();
    setIsLooping(false);
  };

  // Function to handle chat message sending
  const handleChatSubmit = () => {
    if (message.trim()) {
      selectedUsers.forEach((user) => {
        setUserChats((prev) => ({
          ...prev,
          [user]: [...prev[user], `You: ${message}`],
        }));
      });
      setMessage("");
    }
  };

  // Function to add a new user
  const handleAddUser = () => {
    const newUser = prompt("Enter the new user's name:");
    if (newUser) {
      setUsers((prev) => [...prev, newUser]);
      setUserChats((prev) => ({ ...prev, [newUser]: [] }));
    }
  };

  // Function to send mock file to multiple users
  const sendToSelectedUsers = (fileName: string) => {
    selectedUsers.forEach((user) => {
      setUserChats((prev) => ({
        ...prev,
        [user]: [...prev[user], `Sent you a mock file: ${fileName}`],
      }));
    });
  };

  // Function to toggle user selection
  const toggleUserSelection = (user: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(user)) {
        return prev.filter((u) => u !== user);
      } else {
        return [...prev, user];
      }
    });
  };

  // Function to truncate long names
  const truncateName = (name: string, length: number = 8) => {
    return name.length > length ? name.substring(0, length) + "..." : name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A8D0E6] to-[#C4E4F7] text-black p-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white text-black p-8 rounded-3xl shadow-lg flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex flex-col items-center md:w-2/3 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#6D9DC5]">
            🎧 Music Mockup App
          </h1>

          <input
            type="text"
            className="w-full md:w-96 px-4 py-2 rounded text-black focus:outline-none"
            placeholder="Enter track name"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
          />

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button
              onClick={handleCreateMusic}
              className="bg-[#A8D0E6] hover:bg-[#C4E4F7] px-6 py-2 rounded shadow text-black font-semibold"
            >
              🎼 Create Music (Mock)
            </button>
            <button
              onClick={handlePlayMusic}
              className="bg-[#C4E4F7] hover:bg-[#A8D0E6] px-6 py-2 rounded shadow text-black font-semibold"
            >
              ▶️ Play Sound
            </button>
            <button
              onClick={isLooping ? handleStopLoop : handleStartLoop}
              className={`${
                isLooping ? "bg-[#FF6347]" : "bg-[#72D3E0]"
              } hover:bg-[#A8D0E6] px-6 py-2 rounded shadow text-black font-semibold`}
            >
              {isLooping ? "🛑 Stop Loop" : "🔁 Start Loop"}
            </button>
          </div>

          {isPlaying && <p className="text-sm mt-2">🔊 Playing your track...</p>}

          {/* Displaying notes */}
          <div className="mt-4 space-y-2">
            {notes.map((note, index) => (
              <div
                key={index}
                className="bg-[#72D3E0] text-black p-2 rounded-lg shadow-md"
              >
                {note}
              </div>
            ))}
          </div>

          <footer className="mt-10 text-gray-600 text-sm text-center">
            Mocked frontend social music app — no backend or file saving
            <br />
            Built with <code>Next.js</code> + <code>Tone.js</code>
          </footer>
        </div>

        <div className="w-full md:w-80 bg-[#C4E4F7] p-4 rounded-xl shadow-xl space-y-4">
          <h2 className="text-xl font-semibold text-black flex justify-between items-center">
            Users
          </h2>

          <div className="space-y-2 max-h-[160px] overflow-y-auto">
            {users.map((user) => (
              <div key={user} className="flex items-center">
                <button
                  className="w-full text-left p-2 rounded-lg bg-[#A8D0E6] text-black"
                  onClick={() => setSelectedUsers([user])} // Click a user to select only one
                >
                  {truncateName(user)}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddUser}
            className="w-full text-left p-2 rounded-lg bg-[#72D3E0] text-white"
          >
            + Add User
          </button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="w-full md:w-96 bg-[#E4F5FF] p-4 rounded-xl shadow-xl space-y-4">
            <h3 className="text-xl font-semibold">Chat with {selectedUsers.join(", ")}</h3>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {selectedUsers.map((user) => (
                <div key={user}>
                  {userChats[user]?.map((msg, index) => (
                    <div key={index} className="bg-[#A8D0E6] p-2 rounded-lg">
                      <p>{msg}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="w-full p-2 rounded-l-xl text-black"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handleChatSubmit}
                className="bg-[#72D3E0] hover:bg-[#A8D0E6] px-4 py-2 rounded-r-xl text-white"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicApp;

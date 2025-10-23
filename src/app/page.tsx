"use client";
import { useState, useEffect } from "react";
import * as Tone from "tone";

interface UserChats {
  [key: string]: string[];
}

const MusicApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackName, setTrackName] = useState<string>("Untitled Beat");
  const [message, setMessage] = useState<string>("");
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>(["Alice", "Bob", "Charlie"]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userChats, setUserChats] = useState<UserChats>({
    Alice: [],
    Bob: [],
    Charlie: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      Tone.start();
    }
  }, []);

  const handleCreateMockFile = (fileName: string, genre: string): void => {
    const mockFile = `${fileName}_${genre}.txt`;
    setNotes((prevNotes) => [
      ...prevNotes,
      `Created a mock file: ${mockFile}`,
    ]);
    sendToSelectedUsers(mockFile);
    alert(`🎶 Mock file created: ${mockFile}`);
  };

  const handleCreateMusic = async (): Promise<void> => {
    const fileName = prompt("Enter the file name:") || "Untitled Beat";
    const genre = prompt("Enter the genre:") || "Rock";

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("G4", "8n", now + 1);
    handleCreateMockFile(fileName, genre);
  };

  const handlePlayMusic = async (): Promise<void> => {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");
    setIsPlaying(true);
    setNotes((prevNotes) => [...prevNotes, "Tune 1 created!"]);
    setTimeout(() => setIsPlaying(false), 1000);
    setTimeout(() => setNotes((prev) => prev.slice(1)), 2000);
  };

  const handleStartLoop = (): void => {
    Tone.Transport.start();
    setIsLooping(true);
    setNotes((prevNotes) => [...prevNotes, "Loop started!"]);
    setTimeout(() => setNotes((prev) => prev.slice(1)), 2000);
  };

  const handleStopLoop = (): void => {
    Tone.Transport.stop();
    setIsLooping(false);
  };

  const handleChatSubmit = (): void => {
    if (message.trim()) {
      const truncatedMessage =
        message.length > 100 ? message.substring(0, 100) + "..." : message;

      selectedUsers.forEach((user) => {
        setUserChats((prev) => ({
          ...prev,
          [user]: [...prev[user], `You: ${truncatedMessage}`],
        }));
      });
      setMessage("");
    }
  };

  const handleAddUser = (): void => {
    const newUser = prompt("Enter the new user's name:");
    if (newUser && !users.includes(newUser)) {
      setUsers((prev) => [...prev, newUser]);
      setUserChats((prev) => ({ ...prev, [newUser]: [] }));
    }
  };

  const sendToSelectedUsers = (fileName: string): void => {
    selectedUsers.forEach((user) => {
      setUserChats((prev) => ({
        ...prev,
        [user]: [...prev[user], `Sent you a mock file: ${fileName}`],
      }));
    });
  };

  const truncateName = (name: string, length: number = 8): string => {
    return name.length > length ? name.substring(0, length) + "..." : name;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#A8D0E6] to-[#C4E4F7] text-black p-6 flex items-center justify-center"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="w-full max-w-4xl bg-white text-black p-8 rounded-3xl shadow-lg flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex flex-col items-center md:w-2/3 space-y-6">
          <h1
            className="text-5xl font-semibold text-center mb-6 text-[#6D9DC5]"
            style={{ fontFamily: "Lora, serif" }}
          >
            🎧 Music App
          </h1>

          <input
            type="text"
            className="w-full md:w-96 px-4 py-3 rounded text-black focus:outline-none text-xl"
            placeholder="Enter track name"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            style={{ fontFamily: "Poppins, sans-serif" }}
          />

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button
              onClick={handleCreateMusic}
              className="bg-[#A8D0E6] hover:bg-[#C4E4F7] px-6 py-3 rounded shadow text-black font-semibold text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              🎼 Create Music (Mock)
            </button>
            <button
              onClick={handlePlayMusic}
              className="bg-[#C4E4F7] hover:bg-[#A8D0E6] px-6 py-3 rounded shadow text-black font-semibold text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              ▶️ Play Sound
            </button>
            <button
              onClick={isLooping ? handleStopLoop : handleStartLoop}
              className={`${
                isLooping ? "bg-[#FF6347]" : "bg-[#72D3E0]"
              } hover:bg-[#A8D0E6] px-6 py-3 rounded shadow text-black font-semibold text-lg`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {isLooping ? "🛑 Stop Loop" : "🔁 Start Loop"}
            </button>
          </div>

          {isPlaying && (
            <p
              className="text-sm mt-2 text-gray-700"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              🔊 Playing your track...
            </p>
          )}

          <div className="mt-6 space-y-2">
            {notes.map((note, index) => (
              <div
                key={index}
                className="bg-[#72D3E0] text-black p-3 rounded-lg shadow-md text-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {note}
              </div>
            ))}
          </div>

          <footer
            className="mt-12 text-gray-600 text-sm text-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Music is life, share it with everyone.
            <br />
            <code className="font-semibold">Music App</code> +{" "}
            <code className="font-semibold">Join Our Community</code>
          </footer>
        </div>

        <div
          className="w-full md:w-80 bg-[#C4E4F7] p-4 rounded-xl shadow-xl space-y-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <h2
            className="text-2xl font-semibold text-black flex justify-between items-center"
            style={{ fontFamily: "Lora, serif" }}
          >
            Users
          </h2>

          <div className="space-y-3 max-h-[160px] overflow-y-auto">
            {users.map((user) => (
              <div key={user} className="flex items-center">
                <button
                  className="w-full text-left p-3 rounded-lg bg-[#A8D0E6] text-black hover:bg-[#6D9DC5] transition duration-200 text-lg"
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
                    )
                  }
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {truncateName(user)}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddUser}
            className="w-full text-left p-3 rounded-lg bg-[#72D3E0] text-white hover:bg-[#A8D0E6] transition duration-200 text-lg"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            + Add User
          </button>
        </div>

        {selectedUsers.length > 0 && (
          <div
            className="w-full md:w-96 bg-[#E4F5FF] p-4 rounded-xl shadow-xl space-y-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <h3
              className="text-2xl font-semibold"
              style={{ fontFamily: "Lora, serif" }}
            >
              Chat with {selectedUsers.join(", ")}
            </h3>
            <div className="space-y-3 max-h-[160px] overflow-y-auto">
              {selectedUsers.map((user) => (
                <div key={user}>
                  <h4 className="font-semibold">{user}</h4>
                  <div className="space-y-2">
                    {userChats[user]?.map((msg, index) => (
                      <div key={index} className="bg-[#A8D0E6] text-black p-3 rounded-lg shadow-md text-lg">
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full px-4 py-3 rounded text-black"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <button
              onClick={handleChatSubmit}
              className="bg-[#A8D0E6] hover:bg-[#C4E4F7] px-6 py-3 rounded shadow text-black font-semibold text-lg w-full"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicApp;

import { useState } from "react";
import * as Tone from "tone";

// Define interfaces for user chats and user selection
interface UserChats {
  [key: string]: string[];
}

const NoteItem: React.FC<{ note: string }> = ({ note }) => (
  <div
    className="bg-[#72D3E0] text-black p-3 rounded-lg shadow-md text-lg"
    style={{ fontFamily: "Poppins, sans-serif" }}
  >
    {note}
  </div>
);

const ChatMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-[#A8D0E6] text-black p-3 rounded-lg shadow-md text-lg">
    <p>{message}</p>
  </div>
);

const UserListItem: React.FC<{
  user: string;
  isSelected: boolean;
  onToggle: (user: string) => void;
  truncate: (name: string) => string;
}> = ({ user, isSelected, onToggle, truncate }) => (
  <button
    className={`w-full text-left p-3 rounded-lg ${isSelected ? "bg-[#6D9DC5]" : "bg-[#A8D0E6] hover:bg-[#6D9DC5]"} text-black transition duration-200 text-lg`}
    onClick={() => onToggle(user)}
    style={{ fontFamily: "Poppins, sans-serif" }}
  >
    {truncate(user)}
  </button>
);

const UserList: React.FC<{
  users: string[];
  selectedUsers: string[];
  onToggleUser: (user: string) => void;
  onAddUser: () => void;
  truncateName: (name: string) => string;
}> = ({ users, selectedUsers, onToggleUser, onAddUser, truncateName }) => (
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
          <UserListItem
            user={user}
            isSelected={selectedUsers.includes(user)}
            onToggle={onToggleUser}
            truncate={truncateName}
          />
        </div>
      ))}
    </div>
    <button
      onClick={onAddUser}
      className="w-full text-left p-3 rounded-lg bg-[#72D3E0] text-white hover:bg-[#A8D0E6] transition duration-200 text-lg"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      + Add User
    </button>
  </div>
);

const ChatWindow: React.FC<{
  selectedUsers: string[];
  userChats: UserChats;
  message: string;
  onMessageChange: (newMessage: string) => void;
  onChatSubmit: () => void;
}> = ({ selectedUsers, userChats, message, onMessageChange, onChatSubmit }) => (
  <div
    className="w-full md:w-96 bg-[#E4F5FF] p-4 rounded-xl shadow-xl space-y-4"
    style={{ fontFamily: "Poppins, sans-serif" }}
  >
    <h3 className="text-2xl font-semibold" style={{ fontFamily: "Lora, serif" }}>
      Chat with {selectedUsers.join(", ")}
    </h3>
    <div className="space-y-3 max-h-[160px] overflow-y-auto">
      {selectedUsers.map((user) => (
        <div key={user}>
          <h4 className="font-semibold">{user}</h4>
          <div className="space-y-2">
            {userChats[user]?.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex">
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Type a message"
        className="w-full px-4 py-3 rounded text-black"
        style={{ fontFamily: "Poppins, sans-serif" }}
      />
      <button
        onClick={onChatSubmit}
        className="bg-[#A8D0E6] hover:bg-[#C4E4F7] px-6 py-3 rounded shadow text-black font-semibold text-lg w-full"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Send Message
      </button>
    </div>
  </div>
);

const MusicApp: React.FC = () => {
  const [isPlaying] = useState<boolean>(false);

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
    await Tone.start();
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("G4", "8n", now + 1);
    handleCreateMockFile(fileName, genre);
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

  const toggleUserSelection = (user: string): void => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const truncateName = (name: string, length: number = 8): string => {
    return name.length > length ? name.substring(0, length) + "..." : name;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#A8D0E6] to-[#C4E4F7] text-black p-6 flex items-center justify-center"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="w-full max-w-6xl space-y-4">
        <h1 className="text-3xl font-bold text-center">Music Chat App</h1>
        <div className="flex space-x-6">
          <UserList
            users={users}
            selectedUsers={selectedUsers}
            onToggleUser={toggleUserSelection}
            onAddUser={handleAddUser}
            truncateName={truncateName}
          />
          <div className="space-y-4 w-full">
            <ChatWindow
              selectedUsers={selectedUsers}
              userChats={userChats}
              message={message}
              onMessageChange={setMessage}
              onChatSubmit={handleChatSubmit}
            />
            <div className="space-x-4 flex justify-center">
              <button
                onClick={handleCreateMusic}
                className="px-6 py-3 rounded-xl text-lg bg-[#A8D0E6] hover:bg-[#72D3E0] transition duration-200 text-black"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Create Music
              </button>
              <button
                onClick={isPlaying ? handleStopLoop : handleStartLoop}
                className="px-6 py-3 rounded-xl text-lg bg-[#A8D0E6] hover:bg-[#72D3E0] transition duration-200 text-black"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {isLooping ? "Stop Loop" : "Start Loop"}
              </button>
            </div>
            <div className="flex justify-center">
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <NoteItem key={index} note={note} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicApp;

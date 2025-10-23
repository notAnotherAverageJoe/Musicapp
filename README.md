# 🎧 Music Mockup App (Collaborative Frontend Prototype)

This is a proof-of-concept frontend application built with **React** and **Tone.js** that simulates a social, collaborative music creation and sharing environment. It is a client-side only prototype, meaning no actual files are saved and all chat and user data resets on refresh.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone [Your Repository URL]
    cd music-mockup-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

1.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser to `http://localhost:3000` (or the address shown in your console).

---

## ✨ Features

The application simulates the following core functionalities:

- **Audio Generation:** Use **Tone.js** to generate simple synth sounds (a C-E-G chord) when music is "created."
- **Looping:** Start and stop a basic audio loop using `Tone.Transport`.
- **Mock File Creation:** Simulates the creation of a music track (prompts for name/genre) and generates a file notification.
- **User Management:** Add new users and manage a list of collaborators.
- **Collaboration/Chat:** Select one or more users to send messages and share notifications about your created mock files.

---

## 🛠️ Technology Stack

- **Framework:** React (Functional Components with Hooks)
- **Language:** TypeScript
- **Audio:** Tone.js (Web Audio Synthesis)
- **Styling:** Tailwind CSS (Utility-First Framework)

---

## 📂 Project Structure

The primary application logic resides in the main component, which has been refactored into smaller, dedicated components for organization:

# Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share links, and see live results in real time. The application includes basic fairness and anti-abuse mechanisms along with persistent data storage.

## Features

* Create polls with multiple options
* Shareable poll links
* Real-time voting updates
* Persistent poll data
* Fairness and anti-abuse mechanisms

## Tech Stack

**Frontend**

* React
* Vite

**Backend**

* Node.js
* Express

**Real-time Communication**

* WebSockets / socket-based updates

**Environment**

* Gemini API (configured via environment variables)

---

## Getting Started (Local Setup)

### Prerequisites

* Node.js (v16 or later)
* npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/manjunathgu/real-time-poll-rooms.git
cd real-time-poll-rooms
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add:

```
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and go to:

```
http://localhost:3000
```

---

## Fairness / Anti-Abuse Mechanisms

1. **One vote per session**
   Each user receives a session token stored in the browser to prevent multiple votes.

2. **Rate limiting**
   The server limits rapid repeated voting attempts from the same source.

---

## Edge Cases Handled

* Poll not found
* Duplicate voting attempts
* Invalid poll options
* Voting after poll expiration (if enabled)
* Network interruptions during voting

---

## Known Limitations

* Session-based voting can be bypassed by clearing browser data.
* No authentication or user accounts.
* Rate limiting may affect users on shared networks.

---

## Deployment

The application is deployed on a public hosting platform.

**Live URL:**
(Add your deployed link here)

---

## Repository

GitHub Repository:
https://github.com/manjunathgu/real-time-poll-rooms

---

## Author

Manjunath G U

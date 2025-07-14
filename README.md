# AI-Based Empathy Measurement and Mentoring Platform

### 1. Project Description

This project is a web-based platform designed to enhance teacher-student interactions by leveraging Artificial Intelligence. The core problem in modern education is the lack of objective tools to measure and improve empathy in communication. This platform addresses that gap by providing a system to analyze conversational data, measure emotional tone, and offer actionable feedback to educators.

The system transforms qualitative emotional data from conversations into quantifiable metrics, allowing teachers to gain data-driven insights into their mentoring style. By tracking empathetic communication over time, it empowers educators to foster a more positive, inclusive, and effective learning environment.

### 2. Key Features

-   **Secure User Authentication:** Users can create an account and log in securely. Passwords are fully hashed on the backend.
-   **Interaction Management:** Teachers can add new conversation transcripts, view a list of all past interactions, and delete them.
-   **Voice-to-Text:** Users can use their microphone to dictate conversations directly into the platform, powered by the browser's Speech Recognition API.
-   **AI-Powered Sentiment Analysis:** The backend uses a Hugging Face Transformer model (`distilbert-base-uncased-finetuned-sst-2-english`) to perform real-time sentiment analysis on the teacher's dialogue.
-   **Dynamic Empathy Scoring & Feedback:** Based on the AI analysis, the platform generates a quantitative empathy score and provides actionable, constructive feedback.
-   **Interactive Dashboard:** A central dashboard displays key metrics like average empathy score and total interactions.
-   **Detailed Analysis Reports:** Each interaction has a dedicated page showing the full transcript, sentiment breakdown, and personalized feedback.

### 3. Tech Stack

| Category      | Technology                                    |
| :------------ | :-------------------------------------------- |
| **Frontend** | React.js, React Router, CSS Modules           |
| **Backend** | Python, FastAPI                               |
| **Database** | MongoDB                                       |
| **AI/ML** | Hugging Face Transformers, PyTorch            |
| **API Testing**| VS Code REST Client                          |

### 4. Project Setup & Installation

To run this project locally, you will need two separate terminals: one for the backend and one for the frontend.

#### Prerequisites

-   Node.js (v16 or higher)
-   Python (v3.9 or higher)
-   MongoDB Community Server

#### Backend Setup

1.  **Navigate to the project's root folder** (where `main.py` is located).
2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You may need to create a `requirements.txt` file first by running `pip freeze > requirements.txt` in your backend environment.)*
    The required packages are: `fastapi`, `uvicorn`, `motor`, `passlib[bcrypt]`, `python-dotenv`, `pydantic_core`, `transformers`, `torch`.
3.  **Create an environment file:** Create a `.env` file in the root directory and add your MongoDB connection string:
    ```
    MONGO_URI="mongodb://localhost:27017"
    ```
4.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The server will be running on `http://127.0.0.1:8000`.

#### Frontend Setup

1.  **Navigate to the frontend folder** (`my-app` or your React app's directory).
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Run the frontend server:**
    ```bash
    npm start
    ```
    The React app will open on `http://localhost:3000`.

### 5. How to Use

1.  **Register:** Open the app and create a new user account on the Sign Up page.
2.  **Login:** Log in with your credentials.
3.  **Add Interaction:** Navigate to the "Add Interaction" page. You can either type the conversation or use the "Start Recording" button to dictate it.
4.  **Analyze:** Click "Save & Analyze". You will be redirected to the analysis page.
5.  **View Results:** See the empathy score, transcript, and actionable feedback.
6.  **Manage:** Go back to the dashboard to see your interaction in the "Recent Interactions" list.

### 6. Future Scope

-   **Multimodal Analysis:** Integrate voice tonality and facial expression recognition for a more accurate empathy score.
-   **Advanced Empathy Metrics:** Move beyond sentiment analysis to detect specific empathy markers like active listening, validation, and asking open-ended questions.
-   **LMS Integration:** Allow integration with platforms like Moodle or Google Classroom.
-   **Long-term Progress Tracking:** Provide teachers with detailed charts showing their empathy score improvement over months.

---
*This project was developed as part of the Master of Computer Applications curriculum at CMR Institute of Technology, Bengaluru.*


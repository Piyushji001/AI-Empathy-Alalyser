const API_URL = 'http://127.0.0.1:8000';

export const api_register = async (username, password) => {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response;
};

export const api_login = async (username, password) => {
  // In a real app, this would call the backend, validate, and return a JWT token.
  // For now, we simulate success and store a dummy token.
  if (username && password) {
      localStorage.setItem('authToken', 'dummy_token_for_demo');
      return { ok: true };
  }
  return { ok: false, detail: "Invalid credentials" };
};

export const api_logout = () => {
  localStorage.removeItem('authToken');
};

export const fetchInteractions = async () => {
  try {
    const response = await fetch(`${API_URL}/interactions/`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.map(item => ({...item, id: item._id}));
  } catch (error) {
    console.error("Failed to fetch interactions:", error);
    return [];
  }
};

export const analyzeInteraction = async (id) => {
    try {
        const response = await fetch(`${API_URL}/analyze/${id}`, { method: 'POST' });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to analyze interaction:", error);
        return null;
    }
};

export const addInteraction = async (interactionData) => {
    const response = await fetch(`${API_URL}/interactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interactionData),
    });
    if (!response.ok) throw new Error('Failed to add interaction');
    return await response.json();
};

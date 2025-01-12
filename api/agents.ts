const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function listAgents() {
    console.log(`${API_URL}/agents`);
    console.log(`listing to agents list`);
    const res = await fetch(`${API_URL}/agents`);
    const data = await res.json();
    console.log(data);
    return data;
}
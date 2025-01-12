const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function login(username: string, password: string) {
    const res = await fetch(`${API_URL}/manage/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
        console.log(data);
        throw Error("failed to login");
    }
    return data;
}


export async function register(name:string, email:string, phoneNumber:number) {
  const res = await fetch(`${API_URL}/manage/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, phoneNumber }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.log(data);
    throw Error('Failed to signup');
  }
  return data;



}
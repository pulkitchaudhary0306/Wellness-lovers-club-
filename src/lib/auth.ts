const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function login(username: string, password: string) {
  const response = await fetch(`${WP_API}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

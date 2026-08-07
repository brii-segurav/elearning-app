const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function getToken() {
  return localStorage.getItem("token") || ""
}

export const api = {
  get: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    return res.json()
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    })
    return res.json()
  }
}

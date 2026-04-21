export default async function handler(req, res) {
  try {
    // hanya boleh POST
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token kosong" });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = "SinzCrash";
    const REPO = "sinz";
    const PATH = "database.json"; // ⬅️ sesuai file kamu

    // 🔹 ambil file dari GitHub
    const getFile = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    const fileData = await getFile.json();

    let tokens = [];

    // 🔹 decode file lama
    if (fileData && fileData.content) {
      try {
        const decoded = Buffer.from(fileData.content, "base

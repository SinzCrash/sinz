export default async function handler(req, res) {
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
  const PATH = "database.json";

  // ambil file lama
  const getFile = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`
    }
  });

  const fileData = await getFile.json();

  let tokens = [];

  if (fileData.content) {
    const decoded = Buffer.from(fileData.content, "base64").toString();
    tokens = JSON.parse(decoded);
  }

  // tambah token
  tokens.push(token);

  // encode ulang
  const newContent = Buffer.from(JSON.stringify(tokens, null, 2)).toString("base64");

  // upload ke GitHub
  await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "add token",
      content: newContent,
      sha: fileData.sha
    })
  });

  res

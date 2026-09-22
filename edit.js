export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.SILICONFLOW_API_KEY;
  if (!key) return res.status(500).json({ error: "服务器还没有配置 SILICONFLOW_API_KEY" });

  try {
    const { image, prompt } = req.body || {};
    if (!image || !prompt) return res.status(400).json({ error: "缺少图片或提示词" });

    const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Qwen/Qwen-Image-Edit-2509",
        prompt,
        image
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || data?.error || "SiliconFlow 请求失败",
        raw: data
      });
    }

    const url = data?.images?.[0]?.url;
    if (!url) return res.status(502).json({ error: "没有拿到生成图片地址", raw:data });
    return res.status(200).json({ imageUrl:url });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "服务器错误" });
  }
}

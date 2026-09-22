exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const key = process.env.SILICONFLOW_API_KEY;

  if (!key) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "服务器还没有配置 SILICONFLOW_API_KEY"
      })
    };
  }

  try {
    const raw = event.body || "";
    const parsed = event.isBase64Encoded
      ? Buffer.from(raw, "base64").toString("utf8")
      : raw;

    const { image, prompt } = JSON.parse(parsed || "{}");

    if (!image || !prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "缺少图片或提示词" })
      };
    }

    const response = await fetch(
      "https://api.siliconflow.cn/v1/images/generations",
      {
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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error:
            data?.message ||
            data?.error ||
            "SiliconFlow 请求失败"
        })
      };
    }

    const url = data?.images?.[0]?.url;

    if (!url) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "没有拿到生成图片地址"
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: url
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: e?.message || "服务器错误"
      })
    };
  }
};

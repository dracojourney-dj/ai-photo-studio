# 手机直接使用版 AI Photo Studio

这个版本针对手机浏览器设计，后端调用 SiliconFlow 的 Qwen/Qwen-Image-Edit-2509。

## 部署
1. 把本项目上传到 GitHub。
2. 在 Vercel 导入这个 GitHub 仓库。
3. 在 Vercel -> Project Settings -> Environment Variables 添加：
   SILICONFLOW_API_KEY = 你的 SiliconFlow Key
4. Redeploy。
5. 打开 Vercel 给你的 https://xxxx.vercel.app 手机网址即可使用。

API Key 不放在网页代码里，而是作为服务器环境变量。

注意：当前“马克笔速写”的上半部分保护是通过编辑提示词约束实现，还不是像素级自动蒙版合成。

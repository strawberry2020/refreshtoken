const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // 引入 cors 模块

const app = express();
app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["Authorization", "RefreshToken"]
  })
); // 使用 cors 中间件

// 用户数据库（示例）
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// 密钥，用于生成和验证 token
const secretKey = "your-secret-key";

// 登录接口
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 在实际应用中，这里应该是查询数据库验证用户名和密码是否匹配
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    res.status(401).json({ error: "Invalid credentials", code: 401 });
    return;
  }

  // 生成 token 和 refreshToken
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "3s" });
  const refreshToken = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: "10s",
  });

  // 将 token 和 refreshToken 放入 headers
  res.header("Authorization", `Bearer ${token}`);
  res.header("RefreshToken", `Bearer ${refreshToken}`);

  res.json({ message: "Login successful", code: 200 });
});

// 刷新 token 接口
app.get("/refresh_token", (req, res) => {
  const refreshToken = req.header("authorization");

  // 验证 refreshToken 的有效性
  try {
    const decoded = jwt.verify(refreshToken.replace("Bearer ", ""), secretKey);

    // 生成新的 token
    const token = jwt.sign({ userId: decoded.userId }, secretKey, {
      expiresIn: "3s",
    });

    // 将新生成的 token 放入 headers
    res.header("Authorization", `Bearer ${token}`);

    res.json({ message: "Token refreshed successfully", code: 200 });
  } catch (err) {
    res.status(401).json({ error: "Invalid refresh token", code: 401 });
  }
});

// 受保护的资源接口
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected resource", code: 200 });
});

// 验证 Token 的中间件函数
function verifyToken(req, res, next) {
  // 从请求头中获取 Token
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({ error: "Unauthorized", code: 401 });
    return;
  }

  // 验证 Token 的有效性
  jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Invalid token", code: 401 });
      return;
    }

    // 将解码后的 UserID 添加到请求对象中
    req.userId = decoded.userId;

    next(); // 调用下一个中间件函数
  });
}

app.listen(5000, () => {});

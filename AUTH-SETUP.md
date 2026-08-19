# 登录与跨设备进度

本站是 GitHub Pages 静态站，登录同步使用已有的 CloudBase 环境，不需要另建 Supabase 项目。

## 已完成的云端配置

- 环境：`token-d2g5m49b25995a29c`，区域：`ap-shanghai`
- 登录方式：CloudBase 账号 + 密码（普通用户名，不是邮箱）
- 进度集合：`ai_trainer_progress`
- 唯一索引：`user_id_unique`
- 权限：每个账号只能读写自己的 `user_id` 记录
- 安全域名：`localhost:4173`、`zjl4616.github.io`

## 前端配置

`auth-config.js` 中只放 CloudBase publishable key。它是浏览器端公开配置，可以提交到 GitHub；不要把 CloudBase 管理密钥、API 密钥或服务端凭证放进前端。

```js
window.AI_TRAINER_AUTH = {
  provider: "cloudbase",
  env: "token-d2g5m49b25995a29c",
  region: "ap-shanghai",
  accessKey: "CloudBase publishable key",
  table: "ai_trainer_progress"
};
```

## 使用方式

1. 由管理员在 CloudBase 控制台的“用户管理”中创建普通用户名和密码账号。
2. 打开网站右上角“登录同步”，填写账号和密码。
3. 登录后，已有本机进度会与云端进度合并；之后每次批改或自评都会自动同步。
4. 换设备打开同一个 GitHub Pages 地址，用相同账号登录即可恢复进度。

当前 CloudBase Web SDK 的 `signUp()` 仅支持邮箱或手机号验证，不能在浏览器直接创建普通用户名账号；因此站点不把管理密钥放在前端，也不提供一个必然失败的自助注册按钮。

未登录时仍可以完整练习，进度保存在当前浏览器；登录窗口也可以导出本机进度 JSON 作为备份。

## 域名变更

如果将来更换 GitHub Pages 域名或本地开发端口，需要在 CloudBase 安全域名中添加新的 `host:port`。安全域名传播可能需要几分钟。

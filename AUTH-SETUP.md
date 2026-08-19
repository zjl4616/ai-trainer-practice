# 登录与跨设备进度

这个站是 GitHub Pages 静态站，不能只靠浏览器本身保存跨设备数据。登录同步采用 Supabase 邮箱账号，匿名公钥可以放在前端，真正的访问控制由数据库 RLS 规则负责。

## 1. 创建项目

在 Supabase 创建一个项目，在 `Project Settings → API` 复制：

- `Project URL`
- `anon public key`

不要把 `service_role` key 放进网站，也不要提交到 GitHub。

## 2. 创建进度表

在 Supabase SQL Editor 执行：

```sql
create table public.practice_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.practice_progress enable row level security;

create policy "users can read own practice progress"
on public.practice_progress for select
to authenticated
using (auth.uid() = user_id);

create policy "users can insert own practice progress"
on public.practice_progress for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update own practice progress"
on public.practice_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3. 填写前端配置

编辑 `auth-config.js`：

```js
window.AI_TRAINER_AUTH = {
  provider: "supabase",
  url: "https://你的项目.supabase.co",
  anonKey: "你的 anon public key",
  table: "practice_progress"
};
```

然后提交并推送到 `gh-pages`。登录后，本机已有进度会和云端进度合并；之后每次自评都会自动同步。未填写配置时，网站仍可作为本机练习站使用，并可从登录窗口导出本机进度。

## 4. 邮箱验证

Supabase 默认可能要求注册邮箱验证。开发阶段可以在 `Authentication → Providers → Email` 关闭 Confirm email；正式使用建议保留验证，并在 `Authentication → URL Configuration` 添加 GitHub Pages 地址：

`https://zjl4616.github.io/ai-trainer-practice/`

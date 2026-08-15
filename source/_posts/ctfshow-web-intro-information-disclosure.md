---
title: CTFshow Web 入门 — 信息泄露专题总结
date: 2026-08-15
updated: 2026-08-15
tags: [CTFshow, 学习笔记, 总结]
categories: [Security-Notes]
description: CTFshow Web 入门阶段信息泄露类型题目的学习总结：前端源码、robots.txt、备份文件、版本控制泄露的原理、利用思路与防御方案。
keywords: CTFshow, 信息泄露, Web安全, 学习笔记
comments: true
toc: true
---

<!-- more -->

## 专题背景

在完成 CTFshow Web 入门前 10 题的过程中，信息泄露类题目占据了很大比重，另外还涉及 PHP 弱类型基础（后续单独整理）。这篇总结记录我在刷题过程中对「信息泄露」这一类漏洞的完整理解。

信息泄露类题目有一个共同特点：**不需要构造复杂的注入 Payload，考的是信息收集的意识和方法**——攻击者通过访问本不该被外部访问的文件或路径，直接获取敏感信息。

## Vulnerability Principle

信息泄露的本质是**部署边界与访问控制的缺失**：

1. 开发阶段产生的文件（备份、编辑器临时文件、版本控制目录）在部署时没有被清理；
2. 站点没有对敏感文件类型做访问控制（或目录遍历被开启）；
3. 前端代码中直接内嵌了本应只存在于服务端的敏感信息。

攻击者只需要**猜测/枚举常见文件路径**（或直接查看前端源码），就能"捡到"这些信息。这类漏洞不需要绕过复杂的防御，利用成本极低。

## 常见泄露类型与利用思路

### 1. 前端源码泄露

**场景**：敏感信息直接写在 HTML/JS 中，如注释里的账号密码、调试接口地址。

**利用**：浏览器 F12 开发者工具 / `view-source:` 查看源码，直接搜索关键词（`password`、`flag`、`admin`）。

**防御**：敏感信息一律不下发到前端；JS 混淆不能替代服务端鉴权。

### 2. robots.txt 暴露路径

**场景**：管理员用 `robots.txt` 声明"禁止抓取"的后台路径，反而把这些路径直接告诉攻击者。

**利用**：访问 `/robots.txt`，逐个尝试 Disallow 中列出的路径。

**防御**：`robots.txt` 只是君子协定，不是访问控制。敏感路径不应写入 robots.txt，真正的防护靠鉴权。

### 3. 备份文件泄露

**场景**：编辑器或人工操作在 web 目录留下备份：

| 类型 | 常见命名 |
|------|---------|
| 手动备份 | `index.php.bak`、`index.php.old`、`www.zip`、`www.tar.gz` |
| 编辑器临时文件 | `index.php.swp`、`index.php~`、`index.php.swo` |

**利用**：用 `dirsearch` / `ffuf` 携带常见后缀字典枚举，命中后直接下载源码。拿到源码即可审计出完整漏洞利用链（数据库配置、逻辑漏洞一目了然）。

**防御**：备份文件移出 web 目录；构建/部署流程中增加敏感文件检查。

### 4. 版本控制信息泄露

**场景**：部署时使用 `git clone` 后未删除 `.git` 目录，或 `.svn` 目录残留在 web 目录下。

**利用**：

```bash
# .git 泄露
git-dumper https://target/.git/ ./out/
# 或使用 githack
githack.py https://target/.git/

# 恢复源码后查看历史记录
git log --oneline
git show <commit>
```

恢复出完整仓库后，不仅拿到最新源码，还能从提交历史中找到被"删掉"的敏感内容（如开发期的硬编码配置）。

**防御**：部署时删除 `.git` / `.svn` 目录；用 `git archive` / CI 产物部署替代直接 clone；web 服务器拒绝访问 `/.git/`、`/.svn/` 路径。

## Root Cause

为什么这类问题在入门题中反复出现？根因在**发布流程而非代码**：

- 开发环境与生产环境不做区分，"能跑就行"式部署；
- 没有统一的发布清单（检查敏感文件、清理开发遗留物）；
- 服务器默认配置开放目录浏览 / 未拒绝隐藏文件访问。

## Mitigation

从开发到部署的完整防御链：

1. **前端**：不下发敏感信息，接口鉴权在后端完成；
2. **发布流程**：构建脚本/CI 中检查并清理 `*.bak`、`*.swp`、`.git`、`.svn` 等敏感文件；
3. **服务器**：Nginx/Apache 显式拒绝 `/.git`、`/.svn`、备份后缀、隐藏文件请求；
4. **验证**：上线前用 dirsearch 等工具自查一遍，确认无敏感文件暴露。

## Lessons Learned

- 遇到"看起来没有输入点"的题目，先做信息收集：看源码、扫目录、试常见文件；
- 信息泄露往往是**后续漏洞利用的跳板**（拿到源码 → 审计出注入/逻辑漏洞）；
- 工具链：`dirsearch`/`ffuf`（枚举）、`git-dumper`/`githack`（版本控制恢复）；
- 防御视角：漏洞的本质是流程问题，好的部署流程能消灭一类问题。

## References

- [CTFshow 平台](https://ctf.show/)
- [git-dumper](https://github.com/arthaud/git-dumper) — .git 泄露利用工具
- [HackTricks - .git 泄露利用](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/git)
- [OWASP Top 10 - A05 Security Misconfiguration](https://owasp.org/www-project-top-ten/)

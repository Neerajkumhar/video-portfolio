# 性能与验收自检报告

日期：2026-11-23
范围：VISUARK 静态视频作品集前端（React + Vite + Tailwind）

## 构建与校验

| 命令 | 结果 |
| --- | --- |
| `npm run build` | 通过，Vite 6.4.6，1954 modules，3.62s |
| `npm run validate:assets` | 通过：9 个分类、26 个视频，所有派生与原始路径存在 |
| `node --test scripts/validate-assets.test.mjs` | 5/5 通过 |
| `npm audit` | 0 vulnerabilities |

构建产物：

- `dist/index.html`：0.67 kB（gzip 0.39 kB）
- JS：346.00 kB（gzip 105.19 kB）
- CSS：26.02 kB（gzip 5.87 kB）
- `dist` 总计：约 569.0 MiB / 82 个文件

## 资源处理

- 原始素材共 27 个文件：26 个视频 + 1 个 PNG，约 2.07 GB；原始文件未修改。
- 22 个 `.MOV` 为 HEVC/H.265，浏览器兼容性差；已生成 H.264 + AAC 派生文件。
- 派生文件共 78 个：26 个完整视频、26 个预览视频、26 张海报图，约 568.4 MiB。
- `recent-work-04` 的完整派生视频已用 H.264 CRF 24 重新压缩至约 13.7 MiB，保持 1080×1920 / 60fps，并避免仓库出现超过 50 MiB 的文件。
- 原始素材不进入 `dist`，部署包仅包含可播放派生文件。
- 校验脚本确认 checksum 前后一致：`ORIGINALS UNCHANGED`。

## 浏览器自检

Chromium（Playwright）24/24 通过：

- 桌面 1440px 与移动 375px 均无横向溢出（0px）。
- Hero 标题、Logo、4 项导航、9 个分类卡、26 个作品卡均正确渲染。
- 三条无限横向片单正常滚动；第 1 条左移、第 2 条右移；悬停后显示 `PAUSED` 并停止。
- 详情播放器可打开、切换上一个/下一个、静音切换、加载真实视频源；Escape 可关闭。
- 分类筛选：`Car Edits` 显示 4 个，点击 `AI Edits` 显示 1 个。
- CTA 弹窗可打开/关闭；移动菜单可展开。
- 无 console error 或 page error。

响应式审计（Playwright，320×800、375×812、414×896、768×1024、1024×768、812×375 横屏）：

- 所有宽度 `document.scrollWidth - innerWidth = 0`，无横向溢出、无越界元素。
- 所有按钮/链接触控目标 ≥ 44×44 CSS px；移动端菜单、详情播放器与联系弹窗控件均通过。
- Hero 内容在窄屏与横屏均无裁切，标题无文本溢出。
- 移动端播放图标常显；描述文案改为 “Tap to preview · Tap to play”。

补充检查：

- `prefers-reduced-motion: reduce`：Lenis 不初始化，横向片单停止并显示 `PAUSED`。
- Firefox 冒烟测试：26 个作品卡与详情弹窗正常，无 JS 错误。

## 性能策略

- 首屏只加载 Hero 视频；列表默认使用海报图，预览视频仅在悬停/聚焦时播放。
- 已移除独立的 Showreel 区块；Hero 的 “Watch Showreel” 直接打开详情播放器。分类卡与 About 视觉块使用轻量悬停预览。
- 全局同时最多 3 个预览视频；`IntersectionObserver` 暂停离屏视频。
- 悬停预览默认静音；首次点击/按键后解锁声音，且同一时间最多一个预览有声。
- 小于 640px 的屏幕禁用横向片单自动预览，只显示海报，节省移动流量与电量。
- 固定导航与弹窗适配 `env(safe-area-inset-*)`，按钮/链接最小触控目标 44px，进度条触控区域 44px。
- 完整视频只在用户打开详情播放器后加载。
- 横向片单使用 `requestAnimationFrame` 驱动 `scrollLeft`，悬停、聚焦、拖拽与触摸时暂停。
- 无限滚动通过复制一组卡片实现，不创建额外 DOM 动画库负担。
- 无外部字体、CDN、API 或第三方媒体依赖。
- 所有动效在 `prefers-reduced-motion` 下降级。

## 已知限制

- Playwright 内置 Firefox 缺少 H.264 解码器，测试环境会输出媒体解码警告；这是测试浏览器构建限制，页面已提供错误降级 UI，正常桌面 Firefox/Chrome/Safari 使用 H.264 派生文件。
- Safari 未在当前环境中实测；派生格式为广泛支持的 H.264 + AAC。
- 用户未提供联系方式、社交媒体地址或团队照片，因此 CTA 使用诚实的“请求联系信息”弹窗与分享/复制动作，未虚构任何信息。

## 结论

构建、资源校验、单元测试、依赖安全审计与浏览器交互自检全部通过。当前 `dist` 可直接静态部署。

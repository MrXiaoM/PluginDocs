---
home: true
heroImage: /img/logo.png
heroText: Plugins
tagline: 人间工作P的插件文档
bannerBg: 'background: transparent' # auto => 网格纹背景(有bodyBgImg时无背景)，默认 | none => 无 | '大图地址' | background: 自定义背景样式       提示：如发现文本颜色不适应你的背景时可以到palette.styl修改$bannerTextColor变量

# 文章列表显示方式: detailed 默认，显示详细版文章列表（包括作者、分类、标签、摘要、分页等）| simple => 显示简约版文章列表（仅标题和日期）| none 不显示文章列表
postList: none
# simplePostListLength: 10 # 简约版文章列表显示的文章数量，默认10。（仅在postList设置为simple时生效）
# hideRightBar: true # 是否隐藏右侧边栏
---

::: cardList 2
```yaml
config:
  target: _self
data:
  - name: 插件文档
    desc: Bukkit插件相关使用文档
    bgColor: '#157BAE'
    textColor: '#ffffff'
    link: /docs/
  - name: 开发文档
    desc: 一些依赖库的开发手册
    bgColor: '#DBA14A'
    textColor: '#ffffff'
    link: /elopers/
```
:::

![](https://box.mcio.dev/github/readme-stats)

## Sweet 系列插件

> 按正式版发布时间排序，插件名后面带有 [外链](https://www.minebbs.com/resources/authors/mrxiaom.24586/) 图标的代表暂无文档。

+ [SweetMail](/docs/mail/intro) 开放式邮件系统
+ [SweetMiao](https://www.minebbs.com/resources/9954/) 把你的玩家聊天变成猫娘格式
+ [SweetItemsLoader](https://www.minebbs.com/resources/10093/) 多服同步 ItemsAdder 字体图片变量
+ [SweetAdaptiveShop](/docs/adaptiveshop/intro) 动态价格收购商店
+ [SweetAfdian](https://www.minebbs.com/resources/10101/) 爱发电充值/购买系统
+ [SweetDrops](/docs/drops/intro) 原版方块自定义随机掉落
+ [SweetRewards](/docs/rewards/intro) 累计点数奖励，不仅仅能用来做累充奖励
+ [SweetMMORPG](https://www.minebbs.com/resources/10299/) 为 MMOItems 提供最基本的法力值(mana)和耐力值(stamina)系统
+ [SweetCheckout](/docs/checkout/intro) 自部署支付系统
+ [SweetMessages](/docs/messages/intro) 使用 MiniMessage 格式发送聊天消息、ActionBar 消息、标题消息
+ [SweetData](https://www.minebbs.com/resources/11605/) 通用玩家/全局数值同步插件
+ [SweetLocks](https://www.minebbs.com/resources/11692/) 为高版本打造的全新经典收费门插件
+ [SweetSoundReplacer](https://www.minebbs.com/resources/12244/) 音效发包替换
+ [SweetMonitor](https://www.minebbs.com/resources/12931/) 定时切换旁观者模式，视奸你的玩家 👁👁👁
+ [SweetAutoResidence](https://www.minebbs.com/resources/12977/) 领地自动圈地道具，帮助不会使用圈地插件的萌新创建领地
+ [SweetFlight](https://www.minebbs.com/resources/12988/) 飞行管理插件，限制每日飞行时间，可额外增加飞行时间
+ [SweetTask](/docs/task/intro) 玩家每日/每周/每月任务插件
+ [SweetPlayerMarket](/docs/playermarket/intro) 全球市场插件
+ [SweetChat](/docs/chat/intro) 聊天格式插件
+ [SweetPlaytime](/docs/playtime/intro) 在线时间记录与在线奖励插件
+ [SweetTimer](/docs/timer/intro) 定时任务插件，定期执行指定操作
+ [SweetInventory](/docs/inventory/intro) 一个菜单插件

## 其它插件

> 将会忽略一些几乎不再更新的早期插件

+ [StaticMap](https://www.minebbs.com/resources/7709/) 跨服地图画插件重制版
+ [DeathMessages](https://www.minebbs.com/resources/8262/) 死亡消息重制版
+ [CraftItem](https://www.minebbs.com/resources/8269/) 锻造物品重制版
+ [MMOi18n](https://www.minebbs.com/resources/9699/) 优雅地汉化你的 MMOItems 物品编辑界面
+ [TimeOperate](https://www.minebbs.com/resources/9883/) (PAPI变量扩展) 时间计算器
+ [GuiTextureSpliter](https://www.minebbs.com/resources/9984/) (GUI程序+PAPI变量扩展) 使用更高分辨率的菜单贴图
+ [BanClickWhenUsingItem](https://www.minebbs.com/resources/10663/) 修复异常网络包状态导致刷三叉戟漏洞
+ [CitizensModels](https://www.minebbs.com/resources/13040/) 为经典 NPC 插件独立添加 ModelEngine 模型支持
+ [VectorDisplays](/elopers/vd/intro) 世界终端用户界面解决方案

![](https://s1.mrxiaom.top/github-snake.svg)

::: details 私有插件

以下插件均为作者本人服务器的部分自有插件，不公开二进制文件，不售卖，纯馋人。

+ SweetRiceShop - 玩家摆摊插件
+ SweetRiceTags - 称号插件
+ SweetRiceToken - 战令插件
+ SweetRiceBind - 装备绑定插件
+ SweetRiceTeam - 副本组队房间控制插件
+ SweetQuests - 剧情与对话系统插件
+ SweetLuckChoose - 幸运轮回抽奖插件
+ SweetItemRoll - 装备洗炼插件
+ SweetJade - 装备镶嵌宝石插件
+ NeoWorld - 杂项功能整合插件
+ NeoGames - 迷失之地搜打撤/清扫者/线性剧情 等游戏玩法框架插件
+ NeoTown - 公会机制插件
:::

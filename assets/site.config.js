/*
网站维护说明（仅供编辑，不在页面展示）

栏目结构：01 稻作故事 / 02 实地考察 / 03 参考文献。
实地考察下设：器物观察 / 器物细读 / 考察安排 / 影像记录。
影像记录已并入实地考察，不再作为顶级栏目。

素材路径：
- assets/frames/frame-0001.webp 至 frame-0264.webp：1920×1080 / 24fps 滚动序列。
- assets/video/hemudu-field-intro.mp4：约40秒多镜头介绍短片，含照片镜头。
- assets/images/：文章插图、概念示意和用户提供的器物照片。
- assets/documents/r5.pdf、r6.pdf：原网页已内嵌的两篇论文。
所有路径相对网页文件，不使用 fetch 或 ES 模块；解压后可直接在浏览器打开。
帧序列来自用户视频 00:07.50—00:18.50，不表示使用整段素材。
后续替换序列需同步更新 frameCount、width、height、fps 与 sourceIn/sourceOut。
新增正式照片与视频时，可调整 assets/site-data.js 中的 gallery 与 video 数据。
考察安排里的日期、观察与访谈尚需根据正式记录更新，不因加入航拍而自动标记完成。
本地上传按钮只作临时预览，刷新后不会保存；正式素材请放入 assets 并更新配置。
器物照片的编号、尺寸、年代和确切器名应对照展签，不据低清照片补写。
动态标题仅去除中文句号，不删除其他标点；正文标点保持原样。
阅读文字在视口高度96%至72%的区间内随滚动淡入并上移22px；向上滚动时沿同一路径淡出。
进入主要阅读区域的文字保持完整显示；减少动态效果偏好、键盘焦点与打印均显示完整内容。

归档的维护提示：
- 概念视觉 / 非出土文物影像
- 文献导读 / 3 幅叙事插图
- 本站器物图为原创简化示意，不代表特定馆藏的精确尺寸、纹样或考古复原。
- 图片由你提供，未附清晰展签的器物不据照片补写编号、年代或确切器名。展厅远景只作环境参考；正文是资料导读，不代表已完成的现场记录。
- 此处为出发前计划。实际日期、观察结果与访谈记录将在考察后补充；场馆开放及拍摄要求以现场确认为准。
- 三幅 Q 版日漫插图为 AI 辅助生成的叙事场景；人物、服饰与建筑均非考古复原。可用左右键切换，Esc 关闭。
- i把依据与想象分开。文物形态以实物、展签和研究为依据；人物、对话与故事冲突属于创作。本站暂不转载受限全文，文献阅读状态见各条说明。
- 仅在当前页面预览，刷新后需重新选择。
*/
/*
本次新增：
- 五张实拍照片位于 assets/park/，分别用于码头、发掘、稻作环境和建筑导读。
- 每篇约300字；照片只支撑可见形态，不能独立定年或确认遗址属性。
- 稻作篇配图是当代田园环境参照；建筑篇配图是现代博物馆馆舍。
- 介绍短片已采用重新上传的 0004_D(1).MP4（第7—13秒）作为田园镜头。
- 本次素材不含对单件展签、柱洞层位或古稻田边界的近距离记录。
- 新增参考文献 r18—r22；readingTargets 维护导读与文献之间的返回路由。
- 滚动衔接动画仍使用原有264帧，与下方介绍短片分别配置。
*/
/*
新增三段压缩素材均已读取并进入成片：
- 202610172035.mp4：发掘展示镜头，原片第2—8秒。
- 202610172035(1).mp4：舟楫码头镜头，原片第1.5—7.5秒。
- 202610172035(2).mp4：博物馆建筑镜头，原片第10—16秒。
对应截图位于 assets/park/，分别标注为 excavation-video、wharf-video、museum-video。
截图说明与资料导读保持同一识别尺度，不将当代馆舍或展示设施直接标为史前原件。
*/
window.HEMUDU_CONFIG={
  "chapters": [
    {
      "id": "story",
      "label": "稻作故事"
    },
    {
      "id": "fieldwork",
      "label": "实地考察"
    },
    {
      "id": "research",
      "label": "参考文献"
    }
  ],
  "fieldSections": [
    {
      "id": "field-objects",
      "label": "器物观察"
    },
    {
      "id": "artifact-reading-title",
      "label": "器物细读"
    },
    {
      "id": "field-plan",
      "label": "考察安排"
    },
    {
      "id": "film",
      "label": "影像记录"
    }
  ],
  "sequence": {
    "directory": "assets/frames",
    "frameCount": 264,
    "width": 1920,
    "height": 1080,
    "sourceIn": 7.5,
    "sourceOut": 18.5,
    "fps": 24
  },
  "media": {
    "video": "assets/video/hemudu-field-intro.mp4",
    "poster": "assets/park/landscape.jpg",
    "caption": "2026.10.17 · 介绍短片 · 约 40 秒",
    "duration": 39.6,
    "editList": [
      {
        "id": "gate",
        "file": "DJI_20261017150820_0002_D(1).MP4",
        "start": 8.5,
        "label": "河姆渡",
        "line": "在水与土地之间",
        "duration": 6,
        "timeline_in": 0.0,
        "timeline_out": 6.0
      },
      {
        "id": "valley",
        "file": "DJI_20261017153855_0009_D.MP4",
        "start": 6,
        "label": "姚江谷地",
        "line": "河流、林地与聚落",
        "duration": 6,
        "timeline_in": 5.6,
        "timeline_out": 11.6
      },
      {
        "id": "wharf",
        "file": "202610172035(1).mp4",
        "start": 1.5,
        "label": "水岸与舟楫",
        "line": "从码头，走进现场",
        "duration": 6,
        "timeline_in": 11.2,
        "timeline_out": 17.2
      },
      {
        "id": "excavation",
        "file": "202610172035.mp4",
        "start": 2,
        "label": "发掘现场展示",
        "line": "从木桩，寻找生活的线索",
        "duration": 6,
        "timeline_in": 16.8,
        "timeline_out": 22.8
      },
      {
        "id": "wetland",
        "file": "DJI_20261017151057_0004_D(1).MP4",
        "start": 7,
        "label": "稻作与土地",
        "line": "水网与田园，延续着生活",
        "duration": 6,
        "timeline_in": 22.4,
        "timeline_out": 28.4
      },
      {
        "id": "architecture",
        "file": "202610172035(2).mp4",
        "start": 10,
        "label": "建筑与居所",
        "line": "木构传统的当代回声",
        "duration": 6,
        "timeline_in": 28.0,
        "timeline_out": 34.0
      },
      {
        "id": "shore",
        "file": "DJI_20261017155235_0025_D.MP4",
        "start": 3,
        "label": "走进河姆渡",
        "line": "让故事，有迹可循",
        "duration": 6,
        "timeline_in": 33.6,
        "timeline_out": 39.6
      }
    ]
  },
  "parkReadings": [
    {
      "id": "park-wharf",
      "label": "河姆渡码头",
      "references": [
        "r18",
        "r22",
        "r4"
      ]
    },
    {
      "id": "park-excavation",
      "label": "考古发掘展示区",
      "references": [
        "r19",
        "r18"
      ]
    },
    {
      "id": "park-rice",
      "label": "稻作与种植展示",
      "references": [
        "r19",
        "r20"
      ]
    },
    {
      "id": "park-houses",
      "label": "干栏式房屋",
      "references": [
        "r4",
        "r21",
        "r19"
      ]
    }
  ],
  "videoStills": [
    {
      "file": "202610172035.mp4",
      "time": 4,
      "output": "excavation-video.jpg",
      "article": "park-excavation",
      "caption": "发掘展示区 · 视频截图"
    },
    {
      "file": "202610172035(1).mp4",
      "time": 3,
      "output": "wharf-video.jpg",
      "article": "park-wharf",
      "caption": "码头近景 · 视频截图"
    },
    {
      "file": "202610172035(2).mp4",
      "time": 12,
      "output": "museum-video.jpg",
      "article": "park-houses",
      "caption": "博物馆屋面 · 视频截图"
    }
  ]
};

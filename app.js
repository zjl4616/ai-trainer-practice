const EXAM_DATE = new Date("2026-08-29T09:00:00+08:00");
const STORAGE_KEY = "ai-trainer-practice-progress-v2";

const MODULES = [
  { id: "business", title: "业务分析", label: "1.1 / 1.2", weight: 25, desc: "从业务目标到数据、方案、指标，写出闭环而不是背场景。", chain: ["目标", "数据", "预处理", "标注", "方案", "指标", "安全"] },
  { id: "data", title: "数据处理与规范制定", label: "2.1.1–2.1.5", weight: 15, desc: "先把数据处理做成肌肉记忆，保证 CSV、HTML、DOCX 都能交付。", chain: ["读", "看", "清", "删", "变", "选", "分", "存"] },
  { id: "model", title: "模型训练与算法测试", label: "2.2.1–2.2.5", weight: 20, desc: "围绕模型、指标、错误案例和改进，形成可解释的测试报告。", chain: ["读", "选", "分", "训", "存", "测", "评", "改"] },
  { id: "monitor", title: "智能系统监控与优化", label: "3.1.1–3.1.5", weight: 15, desc: "统计要有结论，建议要能对应发现，避免空泛的优化话术。", chain: ["统计", "比较", "找异常", "给方案"] },
  { id: "interaction", title: "人机交互流程设计", label: "3.2.1–3.2.5", weight: 20, desc: "把 ONNX 推理跑通，从模型加载一直到结果展示和反馈。", chain: ["模", "标", "图", "预", "推", "解", "显"] },
  { id: "training", title: "培训与指导", label: "4.1.1–4.2.5", weight: 5, desc: "10 分钟补全大纲或指导方案，覆盖目标、步骤、安全和验收。", chain: ["目标", "内容", "演示", "实践", "测验", "反馈"] }
];

const TASKS = [
  { id: "1.1.1", module: "business", title: "患者住院风险等级分析", prompt: "围绕 patient_data.csv，设计从数据读取、风险等级标注到比例分析的业务流程。", context: "场景：医疗康复 / 住院管理。输出要能支持高风险患者识别和后续监控。", triggers: ["业务目标与指标", "DaysInHospital > 7", "RiskLevel 标注", "value_counts", "比例与监控"], answer: "先说清目标和指标，再列数据字段与来源；完成缺失/重复/异常处理；用 DaysInHospital > 7 形成高低风险标签，统计数量和占比；最后补充部署监控、隐私权限和反馈迭代。", source: "原始资料/1.1.1 + patient_data.csv" },
  { id: "1.1.2", module: "business", title: "传感器数据统计与环境分析", prompt: "围绕 sensor_data.csv，设计按传感器类型、位置和时段统计数据的业务流程。", context: "场景：智能环境监测。要把数据统计转成可执行的业务判断。", triggers: ["数据源与字段", "groupby SensorType", "count / mean", "位置与时段", "异常预警"], answer: "目标写成环境状态监测与预警；按 SensorType、位置、时段分组，输出数量、均值和趋势；检查缺失/重复/异常；定义阈值、告警和回流机制，补权限、脱敏和备份。", source: "原始资料/1.1.2 + sensor_data.csv" },
  { id: "1.1.3", module: "business", title: "信用数据完整性与风险流程", prompt: "围绕 credit_data.csv，设计信用数据审核、清洗、标注、分析和风险反馈流程。", context: "场景：金融风控。答案要能解释数据质量如何影响授信决策。", triggers: ["缺失与重复审计", "字段口径", "风险标签", "训练/测试划分", "合规与可解释"], answer: "按目标—数据源—数据字典—缺失/重复/异常—风险标签—模型验证—部署监控写。明确标签口径和时间窗口，防止数据泄漏；补充脱敏、权限、审计和申诉反馈。", source: "原始资料/1.1.3 + credit_data.csv" },
  { id: "1.1.4", module: "business", title: "用户行为数据采集与偏好分析", prompt: "围绕 user_behavior_data.csv，写出用户行为采集、清洗、分析、推荐和持续监控方案。", context: "场景：智能产品使用行为。避免只写‘收集数据并建模’。", triggers: ["行为事件定义", "时间/用户维度", "缺失与异常", "偏好特征", "反馈闭环"], answer: "先定义事件、用户和时间粒度；校验字段、去重、缺失、类型和异常；构造频次/时段/偏好特征；用分析结果驱动推荐或功能优化，并用点击率、响应时间、投诉率监控迭代。", source: "原始资料/1.1.4 + user_behavior_data.csv" },
  { id: "1.1.5", module: "business", title: "车辆交通数据与效率分析", prompt: "围绕 vehicle_traffic_data.csv，设计车辆交通数据的采集、预处理、分析和调度优化流程。", context: "场景：智慧交通。要落到路线、调度或拥堵决策。", triggers: ["车辆/道路/时段", "缺失与异常", "速度/流量特征", "预测或分流", "效果指标"], answer: "从拥堵/调度目标开始，定义车辆、道路、时间字段；清理缺失、重复、异常和类型；形成速度、流量、峰值等特征；输出预测/分流方案，并以平均延误、通行速度、预测误差监控。", source: "原始资料/1.1.5 + vehicle_traffic_data.csv" },
  { id: "1.2.1", module: "business", title: "智能零售情感识别模块优化", prompt: "针对情感识别准确性不高、响应速度慢等问题，给出问题—影响—原因—方案—指标闭环。", context: "场景：零售评价分析。至少覆盖数据、模型、性能、交互、监控中的相关方向。", triggers: ["准确率", "响应时间", "样本均衡", "缓存/批处理", "人工复核"], answer: "先拆问题及业务影响，再找数据标注噪声、类别不均衡、模型复杂度或服务瓶颈；通过补标/重采样、模型调参、缓存与异步、结果解释和人工抽检改进；用 F1、P95 延迟、误判率和满意度验收。", source: "参考答案/1.2.1" },
  { id: "1.2.2", module: "business", title: "老年健康监测模块优化", prompt: "针对心率数据准确性不高、异常预警响应慢，设计可落地的优化方案。", context: "场景：老年人健康监测。重点是风险等级和告警时效。", triggers: ["传感器校准", "运动噪声过滤", "实时检测", "多级告警", "误报/漏报"], answer: "问题先对应风险：误诊与延误。方案包括传感器校准、运动噪声过滤、老年人群校正、流式检测、多级告警和人工确认；用准确率/召回率、告警延迟、误报率和处置完成率验收。", source: "参考答案/1.2.2" },
  { id: "1.2.3", module: "business", title: "金融数据分析模块优化", prompt: "针对金融数据准确性、预警响应和界面复杂等问题，写出闭环优化方案。", context: "场景：金融分析平台。要兼顾决策速度、合规和用户可理解性。", triggers: ["数据校验", "实时预警", "信息分层", "可解释", "合规审计"], answer: "把数据准确性、告警时效和界面复杂分别对应数据质量、流式架构和交互层。落地数据字典/校验、实时规则与模型、多级卡片式界面和解释说明；用错误率、P95 告警延迟、任务完成率和投诉率验收。", source: "参考答案/1.2.3" },
  { id: "1.2.4", module: "business", title: "智能卖点生成模块优化", prompt: "针对卖点生成不准确、缺乏个性化和响应速度慢，写出优化方案与量化指标。", context: "场景：商品/服务营销内容生成。不能只写‘换更大的模型’。", triggers: ["事实约束", "品牌画像", "检索增强", "缓存与队列", "人工审核"], answer: "用商品事实库和规则约束减少幻觉，用品牌/受众画像做个性化，用检索增强和模板提高可控性；对高风险内容加人工审核；用事实一致率、采纳率、生成延迟和修改次数验收。", source: "参考答案/1.2.4" },
  { id: "1.2.5", module: "business", title: "数智人交互模块优化", prompt: "针对数智人回答不准确、缺乏个性化、响应慢，写出从原因到指标的完整优化闭环。", context: "场景：对话式数智人。优先保证安全、可解释和可回退。", triggers: ["意图识别", "知识库检索", "会话记忆", "流式响应", "转人工"], answer: "先拆意图识别、知识覆盖、会话上下文和服务吞吐问题；采用知识库检索与引用、用户偏好记忆、流式输出和缓存；低置信度时澄清或转人工；用命中率、满意度、首字节延迟和转人工率验收。", source: "参考答案/1.2.5" },

  { id: "2.1.1", module: "data", title: "汽车燃油效率数据清洗与标注", prompt: "补全 2.1.1：处理 auto-mpg.csv，完成 horsepower 类型转换、缺失处理、标准化、特征选择、目标标注和交付文件。", context: "考场交付：2.1.1_cleaned_data.csv、2.1.1.docx、2.1.1.html。", triggers: ["read_csv", "head / dtypes / isnull", "to_numeric(errors='coerce')", "dropna / drop_duplicates", "StandardScaler", "X/y + 8/2", "index=False"], answer: "记忆链：读 → 看 → 清 → 删 → 变 → 选 → 分 → 存。目标 mpg；特征为 cylinders、displacement、horsepower、weight、acceleration、model year、origin；处理 horsepower 异常后标准化，按 8/2 划分并保存无额外索引的 CSV。", source: "本地资料/2.1.1 + auto-mpg.csv" },
  { id: "2.1.2", module: "data", title: "低碳生活行为数据处理", prompt: "处理大学生低碳生活行为数据，完成缺失、重复、标准化、特征/目标划分和清洗规范。", context: "考场交付：记录处理前后行数、最终 CSV 无额外索引列。", triggers: ["read_excel", "缺失前后行数", "重复行数", "标准化", "目标列", "保存 CSV"], answer: "先读看结构，再记录缺失处理前后行数；删除缺失和重复并记录删除数；只对数值特征做标准化；明确特征、目标和数据来源口径；保存为题目要求的文件名并复核行列数。", source: "本地资料/2.1.2 + 大学生低碳生活行为数据集.xlsx" },
  { id: "2.1.3", module: "data", title: "金融违约数据异常值处理", prompt: "处理金融数据：用箱线图/IQR 检测异常、删除重复、归一化、创建 IncomeToDebtRatio 与 MonthlyIncome，并标注 SeriousDlqin2yrs。", context: "这是最容易漏步骤的一题，先写触发词再动手。", triggers: ["箱线图", "Q1/Q3/IQR", "clip 或过滤异常", "IncomeToDebtRatio", "MonthlyIncome", "SeriousDlqin2yrs", "8/2"], answer: "记忆：读金融数据 → 箱线图看异常 → IQR 处理 → 删重复 → MinMax 归一化 → 建两个特征 → SeriousDlqin2yrs 做 y → 划分 → 保存。报告里要写异常处理规则和删除行数。", source: "本地资料/2.1.3 + finance数据集.csv" },
  { id: "2.1.4", module: "data", title: "医疗数据日期特征与规范", prompt: "处理 medical_data.csv：删除缺失/重复，构造诊断延迟和病程，去除不合理值，对年龄/体重/身高归一化并保存。", context: "日期差要先转 datetime，负数和明显不合理年龄属于业务异常。", triggers: ["to_datetime", "诊断日期 - 就诊日期", "当前日期 - 诊断日期", "负数/年龄异常", "归一化", "数据来源"], answer: "先记录行数和缺失，转日期后构造诊断延迟、病程；过滤负值与明显错误年龄；去重并记录数量；只对年龄、体重、身高归一化；最后写清数据来源、字段含义、范围和保存路径。", source: "本地资料/2.1.4 + medical_data.csv" },
  { id: "2.1.5", module: "data", title: "健身调查数据清洗与归一化", prompt: "处理 fitness analysis.csv：检查结构/空值，删除缺失和重复，把 Your age 转整数并处理异常，对健身水平字段归一化。", context: "题目同时考类型转换、去重、类别/数值字段的处理和规范书写。", triggers: ["read_csv", "Your age", "to_numeric", "dropna", "drop_duplicates", "fitness level", "index=False"], answer: "读看清删：先看列名和空值；Your age 转数值后处理异常；删除缺失和重复并记录数量；按题目要求对健身水平字段编码/归一化；明确特征、目标、来源和结果文件。", source: "本地资料/2.1.5 + fitness analysis.csv" },

  { id: "2.2.1", module: "model", title: "信用风险 Logistic 分类测试", prompt: "用 finance 数据训练 LogisticRegression，输出分类指标，分析类别不平衡并保存模型和测试报告。", context: "分类报告必须能读懂 precision、recall、F1，不只打印一张表。", triggers: ["LogisticRegression", "train_test_split", "classification_report", "precision / recall / F1", "类别不平衡", "pickle 保存"], answer: "记忆链：读 → 选 → 分 → 训 → 存 → 测 → 评 → 改。先明确正类和业务代价，输出 accuracy、precision、recall、F1；检查不平衡，使用 class_weight/重采样等改进并比较重训结果。", source: "本地资料/2.2.1 + finance数据集.csv" },
  { id: "2.2.2", module: "model", title: "燃油效率线性回归测试", prompt: "用 auto-mpg.csv 完成 LinearRegression，输出训练/测试得分，分析过拟合、特征和异常值问题并提出改进。", context: "训练分数约 0.826、测试分数约 0.790，重点是解释差异。", triggers: ["LinearRegression", "训练/测试得分", "过拟合", "异常值", "多重共线性", "改进后重训"], answer: "先选 X/y 并划分，再训练线性回归；报告 train_score 与 test_score 的差距；从异常值、非线性、特征选择和共线性分析原因；可做标准化、正则化、特征工程或换模型，最后比较改进前后。", source: "本地资料/2.2.2 + auto-mpg.csv" },
  { id: "2.2.3", module: "model", title: "随机森林回归与错误分析", prompt: "用健身数据训练 RandomForestRegressor，输出 MSE、R² 与训练/测试表现，判断欠拟合或过拟合并改进。", context: "测试 R² 为负时，要解释它比用均值预测还差，而不是只写‘模型效果不好’。", triggers: ["RandomForestRegressor", "MSE / MAE / R²", "训练-测试差距", "负 R²", "特征相关性", "参数调优"], answer: "报告训练/测试得分、MSE、MAE、R²；若 R² 为负，说明泛化表现差于基线，检查目标/特征、异常值、样本量和参数；用特征筛选、调参、交叉验证或基线对比重训。", source: "本地资料/2.2.3 + fitness analysis.csv" },
  { id: "2.2.4", module: "model", title: "低碳行为线性回归测试", prompt: "对低碳生活数据建立回归模型，输出 MSE/R²，分析弱相关特征、异常值、样本代表性并提出改进。", context: "R² 较低时，结论要和数据诊断对应。", triggers: ["LinearRegression", "MSE", "R²", "弱相关特征", "异常值", "样本代表性"], answer: "先做目标与特征核对、编码和缺失处理；输出 MSE/R²；结合相关性和残差判断弱特征、异常值、样本量或配置问题；用特征工程、稳健处理、交叉验证或替代模型复测。", source: "本地资料/2.2.4 + 大学生低碳生活行为数据集.xlsx" },
  { id: "2.2.5", module: "model", title: "健身数据回归模型比较", prompt: "在健身数据上完成回归测试，输出 MSE、MAE、R²，解释负 R²、异常值和模型复杂度问题。", context: "重点是形成‘指标—错误—改进—复测’闭环。", triggers: ["MSE / MAE / R²", "负 R²", "特征相关性", "异常值", "模型复杂度", "重训对比"], answer: "先保证目标列与特征正确、处理异常和尺度；同时报告 MSE、MAE、R²；负 R² 表示泛化差，检查弱相关特征、异常值、过拟合/欠拟合；调整特征和模型复杂度后重训并比较。", source: "本地资料/2.2.5 + fitness analysis.csv" },

  { id: "3.1.1", module: "monitor", title: "智能音箱用户习惯监控", prompt: "分析智能音箱功能调用数据，找出最常用、较少使用的功能并提出监控和优化建议。", context: "数据发现必须包含计数/频率，建议要回应使用差异。", triggers: ["功能调用计数", "使用频率", "最常用/最少用", "时段分组", "留存与反馈"], answer: "统计各功能调用次数和占比，识别调整音量、查新闻、查天气等高频功能及低频功能；按用户/时段观察差异；对低频功能做入口、意图识别和提示优化，用调用率、成功率、留存监控。", source: "本地资料/3.1.1 + 智能音箱数据集.xlsx" },
  { id: "3.1.2", module: "monitor", title: "智能照明环境偏好分析", prompt: "按时段分析光线亮度与色温，找出环境偏好和可落地的自动控制优化。", context: "报告要写均值/趋势，并让控制策略对应数据。", triggers: ["时段均值", "亮度", "色温", "峰值/异常", "自动调光", "舒适度指标"], answer: "按 06–12、12–18、18–24 等时段统计亮度和色温均值、波动和异常；根据偏好设置自动调光/色温预设；用舒适度反馈、手动覆盖率和能耗验证。", source: "本地资料/3.1.2 + 智能照明系统数据集.xlsx" },
  { id: "3.1.3", module: "monitor", title: "智能健康手环活动监控", prompt: "分析步数与健康指标关注度，识别高活动时段和需要提醒的时段，提出优化方案。", context: "不能把 0 步时段当作普通平均值。", triggers: ["时段分组", "剔除 0 步", "平均步数", "高峰时段", "个性化提醒"], answer: "按时段统计平均步数，剔除 0 步无活动时段后比较早晚高峰；结合关注度找重点指标；设置个性化活动提醒和异常监控，用达标率、提醒响应和活跃天数验收。", source: "本地资料/3.1.3 + 智能健康手环数据集.xlsx" },
  { id: "3.1.4", module: "monitor", title: "健康监测高风险时段", prompt: "分析血压、血糖、体脂随时间的变化趋势，识别高风险与安全时间段并给出优化方案。", context: "要把血压 06–08、血糖 07–09 等结论写成监控规则。", triggers: ["趋势与均值", "06–08 血压", "07–09 血糖", "高风险时段", "分级告警", "数据稀疏"], answer: "按时间窗口比较血压、血糖、体脂趋势；标记早晨血压和早餐后血糖风险，同时说明体脂数据稀疏的不确定性；配置阈值、分级告警和复测，用告警及时率、误报率和干预完成率验收。", source: "本地资料/3.1.4 + 智能健康监测系统数据集.xlsx" },
  { id: "3.1.5", module: "monitor", title: "智能家居环境控制优化", prompt: "按时段分析温度、湿度、光照偏好，提出智能家居环境控制的优化策略。", context: "方案要同时考虑舒适度、能耗和用户手动覆盖。", triggers: ["温湿度/光照均值", "时段比较", "舒适区间", "联动控制", "能耗监控"], answer: "先统计各时段均值、范围和异常，再定义舒适区间；将照明、空调、加湿等做联动和预设；增加精细能耗监控与手动覆盖反馈；用舒适度评分、能耗、告警率和覆盖率验收。", source: "本地资料/3.1.5 + 智能家居环境控制系统数据集.xlsx" },

  { id: "3.2.1", module: "interaction", title: "ResNet 图像分类交互", prompt: "设计使用 resnet.onnx、labels.txt、img_test.jpg 完成图像分类的人机交互流程。", context: "交互流程要从上传图片一直写到概率展示和用户反馈。", triggers: ["加载模型", "加载标签", "上传图片", "resize/normalize", "session.run", "argmax/概率", "结果与反馈"], answer: "固定 7 步：加载模型 → 加载标签 → 加载输入 → 预处理 → 推理 → 后处理/解码 → 展示结果与反馈。写清输入尺寸、通道/归一化、Top-1 概率和失败提示。", source: "本地资料/3.2.1 + resnet.onnx" },
  { id: "3.2.2", module: "interaction", title: "MNIST 手写数字识别", prompt: "使用 mnist.onnx 和 img_test.png 设计手写数字识别流程，并输出识别数字。", context: "重点检查灰度、尺寸、批次维度与输出解码。", triggers: ["mnist.onnx", "灰度图", "尺寸匹配", "batch/channel", "argmax", "数字结果"], answer: "加载模型和图片，转灰度并 resize 到模型要求，归一化、补 batch/channel 维度，session.run 后 argmax 得到数字；界面显示原图、数字、置信度和重试入口。", source: "本地资料/3.2.2 + mnist.onnx" },
  { id: "3.2.3", module: "interaction", title: "表情识别交互", prompt: "使用 emotion-ferplus.onnx 和标签映射完成表情识别的人机交互设计。", context: "要说明人脸输入、预处理、情感标签映射与不确定性反馈。", triggers: ["emotion-ferplus.onnx", "标签映射", "人脸图像", "预处理", "argmax", "置信度/提示"], answer: "加载模型与情感标签，读取并预处理 img_test.png，运行推理后将索引映射成情感标签；展示标签与概率，低置信度时提示‘结果仅供参考’，并提供重新上传。", source: "本地资料/3.2.3 + emotion-ferplus.onnx" },
  { id: "3.2.4", module: "interaction", title: "花朵识别交互", prompt: "使用 flower-detection.onnx、labels.txt、flower_test.png，完成花朵类型和准确率展示。", context: "输出要包含预测类别、准确率和异常输入处理。", triggers: ["flower-detection.onnx", "labels.txt", "图像预处理", "预测类型", "准确率", "失败提示"], answer: "模型/标签/图片依次加载，按输入尺寸预处理并推理，解析类别索引和概率；界面展示预测类型、准确率、原图和重新识别入口，记录低置信度结果。", source: "本地资料/3.2.4 + flower-detection.onnx" },
  { id: "3.2.5", module: "interaction", title: "人脸检测批处理交互", prompt: "使用 version-RFB-320.onnx、voc-model-labels.txt 处理 imgs 文件夹的所有图片并保存检测结果。", context: "这是批处理题，文件输出、框绘制和总人数统计都要写。", triggers: ["version-RFB-320.onnx", "voc-model-labels.txt", "遍历 imgs", "检测框", "保存结果目录", "总人脸数"], answer: "加载模型和标签，遍历 imgs 中图片并预处理，逐张推理和解码，绘制检测框后保存到 ./detect_imgs_results_onnx；最后统计并输出所有图片的人脸总数，异常图片单独记录。", source: "本地资料/3.2.5 + version-RFB-320.onnx" },

  { id: "4.1.1", module: "training", title: "康复训练数据标注培训", prompt: "补全培训大纲中的学习目标，围绕康复训练场景完成目标—内容—演示—实践—测验。", context: "10 分钟作答，目标要和内容、实践动作一一对应。", triggers: ["目标可检查", "数据标注概念", "标注工具演示", "练习与项目", "理论/实操测验"], answer: "按引言、基础理论、工具演示、分组实践、综合项目、答疑、理论测试、实操测试组织；学习目标用‘理解/掌握/能独立完成’描述，确保可验收。", source: "参考答案/4.1.1" },
  { id: "4.1.2", module: "training", title: "金融网页爬虫培训", prompt: "补全网页爬虫培训大纲，覆盖概念、流程、robots.txt、实践、合规与测试。", context: "安全合规是得分点，不要只写代码。", triggers: ["爬虫概念", "请求与解析", "robots.txt", "限速/重试", "隐私与合规", "项目验收"], answer: "目标包括理解爬虫流程、会用工具抓取公开数据、遵守 robots.txt 和网站条款；安排演示、分步练习、金融报告综合项目、答疑和理论/实操测试。", source: "参考答案/4.1.2" },
  { id: "4.1.3", module: "training", title: "康复数据清洗培训", prompt: "补全数据清洗培训目标与教学活动，确保学员能独立处理康复数据。", context: "目标要包含数据质量判断和实际保存交付。", triggers: ["清洗概念", "缺失/重复/异常", "Pandas 操作", "康复数据实践", "结果验收"], answer: "从清洗概念和任务开始，演示 Pandas 读取、缺失/重复/异常处理与保存；学员用康复数据完成练习和综合项目，最后做理论测试、实操测试和反馈。", source: "参考答案/4.1.3" },
  { id: "4.1.4", module: "training", title: "Pandas 数据清洗实训", prompt: "补全 Pandas 数据清洗课程的学习目标，覆盖安装、读取、清洗、保存和综合练习。", context: "要把‘会用 Pandas’拆成可观察动作。", triggers: ["读取/保存 CSV Excel", "head/dtypes", "缺失/重复", "类型转换", "标准化", "综合练习"], answer: "目标写成能安装并导入 Pandas、读取/检查不同格式数据、完成缺失/重复/类型/异常处理、保存结果并解释行数变化；配套演示、分步练习和实操验收。", source: "参考答案/4.1.4" },
  { id: "4.1.5", module: "training", title: "Matplotlib 数据可视化培训", prompt: "补全数据可视化培训目标与教学流程，覆盖图表选择、绘制、解读和实践。", context: "目标不只写‘了解可视化’，还要能独立做图并解释。", triggers: ["图表类型", "Matplotlib 配置", "绘图演示", "图表解读", "综合项目", "实操测验"], answer: "目标包括理解可视化目的、会选择条形/折线/散点/饼图、能用 Matplotlib 绘制和标注并从图表得出结论；安排演示、练习、项目、答疑和测验。", source: "参考答案/4.1.5" },
  { id: "4.2.1", module: "training", title: "智能零售数据采集指导", prompt: "写出智能零售系统的数据源、采集方法、清洗标注、安全存储和监控反馈指导方案。", context: "要覆盖 POS、会员、库存、反馈和外部数据，并写出采集方式。", triggers: ["POS/会员/库存", "API/数据库", "去重缺失异常", "标签口径", "脱敏权限", "备份与监控"], answer: "按数据源确定 → API/数据库/文件采集 → 清洗与标注 → 脱敏、权限、备份 → 分析应用 → 监控反馈写。每一步说明责任人、频率、质量检查和异常回退。", source: "参考答案/4.2.1" },
  { id: "4.2.2", module: "training", title: "医疗影像数据采集与处理指导", prompt: "为 AI 医疗影像诊断系统制定采集、标注、脱敏、清洗、训练验证和测试优化指导方案。", context: "医疗隐私、医生标注和模型验证是关键得分点。", triggers: ["高质量影像", "医生标注病灶", "脱敏与合规", "缺失/重复/异常", "训练验证", "测试优化"], answer: "覆盖影像与患者信息采集、医生标注、脱敏；清洗去重/缺失/异常；划分训练验证测试并选模型；测试性能和误差后迭代，保存审计记录、权限和备份。", source: "参考答案/4.2.2" },
  { id: "4.2.3", module: "training", title: "AI 安防监控采集与处理指导", prompt: "为安防监控系统制定视频采集、预处理、行为检测、存储和隐私保护指导方案。", context: "多角度无死角、低光适应、安全存储和隐私保护不可漏。", triggers: ["高清摄像头", "多角度无死角", "夜视/低光", "去噪压缩", "检测跟踪", "存储与隐私"], answer: "写清多角度覆盖、夜视、稳定传输和安全存储；视频去噪/压缩后做目标检测、跟踪、异常触发；无关人员模糊化，设权限、保留周期、告警回溯和应急流程。", source: "参考答案/4.2.3" },
  { id: "4.2.4", module: "training", title: "自动驾驶感知数据采集与标注", prompt: "制定多传感器融合、场景覆盖、事件触发、质量控制、加密传输和标注规范。", context: "要明确 2D/3D 框、语义分割、遮挡规则和复核。", triggers: ["摄像头/雷达/激光雷达", "天气时段覆盖", "事件触发", "质量检查", "加密传输", "标注标准/复核"], answer: "采集端覆盖道路、天气、时段和关键事件；检查传感器状态、完整性、准确性并加密传输；制定类别、框精度、遮挡规则和工具规范，双人复核、抽检和版本留痕。", source: "参考答案/4.2.4" },
  { id: "4.2.5", module: "training", title: "文化遗产数据标注指导", prompt: "为文化遗产数字化保护制定图像、三维模型和属性标签的标注指导方案。", context: "要区分图像标注、三维标注和元数据管理。", triggers: ["LabelImg", "边界框/多边形", "MeshLab/Blender", "材料/年代/作者", "CSV/JSON", "质量复核"], answer: "图像用 LabelImg 等做框/多边形/分割；三维模型用 MeshLab/Blender 做顶点、面、体素标注；材料、风格、年代、作者、位置等元数据用 CSV/JSON 关联；制定命名、版本、复核、备份和版权权限规则。", source: "参考答案/4.2.5" }
];

const PLAN = [
  ["08/17", "2.1 数据处理", "2.1.3 + 口述读看清删变选分存"],
  ["08/18", "2.2 算法测试", "分类与回归各做一题，写指标解释"],
  ["08/19", "3.2 人机交互", "模标图预推解显，跑通一题"],
  ["08/20", "3.1 系统监控", "数据发现 → 对应方案"],
  ["08/21", "必考70分模拟", "2.1 + 2.2 + 3.1 + 3.2，80分钟"],
  ["08/22", "1.1 业务流程", "五个场景只练固定骨架"],
  ["08/23", "1.2 效果优化", "问题—原因—方案—指标"],
  ["08/24", "4.1 / 4.2", "10分钟补全培训或指导"],
  ["08/25", "完整模拟 1", "120分钟，记录三件事"],
  ["08/26", "完整模拟 2", "优先修复文件交付错误"],
  ["08/27", "完整模拟 3", "目标连续两套 75+"],
  ["08/28", "轻量回忆", "四条动作链 + 错题卡 + 环境检查"],
  ["08/29", "考试执行", "先必考，边做边保存并核对文件"]
];

const GUIDE_TITLES = {
  "1.1.1": "智能医疗系统中的业务数据处理流程设计",
  "1.1.2": "智能农业系统中的业务数据采集和处理流程设计",
  "1.1.3": "金融机构信用评估系统中的业务数据审核流程设计",
  "1.1.4": "电商平台用户行为分析系统的数据采集与处理流程设计",
  "1.1.5": "智能交通系统的数据采集、处理和审核流程设计",
  "1.2.1": "顾客评价情感识别业务模块效果优化",
  "1.2.2": "老年人健康监测与管理服务业务模块效果优化",
  "1.2.3": "智慧金融服务业务模块效果优化",
  "1.2.4": "智能卖点生成系统业务模块效果优化",
  "1.2.5": "腾讯云智能数智人系统业务模块效果优化",
  "2.1.1": "智慧交通中燃油效率模型的数据清洗和标注流程设计",
  "2.1.2": "低碳生活行为影响因素数据清洗和标注流程设计",
  "2.1.3": "信用评分模型数据清洗和标注流程设计",
  "2.1.4": "医疗研究数据清洗和标注设计",
  "2.1.5": "健康与营养咨询数据预处理与数据规范设计",
  "2.2.1": "智能信用评分 Logistic 回归模型开发与测试",
  "2.2.2": "智慧交通中燃油效率随机森林模型开发与测试",
  "2.2.3": "日常运动量随机森林预测模型开发与测试",
  "2.2.4": "低碳生活行为影响因素预测线性回归模型开发与测试",
  "2.2.5": "智能步数预测模型开发与测试",
  "3.1.1": "智能音箱产品的数据分析与优化",
  "3.1.2": "智能照明系统的数据分析与优化",
  "3.1.3": "智能健康手环的数据分析与优化",
  "3.1.4": "智能健康监测系统的数据分析与优化",
  "3.1.5": "智能家居环境控制系统的数据分析与优化",
  "3.2.1": "图像识别评估系统交互流程设计",
  "3.2.2": "手写数字识别系统交互流程设计",
  "3.2.3": "面部表情识别系统交互流程设计",
  "3.2.4": "花朵智能识别系统交互流程设计",
  "3.2.5": "人脸 AI 智能检测系统交互流程设计",
  "4.1.1": "Label studio 培训大纲编写",
  "4.1.2": "爬虫培训大纲编写",
  "4.1.3": "数据清洗培训大纲编写",
  "4.1.4": "Pandas 数据清洗培训大纲编写",
  "4.1.5": "Python 数据可视化培训大纲编写",
  "4.2.1": "智能零售分析系统数据采集和处理指导",
  "4.2.2": "AI 辅助的医疗影像诊断系统数据采集和处理指导",
  "4.2.3": "AI 智能安防监控系统采集和处理指导",
  "4.2.4": "自动驾驶汽车感知系统数据采集与标注指导",
  "4.2.5": "智能化数据标注在文化遗产数字化保护中的应用指导"
};

// These are the five-point answer slots in the supplied 4.1/4.2 materials.
// The exam accepts equivalent wording, so matching ignores spacing and punctuation.
const FILL_BLANKS = {
  "4.1.1": [
    { clue: "数据标注基础理论 · 学习目标", answer: "理解数据标注的概念及其在不同类型数据中的应用和重要性" },
    { clue: "Label Studio 简介与安装 · 学习目标", answer: "掌握 Label Studio 的安装配置方法及其基本操作和应用场景" },
    { clue: "文本数据标注 · 学习目标", answer: "学会使用 Label Studio 进行文本数据标注方法" },
    { clue: "图像数据标注 · 学习目标", answer: "掌握使用 Label Studio 对图像进行标注方法和技巧" },
    { clue: "综合项目实践 · 学习目标", answer: "综合运用所学知识进行数据标注项目" }
  ],
  "4.1.2": [
    { clue: "引言 · 学习目标", answer: "了解网页爬虫的重要性和应用场景" },
    { clue: "网页爬虫基础理论 · 学习目标", answer: "理解网页爬虫的概念、工作流程及基本结构，并学会遵守 robots.txt 协议" },
    { clue: "常用网页爬虫工具简介 · 学习目标", answer: "熟悉常用网页爬虫工具的基本功能及其适用场景" },
    { clue: "网页数据解析 · 学习目标", answer: "学会使用网页数据解析的方法与技术" },
    { clue: "动态网页处理 · 学习目标", answer: "掌握处理动态网页的方法" }
  ],
  "4.1.3": [
    { clue: "引言 · 学习目标", answer: "掌握数据清洗的方法和技术并理解在康复数据中的作用" },
    { clue: "数据清洗基础理论 · 学习目标", answer: "理解数据清洗的基本概念和任务" },
    { clue: "常用数据清洗工具简介 · 学习目标", answer: "认识 Pandas、NumPy、OpenRefine 和 Dask 等工具" },
    { clue: "环境搭建与工具安装 · 学习目标", answer: "掌握 Python 及常用数据清洗工具的安装配置" },
    { clue: "Pandas 实战 · 学习目标", answer: "会使用 Pandas 进行数据导入、筛选和转换" }
  ],
  "4.1.4": [
    { clue: "数据清洗基础理论 · 学习目标", answer: "掌握数据清洗的基本概念和流程" },
    { clue: "Pandas 简介与安装 · 学习目标", answer: "学会使用 Pandas 读取和保存不同格式的数据" },
    { clue: "数据筛选与过滤 · 学习目标", answer: "掌握基于条件筛选、去重及处理缺失值的方法" },
    { clue: "数据转换 · 学习目标", answer: "学会进行数据类型转换、时间序列处理及数据列的分割与合并" },
    { clue: "数据合并与重塑 · 学习目标", answer: "掌握数据合并及重塑的方法" }
  ],
  "4.1.5": [
    { clue: "数据可视化基础理论 · 学习目标", answer: "理解数据可视化的概念、目的及其优势，并了解常见的数据可视化类型" },
    { clue: "Matplotlib 简介与安装 · 学习目标", answer: "了解 Matplotlib 的基本功能及其应用场景，并掌握其安装和配置方法" },
    { clue: "Matplotlib 基本绘图 · 学习目标", answer: "学会使用 Matplotlib 创建简单图表并进行定制化设置" },
    { clue: "Plotly 简介与安装 · 学习目标", answer: "熟悉 Plotly 的功能及其应用场景，并能正确安装和配置该库" },
    { clue: "Plotly 交互式绘图 · 学习目标", answer: "掌握使用 Plotly 创建交互式图表的方法及其交互功能的应用" }
  ],
  "4.2.1": [
    { clue: "顾客信息：会员卡使用数据，包括 ______ 。", answer: "会员基本信息、消费记录和积分兑换" },
    { clue: "数据预处理 · 清洗： ______ 。", answer: "去除重复、错误或无关的数据项" },
    { clue: "数据预处理 · 标准化： ______ 。", answer: "统一数据格式，例如日期和时间的表示方式" },
    { clue: "数据分析与应用 · 建模： ______ 。", answer: "使用机器学习算法预测销售趋势、顾客偏好和库存需求" },
    { clue: "最终达到 ______ 的目标。", answer: "提升业务效率和顾客满意度" }
  ],
  "4.2.2": [
    { clue: "数据采集方案： ______：邀请经验丰富的医生对影像进行标注。", answer: "医学影像数据标注" },
    { clue: "数据清洗与预处理： ______ 。", answer: "去除重复值、填补缺失值、删除异常值" },
    { clue: "模型训练与验证： ______ 。", answer: "选择合适的深度学习模型，并验证其性能" },
    { clue: "模型测试与优化： ______ 。", answer: "使用测试机进行测试并优化" },
    { clue: "提高 ______ 。", answer: "模型诊断的泛化能力" }
  ],
  "4.2.3": [
    { clue: "多角度覆盖：确保 ______ 无死角。", answer: "监控区域" },
    { clue: "建立安全的 ______ ，保存原始视频和分析结果。", answer: "存储系统" },
    { clue: "视频流预处理： ______ 。", answer: "对视频流进行去噪，视频压缩" },
    { clue: "行为分析与异常检测： ______ 。", answer: ["用深度学习算法对视频中的目标进行检测、跟踪和行为预测，一旦有异常，立即记录并触发响应", "用深度学习算法对视频中的目标进行检测、跟踪和行为预测，一旦有异常，立即记录并出发响应"] },
    { clue: "提升 ______ 。", answer: "异常行为识别的准确率和速度" }
  ],
  "4.2.4": [
    { clue: "多传感器融合： ______ 。", answer: ["集成摄像头、雷达、激光雷达等不同传感器的数据，实现信息互补", "集成摄像头、雷达、激光雷达等不同传感器的数据，实现知识互补"] },
    { clue: "场景覆盖： ______ 。", answer: "采集涵盖城市道路、高速公路、乡村道路等不同道路的数据，覆盖白天、夜晚、雨雪天、黎明、黄昏等天气和时段，增强在各场景下的适应能力" },
    { clue: "数据质量控制： ______ 。", answer: "及时检查传感器的工作状态和数据的完整性、准确性" },
    { clue: "标注方案： ______：对标注员进行专业培训。", answer: "标注人员培训" },
    { clue: "形成 ______ 数据集。", answer: "标注完整的高质量" }
  ],
  "4.2.5": [
    { clue: "图像标注：使用 ______ 等标注工具。", answer: ["LabelImg", "Labellmg"] },
    { clue: "训练 ______ 的模型，如 Mask R-CNN、U-Net 等。", answer: "能表示文化遗产数字化模型特征" },
    { clue: "组建 ______ 团队。", answer: "跨学科协作" },
    { clue: "使用 ______ 存储和传输数据。", answer: "加密技术" },
    { clue: "利用 ______ 技术，为用户提供沉浸式文化遗产体验。", answer: "虚拟现实和增强现实" }
  ]
};

function codeBlank(clue, answer) {
  return { clue: `资料代码 / 交付空 · ${clue}`, answer, generated: true, match: "contains" };
}

const CODE_FILL_BLANKS = {
  "1.1.1": [
    codeBlank("读取数据集", ["pd.read_csv('patient_data.csv')", "patient_data.csv"]),
    codeBlank("创建 RiskLevel", ["np.where", "DaysInHospital"]),
    codeBlank("住院天数阈值", ["DaysInHospital > 7", "> 7"]),
    codeBlank("风险人数统计", "value_counts"),
    codeBlank("高风险患者占比", "high_risk_ratio"),
    codeBlank("低风险患者占比", "low_risk_ratio"),
    codeBlank("BMI 区间边界", "bmi_bins"),
    codeBlank("BMI 标签", "bmi_labels"),
    codeBlank("BMI 分箱", "pd.cut"),
    codeBlank("BMI 高风险比例", "bmi_risk_rate"),
    codeBlank("BMI 患者数量", "bmi_patient_count"),
    codeBlank("年龄区间边界", "age_bins"),
    codeBlank("年龄分箱", "AgeRange"),
    codeBlank("年龄高风险比例", "age_risk_rate"),
    codeBlank("年龄患者数量", "age_patient_count")
  ],
  "1.1.2": [
    codeBlank("读取 sensor_data.csv", ["pd.read_csv('sensor_data.csv')", "sensor_data.csv"]),
    codeBlank("传感器类型分组统计", "groupby('SensorType')"),
    codeBlank("数量和平均值聚合", "agg(['count', 'mean'])"),
    codeBlank("筛选温度和湿度", "isin(['Temperature', 'Humidity'])"),
    codeBlank("按位置和传感器类型求均值", "groupby(['Location', 'SensorType'])"),
    codeBlank("标记异常值", "is_abnormal"),
    codeBlank("温度异常范围", ["Value < -10", "Value > 50"]),
    codeBlank("湿度异常范围", ["Value < 0", "Value > 100"]),
    codeBlank("统计异常数量", "is_abnormal'].sum"),
    codeBlank("前向填充", "fillna(method='ffill'"),
    codeBlank("后向填充", "fillna(method='bfill'"),
    codeBlank("删除异常标记列", "drop(columns=['is_abnormal'])"),
    codeBlank("保存清洗文件", "cleaned_sensor_data.csv")
  ],
  "1.1.3": [
    codeBlank("读取 credit_data.csv", ["pd.read_csv('credit_data.csv')", "credit_data.csv"]),
    codeBlank("缺失值统计", "isnull().sum"),
    codeBlank("重复值统计", "duplicated().sum"),
    codeBlank("年龄合理性", "Age'].between(18, 70"),
    codeBlank("收入合理性", "Income'] > 2000"),
    codeBlank("贷款金额合理性", "LoanAmount'] <"),
    codeBlank("信用分合理性", "CreditScore'].between(300, 850"),
    codeBlank("合并合理性标记", "all(axis=1)"),
    codeBlank("写入 is_valid", "data['is_valid']"),
    codeBlank("删除不合理行", "data[data['is_valid']]"),
    codeBlank("删除审核标记列", "is_age_valid"),
    codeBlank("保存 cleaned_credit_data.csv", "cleaned_credit_data.csv")
  ],
  "1.1.4": [
    codeBlank("读取 user_behavior_data.csv", ["read_csv", "user_behavior_data.csv"]),
    codeBlank("显示前五行", "data.head()"),
    codeBlank("删除缺失值", "data.dropna()"),
    codeBlank("Age 转整数", "Age'].astype(int"),
    codeBlank("PurchaseAmount 转浮点", "PurchaseAmount'].astype(float"),
    codeBlank("ReviewScore 转整数", "ReviewScore'].astype(int"),
    codeBlank("过滤业务异常", "Age'].between(18, 70"),
    codeBlank("购买金额标准化", "PurchaseAmount'].mean"),
    codeBlank("评价分标准化", "ReviewScore'].mean"),
    codeBlank("保存清洗文件", "cleaned_user_behavior_data.csv"),
    codeBlank("购买类别统计", "PurchaseCategory'].value_counts"),
    codeBlank("性别平均购买金额", "groupby('Gender')['PurchaseAmount']"),
    codeBlank("年龄区间分箱", "AgeGroup"),
    codeBlank("年龄人数统计", "AgeGroup'].value_counts")
  ],
  "1.1.5": [
    codeBlank("读取 vehicle_traffic_data.csv", ["pd.read_csv('vehicle_traffic_data.csv')", "vehicle_traffic_data.csv"]),
    codeBlank("显示前五行", "data.head()"),
    codeBlank("删除缺失值", "data.dropna()"),
    codeBlank("Age / Speed / TravelDistance / TravelTime 类型转换", "astype"),
    codeBlank("过滤年龄、速度、距离和时间异常", "between(18, 70)"),
    codeBlank("保存清洗文件", "cleaned_vehicle_traffic_data.csv"),
    codeBlank("审核不合理数据", "unreasonable_data"),
    codeBlank("交通事件统计", "TrafficEvent'].value_counts"),
    codeBlank("按性别统计速度距离时间", "groupby('Gender').agg"),
    codeBlank("年龄区间分箱", "AgeGroup"),
    codeBlank("年龄人数统计", "AgeGroup'].value_counts")
  ],
  "2.1.1": [
    codeBlank("读取 auto-mpg.csv", ["pd.read_csv('auto-mpg.csv')", "auto-mpg.csv"]),
    codeBlank("检查数据结构", ["head()", "dtypes", "isnull"]),
    codeBlank("horsepower 转为数值", ["to_numeric", "errors='coerce'"]),
    codeBlank("删除缺失和重复行", ["dropna", "drop_duplicates"]),
    codeBlank("标准化数值特征", "StandardScaler"),
    codeBlank("选择 mpg 的 7 个特征", ["cylinders", "displacement", "horsepower", "weight", "acceleration", "model year", "origin"]),
    codeBlank("设置目标变量", "data['mpg']"),
    codeBlank("按 8:2 划分训练集和测试集", ["train_test_split", "test_size=0.2"]),
    codeBlank("保存清洗结果", "2.1.1_cleaned_data.csv"),
    codeBlank("保存时不写入索引", "index=False")
  ],
  "2.1.2": [
    codeBlank("读取低碳生活 Excel 数据", ["pd.read_excel", "大学生低碳生活行为的影响因素数据集"]),
    codeBlank("查看前五行", "head()"),
    codeBlank("记录缺失处理前后行数", ["len(data)", "before"]),
    codeBlank("删除缺失行", "dropna"),
    codeBlank("删除重复行", "drop_duplicates"),
    codeBlank("对数值特征标准化", "StandardScaler"),
    codeBlank("设置低碳行为目标列", "低碳行为积极性"),
    codeBlank("选择题目要求的 8 个特征", "selected_features"),
    codeBlank("按 8:2 划分数据", ["train_test_split", "test_size=0.2"]),
    codeBlank("合并特征和目标并保存", ["pd.concat", "2.1.2_cleaned_data.csv"]),
    codeBlank("保存时不写入索引", "index=False")
  ],
  "2.1.3": [
    codeBlank("读取 finance 数据集", ["pd.read_csv", "finance数据集.csv"]),
    codeBlank("用箱线图查看数值列异常", ["boxplot", "figsize=(12, 8)"]),
    codeBlank("计算 Q1、Q3 和 IQR", ["Q1", "Q3", "IQR"]),
    codeBlank("按 1.5 倍 IQR 过滤异常值", "1.5 * IQR"),
    codeBlank("删除重复记录", ["duplicates.sum()", "data_cleaned[~duplicates]"]),
    codeBlank("对数值列做 Min-Max 归一化", "MinMaxScaler"),
    codeBlank("创建债务收入比特征", "IncomeToDebtRatio"),
    codeBlank("创建月收入特征", "MonthlyIncome"),
    codeBlank("设置违约目标变量", "SeriousDlqin2yrs"),
    codeBlank("按 8:2 划分训练集和测试集", ["train_test_split", "test_size=0.2"]),
    codeBlank("保存清洗结果", "2.1.3_cleaned_data.csv")
  ],
  "2.1.4": [
    codeBlank("读取 medical_data.csv", ["pd.read_csv", "medical_data.csv", "encoding='gbk'"]),
    codeBlank("把就诊日期和诊断日期转成日期", "to_datetime"),
    codeBlank("统一患者 ID 列名", ["病人 ID", "患者 ID", "rename"]),
    codeBlank("计算诊断延迟", ["诊断延迟", ".dt.days"]),
    codeBlank("计算病程", ["病程", "当前日期", ".dt.days"]),
    codeBlank("过滤负诊断延迟和异常年龄", ["诊断延迟 >= 0", "年龄 > 0", "年龄 < 120"]),
    codeBlank("统计并删除重复值", ["duplicated", "drop_duplicates"]),
    codeBlank("对年龄、体重、身高归一化", "MinMaxScaler"),
    codeBlank("按疾病类型画治疗结果堆叠柱状图", ["groupby", "stacked=True"]),
    codeBlank("绘制年龄与疾病严重程度散点图", "scatter"),
    codeBlank("保存清洗结果", "2.1.4_cleaned_data.csv")
  ],
  "2.1.5": [
    codeBlank("读取健康咨询客户 CSV", ["pd.read_csv", "fitness analysis.csv"]),
    codeBlank("检查结构和缺失值", ["info()", "isnull"]),
    codeBlank("把 Your age 转为数值", ["pd.to_numeric", "errors='coerce'"]),
    codeBlank("处理年龄异常并转整数", ["Your age", "astype(int)"]),
    codeBlank("删除缺失行", "dropna"),
    codeBlank("删除重复行", "drop_duplicates"),
    codeBlank("编码健身水平", ["LabelEncoder", "current level of fitness"]),
    codeBlank("统计健身频率", ["How often do you exercise?", "value_counts"]),
    codeBlank("绘制健身频率饼图", "plot.pie"),
    codeBlank("按 8:2 划分数据", ["train_test_split", "test_size=0.2"]),
    codeBlank("保存清洗结果", "2.1.5_cleaned_data.csv")
  ],
  "2.2.1": [
    codeBlank("建立 LogisticRegression 模型", "LogisticRegression"),
    codeBlank("读取 Finance 数据并设置特征/目标", ["SeriousDlqin2yrs", "Unnamed: 0"]),
    codeBlank("按 8:2 划分数据", ["train_test_split", "test_size=0.2"]),
    codeBlank("训练模型", ".fit("),
    codeBlank("保存初始模型", "2.2.1_model.pkl"),
    codeBlank("生成测试集预测", "predict"),
    codeBlank("生成分类报告", "classification_report"),
    codeBlank("保存结果和报告文件", ["2.2.1_results.txt", "2.2.1_report.txt"]),
    codeBlank("用 SMOTE 处理类别不平衡", ["SMOTE", "fit_resample"]),
    codeBlank("保存重采样结果", "2.2.1_results_xg.txt")
  ],
  "2.2.2": [
    codeBlank("读取并清理 auto-mpg.csv", ["pd.read_csv", "horsepower", "to_numeric"]),
    codeBlank("设置 7 个输入特征和 mpg 目标", ["cylinders", "displacement", "mpg"]),
    codeBlank("按 8:2 划分数据", ["train_test_split", "test_size=0.2"]),
    codeBlank("建立标准化线性回归 Pipeline", ["Pipeline", "StandardScaler", "LinearRegression"]),
    codeBlank("训练并保存线性模型", [".fit(", "2.2.2_model.pkl"]),
    codeBlank("保存预测结果和训练/测试得分", ["2.2.2_results.txt", "2.2.2_report.txt"]),
    codeBlank("建立随机森林回归模型", ["RandomForestRegressor", "n_estimators=100"]),
    codeBlank("用随机森林重新训练和预测", ["rf_model.fit", "rf_model.predict"]),
    codeBlank("保存随机森林结果", "2.2.2_results_rf.txt")
  ],
  "2.2.3": [
    codeBlank("读取并清理 fitness analysis.csv", ["pd.read_csv", "fitness analysis.csv", "strip"]),
    codeBlank("对三个问卷特征做独热编码", ["get_dummies", "Your gender"]),
    codeBlank("从 Your age 提取整数年龄", ["Your age", "split(' ')", "int("]),
    codeBlank("按 8:2 划分数据", ["train_test_split", "test_size=0.2"]),
    codeBlank("训练 RandomForestRegressor", ["RandomForestRegressor", "n_estimators=100"]),
    codeBlank("保存随机森林模型和预测结果", ["2.2.3_model.pkl", "2.2.3_results.txt"]),
    codeBlank("写入 MSE 和 R² 报告", ["mean_squared_error", "r2_score", "2.2.3_report.txt"]),
    codeBlank("训练 XGBRegressor 进行改进", "XGBRegressor"),
    codeBlank("保存 XGBoost 结果和报告", ["2.2.3_results_xgb.txt", "xgb_model"])
  ],
  "2.2.4": [
    codeBlank("读取低碳生活 Excel 数据", ["pd.read_excel", "低碳生活"]),
    codeBlank("删除无关列并独热编码", ["序号", "所用时间", "get_dummies"]),
    codeBlank("设置绿色低碳生活目标列", "您进行过绿色低碳的相关生活方式吗"),
    codeBlank("定义 X 和 y 并按 8:2 划分", ["X =", "y =", "test_size=0.2"]),
    codeBlank("训练 LinearRegression", "LinearRegression"),
    codeBlank("保存线性模型、预测结果和报告", ["joblib.dump", "2.2.4_model.pkl", "2.2.4_report.txt"]),
    codeBlank("输出 MSE 和 R²", ["mean_squared_error", "r2_score"]),
    codeBlank("建立 XGBRegressor 改进模型", ["XGBRegressor", "n_estimators=1000", "max_depth=5"]),
    codeBlank("保存 XGBoost 结果和报告", ["2.2.4_results_xg.txt", "2.2.4_report_xgb.txt"])
  ],
  "2.2.5": [
    codeBlank("读取 fitness analysis.csv", ["pd.read_csv", "fitness analysis.csv"]),
    codeBlank("对三个问卷特征独热编码", ["get_dummies", "Your gender"]),
    codeBlank("设置 daily_steps 为目标", "daily_steps"),
    codeBlank("按 8:2 划分数据", ["train_test_split", "test_size=0.2"]),
    codeBlank("训练 DecisionTreeRegressor", ["DecisionTreeRegressor", "random_state=42"]),
    codeBlank("保存模型", "2.2.5_model.pkl"),
    codeBlank("生成预测并保存结果", ["predict", "2.2.5_results.txt"]),
    codeBlank("写入 MSE、MAE、R² 报告", ["mean_squared_error", "mean_absolute_error", "r2_score", "2.2.5_report.txt"])
  ],
  "3.2.1": [
    codeBlank("加载 resnet ONNX 模型", ["ort.InferenceSession", "resnet.onnx"]),
    codeBlank("加载 labels.txt 类别标签", ["labels.txt", "readlines"]),
    codeBlank("加载 RGB 测试图片", ["Image.open", "img_test.jpg", "convert('RGB')"]),
    codeBlank("调用图像预处理函数", "preprocess_image"),
    codeBlank("保证输入为 float32", "astype(np.float32)"),
    codeBlank("执行 ONNX 推理", "session.run"),
    codeBlank("用 softmax 得到概率", "scipy.special.softmax"),
    codeBlank("取概率最高的 Top-5 索引", "np.argsort"),
    codeBlank("读取 Top-5 概率", "top5_prob"),
    codeBlank("用标签显示 Top-5 结果", "labels[top5_idx]")
  ],
  "3.2.2": [
    codeBlank("加载 mnist.onnx", ["onnxruntime.InferenceSession", "mnist.onnx"]),
    codeBlank("加载并转灰度图片", ["Image.open", "img_test.png", "convert('L')"]),
    codeBlank("调整到 28×28", "resize((28, 28))"),
    codeBlank("转成 float32 NumPy 数组", ["np.array", "dtype=np.float32"]),
    codeBlank("添加 batch 维度", "expand_dims(image_array, axis=0)"),
    codeBlank("添加 channel 维度", "expand_dims(image_array, axis=0)"),
    codeBlank("构造 ONNX 输入字典", "ort_session.get_inputs()[0].name"),
    codeBlank("执行预测", "ort_session.run(None, ort_inputs)"),
    codeBlank("取最大概率类别", "np.argmax(ort_outs[0])")
  ],
  "3.2.3": [
    codeBlank("设置模型输入形状", "(1, 1, 64, 64)"),
    codeBlank("灰度化并缩放图片", ["convert('L')", "resize((64, 64))"]),
    codeBlank("添加 batch 和 channel 维度", ["expand_dims", "axis=1"]),
    codeBlank("建立情绪标签映射", "emotion_table"),
    codeBlank("加载 emotion-ferplus.onnx", ["InferenceSession", "emotion-ferplus.onnx"]),
    codeBlank("预处理 img_test.png", "preprocess('img_test.png')"),
    codeBlank("运行模型", "ort_session.run(None, ort_inputs)"),
    codeBlank("取得最高概率标签", "np.argmax(ort_outs[0])"),
    codeBlank("把数字标签解码为情绪名称", "list(emotion_table.keys())")
  ],
  "3.2.4": [
    codeBlank("加载 flower-detection.onnx", ["InferenceSession", "flower-detection.onnx"]),
    codeBlank("加载 labels.txt", ["open('labels.txt')", "readlines"]),
    codeBlank("加载 flower_test.png", ["Image.open", "flower_test.png", "convert('RGB')"]),
    codeBlank("预处理花朵图片", "preprocess_image"),
    codeBlank("执行模型推理", "session.run"),
    codeBlank("计算分类概率", "scipy.special.softmax"),
    codeBlank("取得预测类别索引", "np.argmax(accuracy[0])"),
    codeBlank("换算成百分比准确率", "* 100"),
    codeBlank("根据索引取得类别标签", "labels[predicted_idx]")
  ],
  "3.2.5": [
    codeBlank("读取 voc-model-labels.txt 标签", ["class_names", "voc-model-labels.txt"]),
    codeBlank("加载 version-RFB-320.onnx", ["ort.InferenceSession", "version-RFB-320.onnx"]),
    codeBlank("取得模型输入名称", "get_inputs()[0].name"),
    codeBlank("设置检测结果目录", "./detect_imgs_results_onnx"),
    codeBlank("不存在时创建结果目录", ["os.path.exists", "os.makedirs"]),
    codeBlank("读取 imgs 文件夹图片", ["os.listdir", "path = \"imgs\""]),
    codeBlank("用 OpenCV 读取图片", "cv2.imread"),
    codeBlank("调整为 320×240 并预处理", ["cv2.resize(image, (320, 240))", "np.transpose", "np.expand_dims"]),
    codeBlank("执行 ONNX 人脸检测", "ort_session.run(None, {input_name: image})"),
    codeBlank("后处理检测框", "predict"),
    codeBlank("画框并保存结果图片", ["cv2.rectangle", "cv2.imwrite"]),
    codeBlank("累计并输出检测总数", ["sum += boxes.shape[0]", "sum:"])
  ]
};
Object.assign(FILL_BLANKS, CODE_FILL_BLANKS);

const SOURCE_DATA = (typeof window !== "undefined" && window.SOURCE_BLANKS) || {};
const TASK_ASSETS = (typeof window !== "undefined" && window.TASK_ASSETS) || {};
const SOURCE_ANSWER_NOTES = (typeof window !== "undefined" && window.SOURCE_ANSWER_NOTES) || {};

const ACTION_CARDS = [
  ["2.1 数据处理", "读 → 看 → 清 → 删 → 变 → 选 → 分 → 存", "看到缺失、重复、标准化、目标列、测试集 20% 就触发。"],
  ["2.2 算法测试", "读 → 选 → 分 → 训 → 存 → 测 → 评 → 改", "指标后面必须跟错误原因和重训动作。"],
  ["3.1 系统监控", "统计 → 比较 → 找异常/瓶颈 → 给方案", "没有数据发现，就不要急着写优化建议。"],
  ["3.2 ONNX 推理", "模 → 标 → 图 → 预 → 推 → 解 → 显", "模型、标签、输入、预处理、结果展示缺一不可。"]
];

let progress = loadProgress();
let currentRoute = "dashboard";
let currentFilter = "all";
let currentTaskIndex = 0;
let activeSessionTasks = [...TASKS];
let practiceMode = "fill";
let timerId = null;
let remainingSeconds = 20 * 60;
let guideSections = {};
let guideError = "";
let pyodidePromise = null;
let pythonRunId = 0;
const pythonMountedFiles = new Map();
const PYODIDE_VERSION = "0.26.2";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYTHON_CODE_KEY = "ai-trainer-python-code-v1";
const PYTHON_RUN_KEY = "ai-trainer-python-runs-v1";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
function taskState(id) { return progress[id] || { attempts: 0, hard: 0, okay: 0, mastered: 0, last: null, error: "" }; }
function reviewedCount() { return Object.values(progress).filter((x) => x.attempts > 0).length; }
function hardCount() { return Object.values(progress).filter((x) => x.hard > 0 && x.mastered < x.hard).length; }
function moduleTasks(id) { return TASKS.filter((task) => task.module === id); }
function moduleProgress(id) {
  const tasks = moduleTasks(id);
  if (!tasks.length) return 0;
  return Math.round(tasks.reduce((sum, task) => sum + Math.min(1, taskState(task.id).mastered / 2), 0) / tasks.length * 100);
}
function daysLeft() {
  return Math.max(0, Math.ceil((EXAM_DATE.getTime() - Date.now()) / 86400000));
}
function formatDate(date) { return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }); }
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function normalizeAnswer(value) {
  return String(value || "").toLowerCase().replace(/[\s\u3000，。；：、,.!?！？（）()「」『』“”"‘’'：;!！?？_·]/g, "");
}
function answerMatches(input, expected) {
  const value = normalizeAnswer(input);
  if (!value) return false;
  const accepted = Array.isArray(expected) ? expected : [expected];
  return accepted.some((answer) => value === normalizeAnswer(answer));
}
function blankMatches(input, blank) {
  const acceptedAnswers = [blank?.answer, ...(blank?.accepted || [])].filter(Boolean);
  if (blank?.match === "contains") {
    const value = normalizeAnswer(input);
    if (!value) return false;
    return acceptedAnswers.some((answer) => value.includes(normalizeAnswer(answer)));
  }
  return answerMatches(input, acceptedAnswers);
}
function hasFillMode(task) { return Boolean(sourceBlocks(task)); }
function fillTaskCount() { return TASKS.filter((task) => hasFillMode(task)).length; }
function sourceBlocks(task) { return SOURCE_DATA[task?.id]?.blocks || null; }
function fillBlanks(task) {
  const source = sourceBlocks(task);
  if (source) {
    return source.flatMap((block) => block.answers.map((answer, slot) => ({
      answer,
      accepted: block.accepted?.[slot] || [],
      clue: block.text,
      source: true,
      cell: Boolean(block.cell)
    })));
  }
  return [];
}
function sourceAnswerNote(task) { return SOURCE_ANSWER_NOTES[task?.id] || null; }
function extraChecks(task) { return sourceAnswerNote(task)?.checks || []; }
function renderSourceNote(task) {
  const note = sourceAnswerNote(task);
  if (!note) return "";
  const label = note.level === "missing" ? "补充要求" : note.level === "conflict" ? "资料冲突" : note.level === "ocr" ? "原资料校正" : "交付提醒";
  return `<div class="source-note source-note-${escapeHtml(note.level || "info")}"><strong>资料核验 · ${label}：${escapeHtml(note.title)}</strong><span>${escapeHtml(note.body)}</span></div>`;
}
function renderSupplementChecks(task) {
  const checks = extraChecks(task);
  if (!checks.length) return "";
  return `<section class="supplement-checks"><div class="supplement-head"><strong>题面补充检查 · 不计入原题空位数</strong><span>必须完成，但参考 Notebook 没有留下对应下划线</span></div>${checks.map((check, index) => `<label class="supplement-row"><span>${index + 1}. ${escapeHtml(check.clue)}</span><input class="supplement-input" data-extra-input="${index}" placeholder="填写特征名或代码" autocomplete="off" /></label>`).join("")}</section>`;
}
function renderExactReference(task) {
  const source = sourceBlocks(task);
  const section = guideSections[task.id];
  if (!source && !section) return "";
  const sourceMarkup = source ? `<div class="exact-reference-label">按原题空位回填后的代码/答题卷；练习与批改以此核对版和下载的原始素材为准，下面的指南全文仅用于追溯原文。</div><div class="exact-reference-content">${source.map((block) => {
    let line = escapeHtml(block.text);
    block.answers.forEach((answer, slot) => {
      const value = Array.isArray(answer) ? answer[0] : answer;
      line = line.replace(`{{${slot}}}`, `<mark>${escapeHtml(value)}</mark>`);
    });
    return `<div class="exact-reference-line">${line || "&nbsp;"}</div>`;
  }).join("")}</div>` : "";
  const guideMarkup = section?.reference ? `<details class="guide-reference-inner"><summary>备考指南参考答案全文</summary><pre>${escapeHtml(section.reference)}</pre></details>` : "";
  return `<details class="exact-reference"><summary>展开核对版完整参考答案（以素材库为准）</summary>${sourceMarkup}${guideMarkup}</details>`;
}
function compactGuideTitle(value) { return String(value).replace(/\s+/g, "").trim(); }
function cleanGuideBlock(value) {
  const watermark = /^[复制止禁校学训培业职顿普尼海上]$/;
  return String(value).replace(/\r/g, "").replace(/\f/g, "\n").split("\n").map((rawLine) => {
    const line = rawLine.replace(/人\s*工\s*智\s*能\s*训\s*练\s*师.*?试\s*题\s*(单|评分表)/g, "").replace(/人\s*工\s*智\s*能\s*训\s*练\s*师.*?操\s*作\s*技\s*能\s*考\s*核/g, "").replace(/(^|\s)([复制止禁校学训培业职顿普尼海上])(?=\s|$|[（(0-9A-Za-z])/g, "$1").replace(/\s+/g, " ").trim();
    if (!line || watermark.test(line) || /^\d+\s*\/\s*116$/.test(line)) return "";
    if (/^人工智能训练师.*操作技能复习题$/.test(line)) return "";
    if (/试题评分表/.test(line) || /人工智能训练师.*试题单/.test(line)) return "";
    if (/^试题单$/.test(line)) return "";
    if (/^(准考证号|试题代码)：?$/.test(line)) return "";
    return line;
  }).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
function parseGuideText(rawText) {
  const titleMatches = [...String(rawText).matchAll(/试题名称：\s*([^\n]+)/g)];
  const parsed = {};
  let cursor = 0;
  for (const task of TASKS) {
    const expected = compactGuideTitle(GUIDE_TITLES[task.id]);
    const firstIndex = titleMatches.findIndex((match, index) => index >= cursor && compactGuideTitle(match[1]) === expected);
    if (firstIndex < 0 || !titleMatches[firstIndex + 1]) continue;
    const secondIndex = firstIndex + 1;
    const firstStart = titleMatches[firstIndex].index;
    const secondStart = titleMatches[secondIndex].index;
    const nextStart = titleMatches[secondIndex + 1]?.index ?? rawText.length;
    const firstBlock = rawText.slice(firstStart, secondStart);
    const markerMatch = firstBlock.match(/请勿修改答题卷|在下划线上填写答案/);
    const scoreHeaderIndex = firstBlock.search(/试题评分表/);
    const questionEnd = markerMatch && scoreHeaderIndex >= 0 ? Math.min(markerMatch.index, scoreHeaderIndex) : (markerMatch ? markerMatch.index : (scoreHeaderIndex >= 0 ? scoreHeaderIndex : firstBlock.length));
    const questionBlock = firstBlock.slice(0, questionEnd);
    let referenceBlock;
    if (markerMatch) {
      referenceBlock = firstBlock.slice(markerMatch.index);
    } else {
      const afterScore = rawText.slice(secondStart, nextStart);
      const answerStart = afterScore.search(/In \[\d+\]|请勿修改答题卷|在下划线上填写答案/);
      referenceBlock = answerStart >= 0 ? afterScore.slice(answerStart) : afterScore;
    }
    parsed[task.id] = {
      title: GUIDE_TITLES[task.id],
      question: cleanGuideBlock(questionBlock),
      reference: cleanGuideBlock(referenceBlock)
    };
    cursor = secondIndex + 1;
  }
  return parsed;
}
function renderGuideDetails(task) {
  if (guideError) return `<div class="guide-loading">备考指南原文暂时无法读取：${escapeHtml(guideError)}</div>`;
  const section = guideSections[task.id];
  if (!section) return `<div class="guide-loading">正在读取备考指南原题全文……</div>`;
  return `<details class="source-details"><summary>查看备考指南原题全文（含空格、文件名和评分要求）</summary><div class="source-content">${escapeHtml(section.question)}</div></details><details class="source-details reference"><summary>查看备考指南参考答案原文</summary><div class="source-content">${escapeHtml(section.reference)}</div></details>`;
}

function assetKindLabel(kind) {
  return ({ csv: "CSV", xlsx: "XLSX", notebook: "IPYNB", docx: "DOCX", image: "图片", model: "ONNX", text: "TXT", archive: "ZIP" }[kind] || "文件");
}
function assetFileName(asset) { return asset.name.split("/").pop(); }
function renderTaskAssets(task) {
  const assets = TASK_ASSETS[task.id] || [];
  if (!assets.length) return "";
  const rows = assets.map((asset, index) => {
    const preview = asset.kind === "csv" ? `<button class="asset-preview-button" data-preview-csv="${escapeHtml(asset.href)}" data-preview-id="asset-preview-${task.id}-${index}">预览表格</button>` : "";
    const external = asset.external ? ` target="_blank" rel="noreferrer"` : "";
    const download = asset.external ? "" : " download";
    const note = asset.size ? `<small>${escapeHtml(asset.size)}</small>` : "";
    return `<div class="asset-row"><span class="asset-kind">${assetKindLabel(asset.kind)}</span><div class="asset-copy"><strong>${escapeHtml(asset.label || assetFileName(asset))}</strong><small>${escapeHtml(assetFileName(asset))}</small>${note}</div><div class="asset-actions"><a class="asset-link" href="${escapeHtml(asset.href)}"${external}${download}>下载 <span aria-hidden="true">↧</span></a>${preview}</div><div class="csv-preview" id="asset-preview-${task.id}-${index}" hidden></div></div>`;
  }).join("");
  return `<section class="asset-panel"><div class="asset-panel-head"><div><span class="eyebrow">题目资料</span><h3>先下载或打开原始文件再操作</h3></div><span class="asset-count">${assets.length} 个文件</span></div><p class="asset-panel-note">CSV 可在页面内快速预览；XLSX、DOCX、IPYNB、图片和 ONNX 下载后用本地工具处理，文件名保持与素材库一致。</p><div class="asset-list">${rows}</div></section>`;
}
function pythonAssetCandidates(assets) {
  return assets.filter((asset) => asset.local && ["csv", "xlsx", "text", "image", "archive"].includes(asset.kind));
}
function pythonCodeMap() {
  try { return JSON.parse(localStorage.getItem(PYTHON_CODE_KEY)) || {}; } catch { return {}; }
}
function pythonCodeFor(task, assets) {
  const saved = pythonCodeMap()[task.id];
  if (typeof saved === "string") return saved;
  const dataAsset = assets.find((asset) => ["csv", "xlsx"].includes(asset.kind));
  const lines = [
    "# " + task.id + " · " + task.title,
    "# 先点击“加载本题数据”，再运行下面的代码。",
    "import pandas as pd"
  ];
  if (dataAsset) {
    const filename = JSON.stringify(dataAsset.name);
    const encoding = task.id === "2.1.4" && dataAsset.kind === "csv" ? ', encoding="gbk"' : "";
    lines.push(
      dataAsset.kind === "xlsx" ? "data = pd.read_excel(" + filename + ")" : "data = pd.read_csv(" + filename + encoding + ")",
      "print(data.head())",
      "print(data.shape)"
    );
  } else {
    lines.push("print('Python 已连接，可以开始写本题代码。')");
  }
  return lines.join("\n");
}
function savePythonCode(taskId, code) {
  const stored = pythonCodeMap();
  stored[taskId] = code;
  localStorage.setItem(PYTHON_CODE_KEY, JSON.stringify(stored));
}
function pythonRunMap() {
  try { return JSON.parse(localStorage.getItem(PYTHON_RUN_KEY)) || {}; } catch { return {}; }
}
function savePythonRun(taskId, status, output) {
  const stored = pythonRunMap();
  stored[taskId] = { status, output: String(output || "").slice(-12000), updatedAt: new Date().toISOString() };
  localStorage.setItem(PYTHON_RUN_KEY, JSON.stringify(stored));
}
function pythonRunFor(taskId) {
  const run = pythonRunMap()[taskId];
  return run && typeof run.output === "string" ? run : null;
}
function renderPythonLab(task, assets) {
  if (!assets.some((asset) => ["notebook", "csv", "xlsx"].includes(asset.kind))) return "";
  const candidates = pythonAssetCandidates(assets);
  const taskId = escapeHtml(task.id);
  const code = escapeHtml(pythonCodeFor(task, assets));
  const candidateNames = candidates.length ? candidates.map((asset) => escapeHtml(assetFileName(asset))).join("、") : "无，可直接上传文件";
  const lastRun = pythonRunFor(task.id);
  const lastOutput = escapeHtml(lastRun?.output || "点击“运行 Python”开始检查。");
  const lastStatus = lastRun ? (lastRun.status === "success" ? "上次运行完成" : "上次运行失败") : "尚未运行";
  return '<section class="python-lab" data-python-task="' + taskId + '">' +
    '<div class="python-lab-head"><div><span class="eyebrow">Python 实操</span><h3>边运行，边检查结果</h3></div><span class="python-runtime-badge">浏览器本地</span></div>' +
    '<p class="python-lab-note">首次运行会加载 Python 运行时；数据不上传。把代码输出和生成文件当作本题的检查记录。</p>' +
    '<div class="python-toolbar">' +
      '<button class="python-button primary" type="button" data-python-run="' + taskId + '">运行 Python <span aria-hidden="true">▶</span></button>' +
      '<button class="python-button" type="button" data-python-load="' + taskId + '">加载本题数据</button>' +
      '<label class="python-file-button">上传文件<input type="file" multiple data-python-upload="' + taskId + '" accept=".csv,.xlsx,.xls,.txt,.json,.ipynb,.jpg,.jpeg,.png,.zip" /></label>' +
      '<button class="python-button ghost" type="button" data-python-clear="' + taskId + '">清空输出</button>' +
      '<button class="python-button ghost" type="button" data-python-reset="' + taskId + '">恢复模板</button>' +
    '</div>' +
    '<div class="python-mounted" id="python-mounted-' + taskId + '">本题可挂载素材：' + candidateNames + '</div>' +
    '<textarea class="python-editor" data-python-editor="' + taskId + '" spellcheck="false" autocapitalize="off" autocomplete="off">' + code + '</textarea>' +
    '<div class="python-output-head"><strong>运行输出</strong><span data-python-status="' + taskId + '">' + lastStatus + '</span></div>' +
    '<pre class="python-output" data-python-output="' + taskId + '">' + lastOutput + '</pre>' +
    '<div class="python-files" data-python-files="' + taskId + '"></div>' +
  '</section>';
}
function pythonStatus(taskId, text, type = "") {
  const node = document.querySelector("[data-python-status='" + taskId + "']");
  if (!node) return;
  node.textContent = text;
  node.className = type ? "python-status " + type : "python-status";
}
function pythonOutput(taskId, text) {
  const node = document.querySelector("[data-python-output='" + taskId + "']");
  if (node) node.textContent = text;
}
function pythonPath(name) {
  const safe = String(name).split("/").filter(Boolean).map((part) => part.replace(/\0/g, "_")).join("/");
  return "/home/pyodide/" + safe;
}
function ensurePythonDirectories(pyodide, filePath) {
  const parts = filePath.split("/").slice(1, -1);
  let current = "";
  parts.forEach((part) => {
    current += "/" + part;
    try { pyodide.FS.mkdir(current); } catch {}
  });
}
function writePythonFile(pyodide, name, bytes) {
  const path = pythonPath(name);
  ensurePythonDirectories(pyodide, path);
  pyodide.FS.writeFile(path, bytes);
  pythonMountedFiles.set(name, path);
}
async function loadPyodideRuntime(onStatus = () => {}) {
  if (window.__AI_TRAINER_PYODIDE__) return window.__AI_TRAINER_PYODIDE__;
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const start = async () => {
        try {
          onStatus("正在启动 Python…");
          if (!window.loadPyodide) throw new Error("Python 运行时脚本未加载");
          const pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE });
          window.__AI_TRAINER_PYODIDE__ = pyodide;
          resolve(pyodide);
        } catch (error) {
          reject(error);
        }
      };
      const existing = document.querySelector("script[data-pyodide-loader]");
      if (existing) {
        if (window.loadPyodide) start();
        else existing.addEventListener("load", start, { once: true });
        existing.addEventListener("error", () => reject(new Error("Python 运行时加载失败")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = PYODIDE_BASE + "pyodide.js";
      script.async = true;
      script.dataset.pyodideLoader = "true";
      script.onload = start;
      script.onerror = () => reject(new Error("Python 运行时加载失败"));
      document.head.appendChild(script);
    });
  }
  return pyodidePromise;
}
async function loadTaskPythonFiles(taskId) {
  const task = TASKS.find((item) => item.id === taskId);
  const assets = pythonAssetCandidates(TASK_ASSETS[taskId] || []);
  if (!task || !assets.length) {
    pythonStatus(taskId, "请先上传文件", "error");
    return;
  }
  const pyodide = await loadPyodideRuntime((text) => pythonStatus(taskId, text));
  let loaded = 0;
  for (const asset of assets) {
    if (pythonMountedFiles.has(asset.name)) { loaded += 1; continue; }
    const response = await fetch(asset.href, { cache: "no-store" });
    if (!response.ok) throw new Error(assetFileName(asset) + " HTTP " + response.status);
    writePythonFile(pyodide, asset.name, new Uint8Array(await response.arrayBuffer()));
    loaded += 1;
  }
  pythonStatus(taskId, "已挂载 " + loaded + " 个素材", "success");
  const mounted = document.getElementById("python-mounted-" + taskId);
  if (mounted) mounted.textContent = "已挂载：" + assets.map((asset) => assetFileName(asset)).join("、");
}
async function uploadPythonFiles(taskId, files) {
  if (!files.length) return;
  const pyodide = await loadPyodideRuntime((text) => pythonStatus(taskId, text));
  for (const file of files) writePythonFile(pyodide, file.name, new Uint8Array(await file.arrayBuffer()));
  pythonStatus(taskId, "已上传 " + files.length + " 个文件", "success");
  const mounted = document.getElementById("python-mounted-" + taskId);
  if (mounted) mounted.textContent = "已挂载：" + [...pythonMountedFiles.keys()].join("、");
}
function pythonFiles(pyodide, directory = "/home/pyodide") {
  return pyodide.FS.readdir(directory).filter((name) => name !== "." && name !== "..").flatMap((name) => {
    const path = directory + "/" + name;
    try {
      return (pyodide.FS.stat(path).mode & 0x4000) ? pythonFiles(pyodide, path) : [path];
    } catch { return []; }
  });
}
function renderPythonFiles(taskId, pyodide) {
  const node = document.querySelector("[data-python-files='" + taskId + "']");
  if (!node) return;
  const files = pythonFiles(pyodide);
  if (!files.length) { node.innerHTML = ""; return; }
  node.innerHTML = "<span>当前文件：</span>" + files.map((path) => {
    const name = path.replace("/home/pyodide/", "");
    const downloadName = name.replace(/\//g, "__");
    const blob = new Blob([pyodide.FS.readFile(path)], { type: "application/octet-stream" });
    const href = URL.createObjectURL(blob);
    return '<a href="' + href + '" download="' + escapeHtml(downloadName) + '">' + escapeHtml(name) + " 下载</a>";
  }).join("");
}
async function runPython(taskId) {
  const editor = document.querySelector("[data-python-editor='" + taskId + "']");
  if (!editor) return;
  const code = editor.value.trim();
  if (!code) { pythonStatus(taskId, "代码为空", "error"); return; }
  savePythonCode(taskId, editor.value);
  const runToken = ++pythonRunId;
  const runButton = document.querySelector("[data-python-run='" + taskId + "']");
  if (runButton) runButton.disabled = true;
  pythonOutput(taskId, "准备运行…");
  pythonStatus(taskId, "加载 Python 和代码依赖…");
  const output = [];
  const stderr = [];
  try {
    const pyodide = await loadPyodideRuntime((text) => pythonStatus(taskId, text));
    pyodide.setStdout({ batched: (text) => output.push(text) });
    pyodide.setStderr({ batched: (text) => stderr.push(text) });
    await pyodide.loadPackagesFromImports(code);
    if (/\bread_excel\s*\(/.test(code)) {
      try { await pyodide.loadPackage("openpyxl"); } catch {}
    }
    const result = await pyodide.runPythonAsync(code);
    const stderrText = stderr.join("\n").trim();
    if (stderrText && !/Pyarrow will become a required dependency/.test(stderrText)) output.push("[stderr] " + stderrText);
    if (result !== undefined && result !== null) {
      output.push(String(result));
      if (result && typeof result.destroy === "function") result.destroy();
    }
    if (runToken !== pythonRunId) return;
    const finalOutput = output.join("\n").trim() || "运行完成，没有文本输出。";
    pythonOutput(taskId, finalOutput);
    savePythonRun(taskId, "success", finalOutput);
    renderPythonFiles(taskId, pyodide);
    pythonStatus(taskId, "运行完成", "success");
  } catch (error) {
    if (runToken !== pythonRunId) return;
    const stderrText = stderr.join("\n").trim();
    const diagnostic = stderrText && !/Pyarrow will become a required dependency/.test(stderrText) ? ["[stderr] " + stderrText] : [];
    const errorText = String(error?.message || error);
    const encodingHint = /UnicodeDecodeError|codec can't decode/i.test(errorText) ? "提示：这份表格可能是 GBK 编码，可尝试 pd.read_csv('文件名', encoding='gbk')" : "";
    const finalOutput = output.concat(diagnostic, errorText, encodingHint).filter(Boolean).join("\n").trim();
    pythonOutput(taskId, finalOutput);
    savePythonRun(taskId, "error", finalOutput);
    pythonStatus(taskId, "运行失败", "error");
  } finally {
    if (runButton) runButton.disabled = false;
  }
}
function clearPythonOutput(taskId) {
  pythonOutput(taskId, "点击“运行 Python”开始检查。");
  pythonStatus(taskId, "尚未运行");
  const stored = pythonRunMap();
  delete stored[taskId];
  localStorage.setItem(PYTHON_RUN_KEY, JSON.stringify(stored));
  const files = document.querySelector("[data-python-files='" + taskId + "']");
  if (files) files.innerHTML = "";
}
function resetPythonCode(taskId) {
  const task = TASKS.find((item) => item.id === taskId);
  const assets = TASK_ASSETS[taskId] || [];
  const editor = document.querySelector("[data-python-editor='" + taskId + "']");
  if (!task || !editor) return;
  const stored = pythonCodeMap();
  delete stored[taskId];
  localStorage.setItem(PYTHON_CODE_KEY, JSON.stringify(stored));
  editor.value = pythonCodeFor(task, assets);
  savePythonCode(taskId, editor.value);
  clearPythonOutput(taskId);
}

function parseCsvLine(line) {
  const cells = []; let cell = ""; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += char;
  }
  cells.push(cell);
  return cells;
}
async function previewCsv(button) {
  const target = document.getElementById(button.dataset.previewId);
  if (!target) return;
  if (!target.hidden) { target.hidden = true; return; }
  target.hidden = false;
  target.innerHTML = "<span class=\"csv-loading\">正在读取前 20 行……</span>";
  try {
    const response = await fetch(button.dataset.previewCsv, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() !== "").slice(0, 21);
    if (!lines.length) throw new Error("文件为空");
    const table = lines.map((line, row) => `<tr>${parseCsvLine(line).slice(0, 12).map((cell) => `<${row === 0 ? "th" : "td"}>${escapeHtml(cell)}</${row === 0 ? "th" : "td"}>`).join("")}</tr>`).join("");
    target.innerHTML = `<div class="csv-caption">前 ${Math.max(0, lines.length - 1)} 行 · 最多显示 12 列</div><div class="csv-table-wrap"><table>${table}</table></div>`;
  } catch (error) {
    target.innerHTML = `<span class="csv-error">表格预览失败：${escapeHtml(error.message || "读取失败")}，请直接下载文件。</span>`;
  }
}
async function loadGuide() {
  try {
    const response = await fetch("guide.txt", { cache: "no-store" });
    if (!response.ok) throw new Error(`guide.txt HTTP ${response.status}`);
    guideSections = parseGuideText(await response.text());
    if (currentRoute === "practice") render();
  } catch (error) {
    guideError = error.message || "读取失败";
    if (currentRoute === "practice") render();
  }
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message; toast.classList.add("show");
  window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}
function setRoute(route) {
  currentRoute = route;
  document.querySelectorAll("[data-route]").forEach((button) => button.classList.toggle("active", button.dataset.route === route && button.classList.contains("nav-item")));
  const titles = { dashboard: "把答案变成动作", practice: practiceMode === "fill" ? "逐空填答" : "先回忆，再看答案", modules: "六大模块，按得分排序", mistakes: "错题不是惩罚，是下一轮提示", plan: "12天冲刺，优先拿稳必考70分" };
  document.getElementById("page-title").textContent = titles[route] || titles.dashboard;
  render();
}
function updateShell() {
  document.getElementById("sidebar-countdown").textContent = daysLeft() > 0 ? `还剩 ${daysLeft()} 天` : "今天考试";
  document.getElementById("mistake-count").textContent = hardCount();
  document.getElementById("top-eyebrow").textContent = `今日训练 · ${new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}`;
}

function render() {
  updateShell();
  if (currentRoute === "practice") document.getElementById("page-title").textContent = practiceMode === "fill" ? "逐空填答" : "先回忆，再看答案";
  const root = document.getElementById("view-root");
  if (currentRoute === "practice") root.innerHTML = renderPractice();
  else if (currentRoute === "modules") root.innerHTML = renderModules();
  else if (currentRoute === "mistakes") root.innerHTML = renderMistakes();
  else if (currentRoute === "plan") root.innerHTML = renderPlan();
  else root.innerHTML = renderDashboard();
  if (currentRoute === "practice") {
    const task = activeSessionTasks[currentTaskIndex] || TASKS[0];
    const assetPanel = root.querySelector(".asset-panel");
    if (assetPanel) assetPanel.insertAdjacentHTML("afterend", renderPythonLab(task, TASK_ASSETS[task.id] || []));
  }
  if (currentRoute === "practice" && practiceMode === "fill") {
    const fillCopy = root.querySelector(".view-heading p");
    const blankCount = root.querySelectorAll(".blank-input, .source-input").length;
    if (fillCopy && blankCount) fillCopy.textContent = `每空先独立作答，本题共 ${blankCount} 空，提交后逐项批改。`;
  }
  bindEvents();
}

function renderDashboard() {
  const days = daysLeft();
  const reviewed = reviewedCount();
  const progressPct = Math.round(reviewed / TASKS.length * 100);
  const today = PLAN.find((item) => item[0] === "08/17") || PLAN[0];
  return `
    <section class="hero-grid">
      <article class="hero-card">
        <span class="eyebrow">Active recall · 先回忆再核对</span>
        <h2>今天不抄答案，只练能在考场复现的动作。</h2>
        <p>每张卡先写出步骤或口述骨架，再展开提示。自评“模糊/不会”的题会自动进入错题复盘，形成当天、次日、3天后、7天后的复做节奏。</p>
        <div class="hero-actions"><button class="primary-button" data-route="practice">开始今日 ${today[1]} <span aria-hidden="true">→</span></button><button class="outline-button" data-route="practice" data-fill="true" data-practice-mode="fill">填空模拟</button><button class="outline-button" data-route="modules">浏览题库</button></div>
      </article>
      <article class="countdown-card">
        <div><span class="eyebrow">距离目标考试</span><div class="days">${days}<small>天</small></div><p>考试日：2026年8月29日<br/>先稳住 2.1 / 2.2 / 3.1 / 3.2 的 70 分。</p></div>
        <div class="mini-progress"><div class="progress-label"><span>已建立复习记录</span><strong>${reviewed}/${TASKS.length}</strong></div><div class="progress-track"><span style="width:${progressPct}%"></span></div></div>
      </article>
    </section>
    <section class="stats-grid">
      <article class="stat-card"><span class="eyebrow">题库</span><div class="value">40</div><div class="label">道实操题</div><div class="trend">覆盖 6 个模块</div></article>
      <article class="stat-card"><span class="eyebrow">必考分区</span><div class="value">70<span style="font-size:14px">分</span></div><div class="label">2.1 / 2.2 / 3.1 / 3.2</div><div class="trend">优先训练</div></article>
      <article class="stat-card"><span class="eyebrow">已复习</span><div class="value">${reviewed}</div><div class="label">张卡片有记录</div><div class="trend">${progressPct}% 覆盖</div></article>
      <article class="stat-card"><span class="eyebrow">待复盘</span><div class="value">${hardCount()}</div><div class="label">模糊或不会</div><div class="trend" style="color:${hardCount() ? "var(--orange)" : "var(--teal)"}">${hardCount() ? "今天优先处理" : "暂时没有"}</div></article>
    </section>
    <section class="dashboard-columns">
      <article class="panel panel-pad"><div class="section-header"><div><h2>模块掌握进度</h2><p>每题“会了”两次才算掌握。</p></div><button class="small-button" data-route="modules">查看全部</button></div><div class="module-list">${MODULES.map(renderModuleRow).join("")}</div></article>
      <article class="focus-panel"><span class="eyebrow">今日聚焦 · ${today[0]}</span><h3>${today[1]}</h3><p>${today[2]}。从 20 分钟限时开始，不追求一次完美，先确保流程完整。</p><div class="focus-chain">${MODULES[1].chain.map((step) => `<span class="chain-step">${step}</span>`).join("")}</div><button class="primary-button" data-route="practice" data-focus="data">现在开始 <span aria-hidden="true">→</span></button></article>
    </section>
    <section class="panel panel-pad" style="margin-top:17px"><div class="section-header"><div><h2>接下来 5 天</h2><p>每天只改变一个主变量，保证真实复做。</p></div><button class="small-button" data-route="plan">完整计划</button></div><div class="plan-strip">${PLAN.slice(0, 5).map((item, index) => `<article class="plan-day ${index === 0 ? "current" : ""}"><span class="date">${item[0]}</span><strong>${item[1]}</strong><span>${item[2]}</span></article>`).join("")}</div></section>
  `;
}

function renderModuleRow(module) {
  const pct = moduleProgress(module.id);
  const count = moduleTasks(module.id).length;
  return `<div class="module-row"><span class="module-number">${module.label.split(" ")[0]}</span><div><div class="module-name">${module.title}</div><div class="module-meta">${module.label} · ${count}题<div class="module-bar"><span style="width:${pct}%"></span></div></div></div><div class="module-score"><strong>${pct}%</strong>已掌握</div></div>`;
}

function renderModules() {
  return `<div class="view-heading"><div><span class="eyebrow">题库地图</span><h2 style="margin-top:7px">六大模块，先攻必考分区</h2><p>每张卡都只保留能触发动作的关键提示；详细原始文件仍在你的资料目录。</p></div><div class="view-actions"><button class="primary-button" data-route="practice">开始随机训练 <span aria-hidden="true">→</span></button></div></div><div class="module-grid">${MODULES.map((module) => { const pct = moduleProgress(module.id); return `<article class="module-card"><div class="module-card-head"><div><h3>${module.title}</h3><p>${module.label} · ${moduleTasks(module.id).length}题 · ${module.desc}</p></div><span class="weight">${module.weight}分</span></div><div class="chain-line">${module.chain.map((step) => `<span>${step}</span>`).join("")}</div><div class="module-card-footer"><small>已掌握 ${pct}%</small><button class="small-button" data-start-module="${module.id}">进入训练 <span aria-hidden="true">→</span></button></div></article>`; }).join("")}</div>`;
}

function renderModeBar(task) {
  const fillAvailable = hasFillMode(task);
  const source = Boolean(sourceBlocks(task));
  return `<div class="practice-mode-bar"><span class="mode-label">作答方式</span><button class="mode-button ${practiceMode === "recall" ? "active" : ""}" data-practice-mode="recall">整题回忆</button>${fillAvailable ? `<button class="mode-button ${practiceMode === "fill" ? "active" : ""}" data-practice-mode="fill">逐空填答</button>` : `<button class="mode-button disabled" disabled>逐空填答</button>`}<span class="mode-note">${source ? "原题空位已嵌入素材原文" : "本题按资料空位逐空批改"}</span></div>`;
}

function renderSelfRate() {
  return `<div class="self-rate" id="self-rate"><p>按刚才的独立程度自评，系统会安排下一次复做。</p><div class="rating-buttons"><button class="rating-hard" data-rating="hard">不会 / 错得多</button><button data-rating="okay">模糊 / 看提示才会</button><button data-rating="mastered">会了 / 能独立复现</button></div><div class="error-picker" id="error-picker"><label for="error-type">主要卡点</label><select id="error-type"><option value="C">C · 代码/语法</option><option value="D">D · 数据处理逻辑</option><option value="M">M · 模型/指标</option><option value="A">A · 分析结论</option><option value="F">F · 文件交付</option><option value="T">T · 超时</option></select></div></div>`;
}

function renderRecallPractice(task, state) {
  return `<label class="response-label" for="response-box">现在先写你的步骤 / 口述稿 <span>可以只写关键词，不要看参考</span></label><textarea id="response-box" class="response-box" placeholder="例如：读 → 看 → 清 → 删 → 变 → 选 → 分 → 存，然后补充这道题的字段、指标和交付文件……"></textarea>${renderSourceNote(task)}<div class="practice-toolbar"><div class="left"><button class="primary-button" id="reveal-answer">检查我的回忆 <span aria-hidden="true">↓</span></button><button class="hint-button" id="show-one-hint">只看一个提示</button></div><div class="right"><span style="color:var(--muted);font-size:10px">本题记录：${state.attempts}次 · 掌握 ${Math.min(2, state.mastered)}/2</span></div></div><div class="answer-reveal" id="answer-reveal"><h3>参考骨架（用于回忆，不替代原题答案）</h3><p>${task.answer}</p><div class="trigger-list">${task.triggers.map((trigger) => `<span class="trigger">${trigger}</span>`).join("")}</div>${renderExactReference(task)}${renderSelfRate()}</div>`;
}

function renderFillPractice(task, state) {
  const blanks = fillBlanks(task);
  const source = SOURCE_DATA[task.id];
  const sourceMarkup = source ? `<div class="source-origin">素材库原题 · ${escapeHtml(source.sourceFile)}</div><div class="source-code">${source.blocks.map((block, blockIndex) => {
    const offset = source.blocks.slice(0, blockIndex).reduce((sum, item) => sum + item.answers.length, 0);
    const text = escapeHtml(block.text).replace(/\{\{(\d+)\}\}/g, (_, localSlot) => {
      const globalIndex = offset + Number(localSlot);
      const answer = block.answers[Number(localSlot)] || "";
      const longAnswer = answer.length > 48 || answer.includes("\n");
      return longAnswer ? `<textarea class="source-input source-long" data-blank-input="${globalIndex}" rows="3" placeholder="第 ${globalIndex + 1} 空"></textarea>` : `<input class="source-input" data-blank-input="${globalIndex}" placeholder="第 ${globalIndex + 1} 空" autocomplete="off" />`;
    });
    return `<div class="source-line ${block.answers.length ? "has-blank" : ""} ${block.cell ? "source-cell" : ""}">${text}</div>`;
  }).join("")}</div>` : `<div class="blank-list">${blanks.map((blank, index) => { const answer = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer; const control = answer.length > 32 ? `<textarea class="blank-input" data-blank-input="${index}" rows="3" placeholder="填写第 ${index + 1} 空"></textarea>` : `<input class="blank-input" data-blank-input="${index}" placeholder="填写第 ${index + 1} 空" autocomplete="off" />`; return `<article class="blank-item"><div class="blank-number">${index + 1}</div><div class="blank-body"><div class="blank-clue">${escapeHtml(blank.clue)}</div>${control}</div></article>`; }).join("")}</div>`;
  return `<div class="fill-practice" id="fill-practice" data-fill-task="${task.id}"><div class="fill-intro"><strong>按素材原题逐空填写 · 共 ${blanks.length} 空</strong><span>输入框只放在素材库原下划线或空白单元格的位置；提交后按核对版答案批改。</span></div>${renderSourceNote(task)}${sourceMarkup}${renderSupplementChecks(task)}<div class="practice-toolbar"><div class="left"><button class="primary-button" id="grade-fill">提交并批改 <span aria-hidden="true">✓</span></button><button class="hint-button" id="show-one-hint">看原题位置</button></div><div class="right"><span style="color:var(--muted);font-size:10px">本题记录：${state.attempts}次 · 掌握 ${Math.min(2, state.mastered)}/2</span></div></div><div class="fill-results" id="fill-results" aria-live="polite"></div><div class="answer-reveal" id="answer-reveal"><h3>原题空位核对答案</h3><div class="fill-answer-list">${blanks.map((blank, index) => `<div class="fill-answer-row"><span>第 ${index + 1} 空</span><strong>${escapeHtml(Array.isArray(blank.answer) ? blank.answer[0] : blank.answer)}</strong></div>`).join("")}</div>${renderExactReference(task)}${renderSelfRate()}</div></div>`;
}

function renderPractice() {
  const task = activeSessionTasks[currentTaskIndex] || TASKS[0];
  const state = taskState(task.id);
  const module = MODULES.find((item) => item.id === task.module);
  const activeLabel = currentFilter === "all" ? "全部题目" : currentFilter === "fill" ? "填空题" : (MODULES.find((item) => item.id === currentFilter)?.title || "当前模块");
  const progressLine = `${currentTaskIndex + 1} / ${activeSessionTasks.length}`;
  const fillActive = practiceMode === "fill" && hasFillMode(task);
  const unsupportedNotice = practiceMode === "fill" && !hasFillMode(task) ? `<div class="mode-unavailable">本题没有独立下划线空，已切换为整题 / 交付模拟。</div>` : "";
  return `<div class="view-heading"><div><span class="eyebrow">训练 · ${activeLabel}</span><h2 style="margin-top:7px">${fillActive ? "按素材原题逐空填写" : "先写，再展开参考骨架"}</h2><p>${fillActive ? "每空先独立作答，提交后按对应原答案逐项批改。" : "不要追求逐字一致；能按触发词复现步骤、输出和验收指标，才算掌握。"}</p></div><div class="view-actions"><button class="outline-button" id="shuffle-session">换一组 <span aria-hidden="true">↻</span></button><button class="primary-button" id="toggle-timer">${timerId ? "暂停计时" : "开始计时"} <span aria-hidden="true">◷</span></button></div></div>${renderModeBar(task)}<div class="practice-layout"><aside class="panel practice-sidebar"><h3>训练筛选</h3><div class="filter-stack"><button class="filter-button ${currentFilter === "all" ? "active" : ""}" data-filter="all">全部题目 <span style="float:right">${TASKS.length}</span></button><button class="filter-button ${currentFilter === "fill" ? "active" : ""}" data-filter="fill">填空题 <span style="float:right">${fillTaskCount()}</span></button>${MODULES.map((item) => `<button class="filter-button ${currentFilter === item.id ? "active" : ""}" data-filter="${item.id}">${item.title} <span style="float:right">${moduleTasks(item.id).length}</span></button>`).join("")}</div><div class="session-card"><span class="eyebrow">本轮进度</span><strong>${progressLine}</strong><p>自评记录会进入本机进度，不会上传到任何网站。</p></div></aside><section class="panel question-panel"><div class="question-top"><div><span class="question-id">${task.id} · ${module.title}</span><div class="question-context">${module.label} · ${task.source}</div></div><span class="question-timer" id="timer-label">${formatTimer(remainingSeconds)}</span></div><h2>${task.title}</h2><div class="prompt-box"><span class="eyebrow">题目任务</span><p>${task.prompt}</p><p style="margin-top:5px;color:var(--muted)">${task.context}</p></div>${unsupportedNotice}${renderTaskAssets(task)}${fillActive ? renderFillPractice(task, state) : renderRecallPractice(task, state)}${renderGuideDetails(task)}<div class="question-nav"><button id="prev-question">← 上一题</button><button class="next" id="next-question">下一题 →</button></div></section></div>`;
}

function formatTimer(seconds) { const min = Math.floor(seconds / 60).toString().padStart(2, "0"); const sec = (seconds % 60).toString().padStart(2, "0"); return `${min}:${sec}`; }
function renderMistakes() {
  const mistakes = TASKS.filter((task) => { const state = taskState(task.id); return state.hard > 0 && state.mastered < state.hard; });
  return `<div class="view-heading"><div><span class="eyebrow">间隔复习</span><h2 style="margin-top:7px">把卡住的地方变成下一次提示</h2><p>错题记录只在本机保存。先复做最弱的一题，再去刷新题。</p></div><div class="view-actions"><button class="primary-button" data-route="practice" data-mistakes="true">开始错题复做 <span aria-hidden="true">→</span></button></div></div><div class="mistake-grid">${mistakes.length ? mistakes.map((task) => { const state = taskState(task.id); const module = MODULES.find((item) => item.id === task.module); return `<article class="mistake-row"><span class="id">${task.id}</span><div><strong>${task.title}</strong><p>${module.title} · ${state.error ? `${state.error} 类卡点 · ` : ""}已错 ${state.hard} 次，掌握 ${Math.min(2, state.mastered)}/2</p></div><div class="last">${state.last ? `上次 ${formatDate(new Date(state.last))}` : "待复做"}<br/><button class="small-button" data-review-id="${task.id}">复做</button></div></article>`; }).join("") : `<div class="panel empty-state"><strong>还没有错题记录</strong><p>开始一轮回忆训练，自评“不会”或“模糊”的题会出现在这里。</p><button class="primary-button" style="margin-top:15px" data-route="practice">去做第一题 <span aria-hidden="true">→</span></button></div>`}</div>`;
}

function renderPlan() {
  const todayKey = "08/17";
  return `<div class="view-heading"><div><span class="eyebrow">倒排复习</span><h2 style="margin-top:7px">把半个月拆成可验收的小块</h2><p>今天到考试前，不追求看完所有资料；每天完成一次独立复现，并记下一条错因和改进动作。</p></div><div class="view-actions"><button class="primary-button" data-route="practice">按计划开始 <span aria-hidden="true">→</span></button></div></div><div class="plan-layout"><section class="panel timeline"><div class="section-header"><div><h2>每日安排</h2><p>四个必考单元先形成稳定得分区。</p></div><span class="weight" style="padding:6px 8px;background:var(--orange-soft);color:var(--orange);font-size:10px;font-weight:800;border-radius:5px">目标 75+</span></div><div class="timeline-list">${PLAN.map((item) => `<article class="timeline-item ${item[0] === todayKey ? "current" : ""} ${item[0] < todayKey ? "done" : ""}"><div class="timeline-date">${item[0]}</div><div class="timeline-rail"><span class="timeline-dot"></span></div><div class="timeline-content"><strong>${item[1]}</strong><p>${item[2]}</p></div></article>`).join("")}</div></section><aside class="memory-panel"><span class="eyebrow">四条动作链</span><h3>看到题目就触发</h3><p>不要背整段答案。每条链都要在 2 分钟内口述出来，再开始写代码或答题骨架。</p><div class="memory-stack">${ACTION_CARDS.map((card) => `<article class="memory-card"><strong>${card[0]}</strong><span>${card[1]}</span><span>${card[2]}</span></article>`).join("")}</div></aside></div>`;
}

function startSession(filter = currentFilter, fromMistakes = false, mode = "fill") {
  currentFilter = filter;
  practiceMode = mode;
  const pool = fromMistakes ? TASKS.filter((task) => { const state = taskState(task.id); return state.hard > 0 && state.mastered < state.hard; }) : (filter === "fill" ? TASKS.filter((task) => hasFillMode(task)) : (filter === "all" ? TASKS : moduleTasks(filter)));
  activeSessionTasks = pool.length ? [...pool].sort(() => Math.random() - .5) : [...TASKS];
  currentTaskIndex = 0; remainingSeconds = 20 * 60; stopTimer(); setRoute("practice");
}
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
function startTimer() {
  if (timerId) { stopTimer(); document.getElementById("toggle-timer").innerHTML = "开始计时 <span aria-hidden=\"true\">◷</span>"; return; }
  document.getElementById("toggle-timer").innerHTML = "暂停计时 <span aria-hidden=\"true\">Ⅱ</span>";
  timerId = setInterval(() => { remainingSeconds = Math.max(0, remainingSeconds - 1); const label = document.getElementById("timer-label"); if (label) label.textContent = formatTimer(remainingSeconds); if (remainingSeconds === 0) { stopTimer(); const button = document.getElementById("toggle-timer"); if (button) button.innerHTML = "开始计时 <span aria-hidden=\"true\">◷</span>"; showToast("本轮计时结束，先保存当前回忆再自评。"); } }, 1000);
}
function gradeFill() {
  const task = activeSessionTasks[currentTaskIndex];
  const blanks = fillBlanks(task);
  const root = document.getElementById("fill-practice");
  const result = document.getElementById("fill-results");
  if (!root || !result || !blanks.length) return;
  const inputs = [...root.querySelectorAll("[data-blank-input]")];
  let score = 0;
  const rows = blanks.map((blank, index) => {
    const input = inputs[index];
    const value = input?.value || "";
    const correct = blankMatches(value, blank);
    if (correct) score += 1;
    input?.classList.toggle("correct", correct);
    input?.classList.toggle("incorrect", !correct);
    const expected = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
    return `<div class="fill-result-row ${correct ? "correct" : "incorrect"}"><span class="fill-result-badge">${correct ? "正确" : "需复习"}</span><div><strong>第 ${index + 1} 空</strong><p>${correct ? "核对版答案匹配" : `核对答案：${escapeHtml(expected)}`}</p></div></div>`;
  });
  const checks = extraChecks(task);
  let extraScore = 0;
  const extraRows = checks.map((check, index) => {
    const input = root.querySelector(`[data-extra-input="${index}"]`);
    const correct = blankMatches(input?.value || "", check);
    if (correct) extraScore += 1;
    input?.classList.toggle("correct", correct);
    input?.classList.toggle("incorrect", !correct);
    return `<div class="fill-result-row ${correct ? "correct" : "incorrect"}"><span class="fill-result-badge">${correct ? "正确" : "需补做"}</span><div><strong>补充 ${index + 1} · ${escapeHtml(check.clue)}</strong><p>${correct ? "题面补充要求匹配" : `建议写：${escapeHtml(check.answer)}`}</p></div></div>`;
  });
  const extraSummary = checks.length ? `<div class="supplement-score"><strong>补充检查 ${extraScore} / ${checks.length}</strong><span>${extraScore === checks.length ? "题面额外要求已覆盖" : `还有 ${checks.length - extraScore} 项题面要求需要补做`}</span></div>${extraRows.join("")}` : "";
  result.innerHTML = `<div class="fill-score"><strong>原题空位 ${score} / ${blanks.length}</strong><span>${score === blanks.length ? `本题 ${blanks.length} 个原题空全部命中` : `还有 ${blanks.length - score} 个原题空需要复做`}</span></div>${rows.join("")}${extraSummary}`;
  result.classList.add("show");
  document.getElementById("answer-reveal")?.classList.add("show");
  document.getElementById("self-rate")?.classList.add("show");
  const button = document.getElementById("grade-fill");
  if (button) button.innerHTML = `已批改 ${score}/${blanks.length}${checks.length ? ` · 补充 ${extraScore}/${checks.length}` : ""} <span aria-hidden="true">↻</span>`;
}
function revealAnswer() { const reveal = document.getElementById("answer-reveal"); if (!reveal) return; reveal.classList.add("show"); document.getElementById("self-rate").classList.add("show"); document.getElementById("reveal-answer").textContent = "已展开参考骨架"; }
function rateTask(rating) {
  const task = activeSessionTasks[currentTaskIndex]; if (!task) return;
  const state = taskState(task.id); state.attempts += 1; state.last = new Date().toISOString();
  if (rating === "mastered") { state.mastered += 1; state.okay = 0; } else if (rating === "okay") { state.okay += 1; state.mastered = Math.max(0, state.mastered - 1); } else { state.hard += 1; state.mastered = 0; }
  const errorPicker = document.getElementById("error-type");
  if (rating !== "mastered" && errorPicker) {
    state.error = errorPicker.value;
    document.getElementById("error-picker")?.classList.add("show");
    errorPicker.onchange = () => {
      state.error = errorPicker.value;
      progress[task.id] = state;
      saveProgress();
      showToast(`已更新卡点：${errorPicker.value}`);
    };
  }
  progress[task.id] = state; saveProgress(); updateShell();
  showToast(rating === "mastered" ? "已记录：会了。再独立复现一次就算掌握。" : "已加入复盘队列，下一轮会优先出现。");
}
function nextQuestion(delta = 1) { currentTaskIndex = (currentTaskIndex + delta + activeSessionTasks.length) % activeSessionTasks.length; render(); }

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.route === "practice" && (button.dataset.focus || button.dataset.mistakes || button.dataset.fill === "true")) {
      startSession(button.dataset.fill === "true" ? "fill" : (button.dataset.focus || "all"), button.dataset.mistakes === "true", button.dataset.practiceMode || "fill");
    } else setRoute(button.dataset.route);
  }));
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => startSession(button.dataset.filter, false, "fill")));
  document.querySelectorAll("[data-start-module]").forEach((button) => button.addEventListener("click", () => startSession(button.dataset.startModule)));
  document.querySelectorAll("[data-review-id]").forEach((button) => button.addEventListener("click", () => { const index = TASKS.findIndex((task) => task.id === button.dataset.reviewId); activeSessionTasks = [TASKS[index]]; currentTaskIndex = 0; setRoute("practice"); }));
  document.querySelectorAll("[data-practice-mode]").forEach((button) => button.addEventListener("click", () => {
    const task = activeSessionTasks[currentTaskIndex];
    if (button.dataset.practiceMode === "fill" && !hasFillMode(task)) { showToast("本题没有独立填空，请按整题或交付模拟作答。"); return; }
    practiceMode = button.dataset.practiceMode;
    render();
  }));
  const reveal = document.getElementById("reveal-answer"); if (reveal) reveal.addEventListener("click", revealAnswer);
  const grade = document.getElementById("grade-fill"); if (grade) grade.addEventListener("click", gradeFill);
  document.querySelectorAll("[data-preview-csv]").forEach((button) => button.addEventListener("click", () => previewCsv(button)));
  document.querySelectorAll("[data-python-editor]").forEach((editor) => editor.addEventListener("input", () => savePythonCode(editor.dataset.pythonEditor, editor.value)));
  document.querySelectorAll("[data-python-run]").forEach((button) => button.addEventListener("click", () => runPython(button.dataset.pythonRun).catch((error) => { pythonOutput(button.dataset.pythonRun, String(error.message || error)); pythonStatus(button.dataset.pythonRun, "运行失败", "error"); })));
  document.querySelectorAll("[data-python-load]").forEach((button) => button.addEventListener("click", () => loadTaskPythonFiles(button.dataset.pythonLoad).catch((error) => { pythonOutput(button.dataset.pythonLoad, String(error.message || error)); pythonStatus(button.dataset.pythonLoad, "素材加载失败", "error"); })));
  document.querySelectorAll("[data-python-upload]").forEach((input) => input.addEventListener("change", () => uploadPythonFiles(input.dataset.pythonUpload, [...input.files]).catch((error) => { pythonOutput(input.dataset.pythonUpload, String(error.message || error)); pythonStatus(input.dataset.pythonUpload, "文件加载失败", "error"); })));
  document.querySelectorAll("[data-python-clear]").forEach((button) => button.addEventListener("click", () => clearPythonOutput(button.dataset.pythonClear)));
  document.querySelectorAll("[data-python-reset]").forEach((button) => button.addEventListener("click", () => resetPythonCode(button.dataset.pythonReset)));
  const hint = document.getElementById("show-one-hint"); if (hint) hint.addEventListener("click", () => { const task = activeSessionTasks[currentTaskIndex]; const first = fillBlanks(task)[0]; showToast(first ? `原题位置：${first.clue}` : `提示：${task.triggers[0]} → ${task.triggers[1]}`); });
  document.querySelectorAll("[data-rating]").forEach((button) => button.addEventListener("click", () => rateTask(button.dataset.rating)));
  const prev = document.getElementById("prev-question"); if (prev) prev.addEventListener("click", () => nextQuestion(-1));
  const next = document.getElementById("next-question"); if (next) next.addEventListener("click", () => nextQuestion(1));
  const timer = document.getElementById("toggle-timer"); if (timer) timer.addEventListener("click", startTimer);
  const shuffle = document.getElementById("shuffle-session"); if (shuffle) shuffle.addEventListener("click", () => startSession(currentFilter, false, practiceMode));
  const reset = document.getElementById("reset-progress"); if (reset) reset.addEventListener("click", () => { if (window.confirm("确定清空本机练习进度吗？")) { progress = {}; saveProgress(); showToast("本机进度已清空"); render(); } });
}

render();
loadGuide();

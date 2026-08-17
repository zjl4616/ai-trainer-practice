const MODEL_RELEASE_BASE = "https://github.com/zjl4616/ai-trainer-practice/releases/download/study-assets-2026-08-18";

function localAsset(task, name, kind, label = name) {
  return { name, label, kind, href: `assets/${task}/${encodeURIComponent(name).replace(/%2F/g, "/")}`, local: true };
}

function releaseAsset(name, kind, label = name) {
  return { name, label, kind, href: `${MODEL_RELEASE_BASE}/${encodeURIComponent(name)}`, external: true, size: "模型文件，建议下载后用本地环境运行" };
}

window.TASK_ASSETS = {
  "1.1.1": [localAsset("1.1.1", "1.1.1.ipynb", "notebook", "原题 Notebook"), localAsset("1.1.1", "patient_data.csv", "csv", "练习数据 patient_data.csv")],
  "1.1.2": [localAsset("1.1.2", "1.1.2.ipynb", "notebook", "原题 Notebook"), localAsset("1.1.2", "sensor_data.csv", "csv", "练习数据 sensor_data.csv")],
  "1.1.3": [localAsset("1.1.3", "1.1.3.ipynb", "notebook", "原题 Notebook"), localAsset("1.1.3", "credit_data.csv", "csv", "练习数据 credit_data.csv")],
  "1.1.4": [localAsset("1.1.4", "1.1.4.ipynb", "notebook", "原题 Notebook"), localAsset("1.1.4", "user_behavior_data.csv", "csv", "练习数据 user_behavior_data.csv")],
  "1.1.5": [localAsset("1.1.5", "1.1.5.ipynb", "notebook", "原题 Notebook"), localAsset("1.1.5", "vehicle_traffic_data.csv", "csv", "练习数据 vehicle_traffic_data.csv")],
  "1.2.1": [localAsset("1.2.1", "1.2.1.docx", "docx", "原题答题卷 1.2.1.docx")],
  "1.2.2": [localAsset("1.2.2", "1.2.2.docx", "docx", "原题答题卷 1.2.2.docx")],
  "1.2.3": [localAsset("1.2.3", "1.2.3.docx", "docx", "原题答题卷 1.2.3.docx")],
  "1.2.4": [localAsset("1.2.4", "1.2.4.docx", "docx", "原题答题卷 1.2.4.docx")],
  "1.2.5": [localAsset("1.2.5", "1.2.5.docx", "docx", "原题答题卷 1.2.5.docx")],
  "2.1.1": [localAsset("2.1.1", "2.1.1.ipynb", "notebook", "原题 Notebook"), localAsset("2.1.1", "2.1.1.docx", "docx", "答题卷 2.1.1.docx"), localAsset("2.1.1", "auto-mpg.csv", "csv", "练习数据 auto-mpg.csv")],
  "2.1.2": [localAsset("2.1.2", "2.1.2.ipynb", "notebook", "原题 Notebook"), localAsset("2.1.2", "2.1.2.docx", "docx", "答题卷 2.1.2.docx"), localAsset("2.1.2", "大学生低碳生活行为的影响因素数据集.xlsx", "xlsx", "练习数据 Excel")],
  "2.1.3": [localAsset("2.1.3", "2.1.3.ipynb", "notebook", "原题 Notebook"), localAsset("2.1.3", "2.1.3.docx", "docx", "答题卷 2.1.3.docx"), localAsset("2.1.3", "finance数据集.csv", "csv", "练习数据 finance数据集.csv")],
  "2.1.4": [localAsset("2.1.4", "2.1.4.ipynb", "notebook", "原题 Notebook"), localAsset("2.1.4", "2.1.4.docx", "docx", "答题卷 2.1.4.docx"), localAsset("2.1.4", "medical_data.csv", "csv", "练习数据 medical_data.csv")],
  "2.1.5": [localAsset("2.1.5", "2.1.5.ipynb", "notebook", "原题 Notebook"), localAsset("2.1.5", "2.1.5.docx", "docx", "答题卷 2.1.5.docx"), localAsset("2.1.5", "健康咨询客户数据集.csv", "csv", "练习数据 CSV")],
  "2.2.1": [localAsset("2.2.1", "2.2.1.ipynb", "notebook", "原题 Notebook"), localAsset("2.2.1", "2.2.1.docx", "docx", "答题卷 2.2.1.docx"), localAsset("2.2.1", "finance数据集.csv", "csv", "练习数据 finance数据集.csv")],
  "2.2.2": [localAsset("2.2.2", "2.2.2.ipynb", "notebook", "原题 Notebook"), localAsset("2.2.2", "2.2.2.docx", "docx", "答题卷 2.2.2.docx"), localAsset("2.2.2", "auto-mpg.csv", "csv", "练习数据 auto-mpg.csv")],
  "2.2.3": [localAsset("2.2.3", "2.2.3.ipynb", "notebook", "原题 Notebook"), localAsset("2.2.3", "2.2.3.docx", "docx", "答题卷 2.2.3.docx"), localAsset("2.2.3", "fitness analysis.csv", "练习数据 fitness analysis.csv")],
  "2.2.4": [localAsset("2.2.4", "2.2.4.ipynb", "notebook", "原题 Notebook"), localAsset("2.2.4", "2.2.4.docx", "docx", "答题卷 2.2.4.docx"), localAsset("2.2.4", "大学生低碳生活行为的影响因素数据集.xlsx", "xlsx", "练习数据 Excel")],
  "2.2.5": [localAsset("2.2.5", "2.2.5.ipynb", "notebook", "原题 Notebook"), localAsset("2.2.5", "2.2.5.docx", "docx", "答题卷 2.2.5.docx"), localAsset("2.2.5", "fitness analysis.csv", "练习数据 fitness analysis.csv")],
  "3.1.1": [localAsset("3.1.1", "3.1.1.docx", "docx", "原题答题卷 3.1.1.docx"), localAsset("3.1.1", "智能音箱数据集.xlsx", "xlsx", "素材数据 Excel")],
  "3.1.2": [localAsset("3.1.2", "3.1.2.docx", "docx", "原题答题卷 3.1.2.docx"), localAsset("3.1.2", "智能照明系统数据集.xlsx", "xlsx", "素材数据 Excel")],
  "3.1.3": [localAsset("3.1.3", "3.1.3.docx", "docx", "原题答题卷 3.1.3.docx"), localAsset("3.1.3", "智能健康手环数据集.xlsx", "xlsx", "素材数据 Excel")],
  "3.1.4": [localAsset("3.1.4", "3.1.4.docx", "docx", "原题答题卷 3.1.4.docx"), localAsset("3.1.4", "智能健康监测系统数据集.xlsx", "xlsx", "素材数据 Excel")],
  "3.1.5": [localAsset("3.1.5", "3.1.5.docx", "docx", "原题答题卷 3.1.5.docx"), localAsset("3.1.5", "智能家居环境控制系统数据集.xlsx", "xlsx", "素材数据 Excel")],
  "3.2.1": [localAsset("3.2.1", "3.2.1.ipynb", "notebook", "原题 Notebook"), localAsset("3.2.1", "img_test.jpg", "image", "测试图片 img_test.jpg"), localAsset("3.2.1", "labels.txt", "text", "类别标签 labels.txt"), releaseAsset("resnet.onnx", "model", "模型 resnet.onnx")],
  "3.2.2": [localAsset("3.2.2", "3.2.2.ipynb", "notebook", "原题 Notebook"), localAsset("3.2.2", "img_test.png", "image", "测试图片 img_test.png"), releaseAsset("mnist.onnx", "model", "模型 mnist.onnx")],
  "3.2.3": [localAsset("3.2.3", "3.2.3.ipynb", "notebook", "原题 Notebook"), localAsset("3.2.3", "img_test.png", "image", "测试图片 img_test.png"), releaseAsset("emotion-ferplus.onnx", "model", "模型 emotion-ferplus.onnx")],
  "3.2.4": [localAsset("3.2.4", "3.2.4.ipynb", "notebook", "原题 Notebook"), localAsset("3.2.4", "flower_test.png", "image", "测试图片 flower_test.png"), localAsset("3.2.4", "labels.txt", "text", "类别标签 labels.txt"), releaseAsset("flower-detection.onnx", "model", "模型 flower-detection.onnx")],
  "3.2.5": [localAsset("3.2.5", "3.2.5.ipynb", "notebook", "原题 Notebook"), localAsset("3.2.5", "imgs/1.jpg", "image", "批处理输入 imgs/1.jpg"), localAsset("3.2.5", "voc-model-labels.txt", "text", "类别标签 voc-model-labels.txt"), localAsset("3.2.5", "vision.zip", "archive", "vision 工具包 vision.zip"), releaseAsset("version-RFB-320.onnx", "model", "模型 version-RFB-320.onnx")],
  "4.1.1": [localAsset("4.1.1", "4.1.1.docx", "docx", "原题答题卷 4.1.1.docx")],
  "4.1.2": [localAsset("4.1.2", "4.1.2.docx", "docx", "原题答题卷 4.1.2.docx")],
  "4.1.3": [localAsset("4.1.3", "4.1.3.docx", "docx", "原题答题卷 4.1.3.docx")],
  "4.1.4": [localAsset("4.1.4", "4.1.4.docx", "docx", "原题答题卷 4.1.4.docx")],
  "4.1.5": [localAsset("4.1.5", "4.1.5.docx", "docx", "原题答题卷 4.1.5.docx")],
  "4.2.1": [localAsset("4.2.1", "4.2.1.docx", "docx", "原题答题卷 4.2.1.docx")],
  "4.2.2": [localAsset("4.2.2", "4.2.2.docx", "docx", "原题答题卷 4.2.2.docx")],
  "4.2.3": [localAsset("4.2.3", "4.2.3.docx", "docx", "原题答题卷 4.2.3.docx")],
  "4.2.4": [localAsset("4.2.4", "4.2.4.docx", "docx", "原题答题卷 4.2.4.docx")],
  "4.2.5": [localAsset("4.2.5", "4.2.5.docx", "docx", "原题答题卷 4.2.5.docx")]
};

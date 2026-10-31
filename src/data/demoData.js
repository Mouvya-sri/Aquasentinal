// Clearly labelled sample records and illustrative detection overlays.
export const initialAnalyses = [
  { id: "AS-0248", name: "reef_survey_04.jpg", kind: "Image", date: "Today, 10:42 AM", status: "Completed", objects: 12, quality: "+38%" },
  { id: "AS-0247", name: "harbor_scan.mp4", kind: "Video", date: "Today, 9:18 AM", status: "Completed", objects: 28, quality: "+24%" },
  { id: "AS-0246", name: "seabed_sample_02.jpg", kind: "Image", date: "Yesterday", status: "Review needed", objects: 7, quality: "+31%" },
  { id: "AS-0245", name: "pier_inspection.mp4", kind: "Video", date: "Oct 26, 2026", status: "Completed", objects: 19, quality: "+19%" }
];

export const demoObjects = [
  { name: "Plastic bottle", type: "Marine debris", confidence: 96, color: "mint", x: "19%", y: "24%", w: "17%", h: "28%" },
  { name: "Discarded can", type: "Marine debris", confidence: 91, color: "blue", x: "56%", y: "49%", w: "13%", h: "20%" },
  { name: "Fishing net", type: "Entanglement hazard", confidence: 84, color: "purple", x: "67%", y: "17%", w: "21%", h: "30%" }
];

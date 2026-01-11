
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment, PersonnelInfo } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const MILITARY_KNOWLEDGE_BASE = `
HỆ THỐNG TRI THỨC QUÂN SỰ VIỆT NAM:

1. QUY CHẾ 775/QĐ-CT: Quy định quy trình 6 bước quản lý tư tưởng:
   - Bước 1: Nắm tình hình tư tưởng (Sâu sát thực tế, đối thoại dân chủ).
   - Bước 2: Dự báo diễn biến tư tưởng (Phân tích các nhân tố tác động).
   - Bước 3: Đánh giá, phân loại tư tưởng (Chính xác, khách quan).
   - Bước 4: Định hướng tư tưởng (Xác định mục tiêu giáo dục, xây dựng bản lĩnh).
   - Bước 5: Giải quyết các vấn đề tư tưởng nảy sinh (Kịp thời, thấu tình đạt lý).
   - Bước 6: Đấu tranh tư tưởng (Quyết liệt phê phán quan điểm sai trái).

2. TÀI LIỆU 100 TÌNH HUỐNG TƯ TƯỞNG (3 TẬP):
   - Phải áp dụng đúng gợi ý xử lý của cán bộ cơ sở trong tài liệu gốc.

NGÔN NGỮ CHUẨN MỰC:
- Sử dụng thuật ngữ: "Quán triệt", "Triển khai", "Báo cáo cấp trên", "Động viên tư tưởng", "Duy trì kỷ luật", "Sâu sát đơn vị".
- Tránh ngôn ngữ đời thường, phải thể hiện được tính nghiêm túc, quyết liệt của quân đội.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        sentimentScore: {
            type: Type.NUMBER,
            description: "Điểm số từ -1.0 đến 1.0.",
        },
        sentimentCategory: {
            type: Type.STRING,
            enum: [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative],
        },
        keyThemes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        summary: {
            type: Type.STRING,
            description: "Tóm tắt ngắn gọn diễn biến tư tưởng."
        },
        insights: {
            type: Type.STRING,
            description: "Phân tích tâm lý theo các tình huống trong 3 tập tài liệu."
        },
        officerRecommendations: {
            type: Type.STRING,
            description: "Định hướng giải quyết chi tiết, dứt khoát, chuẩn quân phong quân kỷ."
        }
    },
    required: ["sentimentScore", "sentimentCategory", "keyThemes", "summary", "insights", "officerRecommendations"]
};

export const analyzeThoughtLog = async (logText: string, sentiment: Sentiment, personnelInfo: PersonnelInfo): Promise<Omit<AnalysisResult, 'date'>> => {
    const systemInstruction = `Bạn là Trợ lý AI cao cấp của Tổng cục Chính trị. 
    YÊU CẦU NGÔN NGỮ:
    - Sử dụng phong cách hành chính quân sự Việt Nam. 
    - Câu lệnh dứt khoát: "Đề nghị chỉ huy đơn vị...", "Cần tiến hành ngay...", "Tuyệt đối không để...".
    - Xưng hô đúng mực: "Báo cáo đồng chí", "Trân trọng".
    
    CƠ SỞ PHÂN TÍCH:
    ${MILITARY_KNOWLEDGE_BASE}
    
    Khi phản hồi, phần 'officerRecommendations' phải là các bước cụ thể: "Bước 1: ..., Bước 2: ..." dựa trên Quy chế 775.`;
    
    const prompt = `PHÂN TÍCH QUÂN NHÂN:
    Họ tên: ${personnelInfo.fullName}
    Đơn vị: ${personnelInfo.unit}
    
    NỘI DUNG NHẬT KÝ:
    "${logText}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 4000 }
            },
        });
        
        return JSON.parse(response.text.trim());
    } catch (error) {
        throw new Error("Lỗi hệ thống phân tích quân sự.");
    }
};

export const NEW_VIETNAM_MILITARY_DOCTRINE = MILITARY_KNOWLEDGE_BASE;

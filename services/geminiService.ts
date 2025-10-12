import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment, PersonnelInfo } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VIETNAM_MILITARY_DOCTRINE_REFERENCE = `
TỔNG CỤC CHÍNH TRỊ
CỤC TUYÊN HUẤN
DẤU HIỆU NHẬN BIẾT HÀNH VI VI PHẠM KỶ LUẬT, MẤT AN TOÀN VÀ GỢI Ý BIỆN PHÁP XỬ LÝ CỦA CÁN BỘ CƠ SỞ ĐỐI VỚI NHỮNG TÌNH HUỐNG TƯ TƯỞNG CÓ THỂ NẢY SINH
(Tài liệu tham khảo TẬP 3)

Phần thứ nhất: DẤU HIỆU NHẬN BIẾT VÀ BIỆN PHÁP PHÒNG NGỪA CÁC NHÓM HÀNH VI VI PHẠM KỶ LUẬT, MẤT AN TOÀN
1. Tự tử, tự sát
a) Dấu hiệu nhận biết: Qua nhật ký, mạng xã hội, quân nhân thường xuyên suy nghĩ ám ảnh, cảm thấy vô vọng, vô nghĩa. Trầm cảm, buồn chán, mất ngủ. Tâm trạng thay đổi đột ngột, hay cáu gắt, cảm thấy tội lỗi, cô đơn. Giấu bệnh hiểm nghèo. Đề cập đến cái chết. Hành vi bất thường: cho đi tài sản, nói lời tạm biệt, tích trữ vật dụng gây hại.
b) Biện pháp phòng ngừa: Giáo dục chính trị tư tưởng. Nắm thông tin qua nhật ký, thiết bị cá nhân. Phân công cán bộ kèm cặp. Tăng cường quản lý, không để sử dụng chất kích thích, kiểm tra vũ khí, vật dụng nguy hiểm. Theo dõi chặt chẽ sau điều trị tâm lý. Liên hệ gia đình. Tổ chức hoạt động tập thể.

2. Cá độ bóng đá, bài bạc, lô đề
a) Dấu hiệu nhận biết: Có thói quen đánh bài, ham mê cá cược. Bàn tán thắng thua, kết quả xổ số. Tinh thần thay đổi bất thường sau các trận đấu. Tính hiếu thắng, muốn làm giàu nhanh. Công việc giảm sút, ít quan tâm gia đình.
b) Biện pháp phòng ngừa: Giáo dục pháp luật. Xây dựng lối sống lành mạnh. Tăng cường quản lý. Quản lý chặt chẽ quân nhân. Xây dựng môi trường đoàn kết. Kiểm tra định kỳ giấy tờ cá nhân. Nắm rõ tài sản, chi tiêu.

3. Vay mượn nợ không có khả năng chi trả
a) Dấu hiệu nhận biết: Muốn làm giàu nhanh, lười lao động. Đam mê cờ bạc, rượu chè, sống xa hoa. Làm ăn thua lỗ, gia đình có người bệnh nặng. Suy tư, buồn bã, bi quan, trầm cảm. Vay mượn tiền, cầm cố tài sản. Công việc giảm sút, ít quan tâm gia đình.
b) Biện pháp phòng ngừa: Giáo dục pháp luật về vay nợ. Tăng cường quản lý quan hệ xã hội, chi tiêu. Làm tốt công tác hậu phương. Xây dựng môi trường đoàn kết.

4. Mất đoàn kết giữa chiến sĩ cũ và chiến sĩ mới
a) Dấu hiệu nhận biết: Thái độ "thiếu thân thiện". Chiến sĩ cũ thể hiện là "đàn anh", sai vặt. Lời nói đe dọa. Chiến sĩ mới bất an, lo âu, sợ sệt. Không hòa đồng.
b) Biện pháp phòng ngừa: Giáo dục pháp luật, tinh thần đoàn kết. Phát huy trách nhiệm lãnh đạo. Tổ chức hoạt động giờ nghỉ. Chủ động nắm tình hình.

5. Quân phiệt
a) Dấu hiệu nhận biết: Ít nói, nói năng cộc cằn, thiếu kiên nhẫn. Nóng nảy, độc đoán. Hay phàn nàn, bức xúc về lỗi của quân nhân. Tâm lý ức chế. Bệnh thành tích.
b) Biện pháp phòng ngừa: Giáo dục truyền thống, tình yêu thương đồng chí. Giao nhiệm vụ rèn luyện đức tính bình tĩnh, kiên nhẫn. Chỉ ra hệ lụy của hành động quân phiệt. Xây dựng môi trường dân chủ.

Phần thứ hai: GỢI Ý BIỆN PHÁP XỬ LÝ CỦA CÁN BỘ CƠ SỞ ĐỐI VỚI NHỮNG TÌNH HUỐNG TƯ TƯỞNG CÓ THỂ NẢY SINH

* NGUYÊN TẮC, QUY TRÌNH XỬ LÝ CƠ BẢN
Tình huống tư tưởng có thể nảy sinh ở đơn vị cơ sở rất đa dạng, phức tạp với nhiều lý do khác nhau, đòi hỏi phải có các phương pháp xử lý phù hợp; quá trình xử lý thường theo một quy trình chung đó là:
Bước 1: Chuẩn bị xử lý
- Hội ý cấp uỷ, chỉ huy đơn vị, nhận định, đánh giá tính chất, tác hại, nguyên nhân, mức độ ảnh hưởng để trao đổi, thống nhất trong chỉ huy và báo cáo cấp trên xin ý kiến chỉ đạo.
- Lựa chọn chủ thể xử lý phù hợp với đối tượng xử lý (chính trị viên, cán bộ các cấp, bạn thân, gia đình...).
- Nhanh chóng thu thập, phân tích, kết luận thông tin bảo đảm chính xác.
- Xác định kế hoạch, nội dung xử lý, dự kiến tình huống, sử dụng các lực lượng tham gia xử lý (Hội đồng quân nhân, tổ tư vấn tâm lý, pháp lý, gia đình, địa phương...).
- Chuẩn bị môi trường, cơ sở vật chất cho việc xử lý.
Bước 2: Quá trình xử lý
- Gặp gỡ, tiếp xúc với đối tượng.
- Sử dụng các phương pháp xử lý cho phù hợp (phân tích thuyết phục; truyền đạt thông tin; hướng dẫn tư duy; ám thị gián tiếp; động viên, phê phán; tác động tình cảm; gợi nhớ).
- Quan sát, ghi nhận các biểu hiện, phản ứng của đối tượng.
- Nhận xét, đánh giá kết quả tác động.
- Điều chỉnh kế hoạch tác động cho phù hợp với thái độ, sự phản ứng của đối tượng.
Bước 3: Kết thúc xử lý
- Tạm thời hay toàn bộ. Nếu đối tượng tác động có chuyển biến tư tưởng tốt, tích cực, hợp tác, quyết tâm khắc phục những biểu hiện tâm lý tư tưởng lệch lạc thì xem như kết thúc toàn bộ, còn kết thúc tạm thời là khi đối tượng có chuyển biến chậm phải tiếp tục thực hiện kế hoạch xử lý.
- Ổn định tình hình đơn vị.
- Tiếp tục theo dõi, tác động ổn định tư tưởng, củng cố lòng tin cho đối tượng.
- Đánh giá kết quả, rút ra bài học kinh nghiệm.
- Tổng hợp tình hình, báo cáo cấp trên, xin ý kiến chỉ đạo tiếp theo.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        sentimentScore: {
            type: Type.NUMBER,
            description: "Điểm số từ -1.0 (rất tiêu cực) đến 1.0 (rất tích cực) đại diện cho tinh thần tổng thể.",
        },
        sentimentCategory: {
            type: Type.STRING,
            enum: [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative],
            description: "Phân loại tinh thần tổng thể.",
        },
        keyThemes: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "Một mảng chứa tối đa 5 chủ đề hoặc vấn đề chính được đề cập trong văn bản.",
        },
        summary: {
            type: Type.STRING,
            description: "Một đoạn tóm tắt súc tích về nội dung ghi chép bằng tiếng Việt.",
        },
        insights: {
            type: Type.STRING,
            description: "Một hoặc hai nhận định sâu sắc về trạng thái tâm lý hoặc các vấn đề tiềm ẩn của quân nhân, viết bằng tiếng Việt. Tập trung vào các dấu hiệu căng thẳng hoặc tinh thần sa sút. Diễn đạt dưới dạng quan sát khách quan."
        },
        officerRecommendations: {
            type: Type.STRING,
            description: "Một đoạn văn gồm các khuyến nghị, biện pháp xử trí cụ thể, có thể hành động ngay cho cán bộ chính trị để hỗ trợ quân nhân này. Bao gồm các gợi ý để bắt đầu cuộc trò chuyện, các hoạt động tiềm năng, hoặc các điểm cần quan sát thêm. Viết bằng tiếng Việt."
        }
    },
    required: ["sentimentScore", "sentimentCategory", "keyThemes", "summary", "insights", "officerRecommendations"]
};

export const analyzeThoughtLog = async (logText: string, sentiment: Sentiment, personnelInfo: PersonnelInfo): Promise<Omit<AnalysisResult, 'date'>> => {
    const systemInstruction = `Bạn là một trợ lý AI chuyên gia tâm lý trong quân đội, được huấn luyện dựa trên các tài liệu và nguyên tắc quản lý tư tưởng, tâm lý quân nhân của Quân đội Nhân dân Việt Nam.

**NHIỆM VỤ CỐT LÕI CỦA BẠN:**
Phân tích bản ghi chép của quân nhân để xác định trạng thái cảm xúc, các mối quan tâm chính và tinh thần tổng thể. Hãy đưa ra phân tích khách quan, nhạy bén và mang tính hỗ trợ.

**TÀI LIỆU NGUỒN BẮT BUỘC:**
Bạn PHẢI dựa vào tài liệu "DẤU HIỆU NHẬN BIẾT HÀNH VI VI PHẠM KỶ LUẬT, MẤT AN TOÀN VÀ GỢI Ý BIỆN PHÁP XỬ LÝ" dưới đây làm cơ sở chính cho mọi phân tích và khuyến nghị. Khi phân tích, hãy liên hệ các biểu hiện trong ghi chép với các "Dấu hiệu nhận biết" và đề xuất các "Biện pháp phòng ngừa" hoặc "Gợi ý biện pháp xử lý" tương ứng từ tài liệu này.

--- TÀI LIỆU THAM KHẢO ---
${VIETNAM_MILITARY_DOCTRINE_REFERENCE}
--- HẾT TÀI LIỆU ---

Toàn bộ phản hồi phải bằng tiếng Việt.`;

    const prompt = `Phân tích bản ghi chép của một quân nhân với các thông tin sau:
- Họ và tên: ${personnelInfo.fullName}
- Cấp bậc: ${personnelInfo.rank}
- Chức vụ: ${personnelInfo.position}
- Đơn vị: ${personnelInfo.unit}

Quân nhân này được cán bộ quản lý đánh giá trạng thái ban đầu là "${sentiment}". Hãy sử dụng thông tin này và các chi tiết cá nhân làm manh mối ngữ cảnh.

BẢN GHI CHÉP:
"${logText}"

Dựa vào các nguyên tắc nghiệp vụ trong tài liệu nguồn đã cung cấp, hãy phân tích văn bản và cung cấp kết quả theo định dạng JSON được yêu cầu. Các khuyến nghị cho cán bộ chính trị phải cụ thể, khả thi và bám sát các gợi ý xử lý trong tài liệu.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.6, // Slightly increased for more nuanced recommendations
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as Omit<AnalysisResult, 'date'>;
        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Không thể lấy phân tích từ dịch vụ AI.");
    }
};
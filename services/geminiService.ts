import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment, PersonnelInfo } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NEW_VIETNAM_MILITARY_DOCTRINE = `
QUÂN ĐỘI NHÂN DÂN VIỆT NAM
TỔNG CỤC CHÍNH TRỊ
SỐ: 775/QĐ-CT
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Hà Nội, ngày 12 tháng 5 năm 2022

QUYẾT ĐỊNH
Ban hành Quy chế công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội nhân dân Việt Nam

CHỦ NHIỆM TỔNG CỤC CHÍNH TRỊ

Căn cứ Quy định số 51-QĐ/TW ngày 29 tháng 12 năm 2021 của Ban Bí thư Trung ương Đảng khóa XIII về tổ chức cơ quan chính trị trong Quân đội nhân dân Việt Nam;
Theo đề nghị của Cục trưởng Cục Tuyên huấn.

QUYẾT ĐỊNH:
Điều 1. Ban hành kèm theo Quyết định này Quy chế công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội nhân dân Việt Nam.
Điều 2. Quyết định này có hiệu lực từ ngày ký.
Điều 3. Cục trưởng Cục Tuyên huấn, Thủ trưởng các cơ quan, đơn vị có liên quan chịu trách nhiệm thi hành Quyết định này.

QUY CHẾ
quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội nhân dân Việt Nam
(Ban hành kèm theo Quyết định số 775/QĐ-CT ngày 12 tháng 5 năm 2022 của Chủ nhiệm Tổng cục Chính trị Quân đội nhân dân Việt Nam).

Chương I
NHỮNG QUY ĐỊNH CHUNG

Điều 1. Phạm vi điều chỉnh, đối tượng áp dụng
1. Quy chế này quy định vị trí, vai trò, mục tiêu, chủ thể, lực lượng, đối tượng; nội dung, phương pháp, nguyên tắc, quy trình, chế độ hoạt động; trách nhiệm của tổ chức, cá nhân tiến hành công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội.
2. Quy chế này áp dụng đối với sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan, binh sĩ (sau đây gọi chung là quân nhân) và các tổ chức trong Quân đội (sau đây gọi chung là cơ quan, đơn vị).
Đối với người làm công tác cơ yếu tại Ban Cơ yếu Chính phủ; công nhân và viên chức quốc phòng, người lao động đang phục vụ trong các cơ quan, đơn vị Quân đội; quân nhân dự bị trong thời gian tập trung huấn luyện, diễn tập, kiểm tra sẵn sàng chiến đấu; dân quân tự vệ đang đào tạo tại các cơ sở đào tạo của Quân đội, huấn luyện tại địa phương, phối thuộc với đơn vị Quân đội trong chiến đấu, phục vụ chiến đấu và làm nhiệm vụ theo quy định của pháp luật; công dân được trưng tập vào phục vụ Quân đội áp dụng như đối với quân nhân.

Điều 2. Quan niệm chung về công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội
1. Tư tưởng quân nhân là quan điểm, thái độ và suy nghĩ của mỗi quân nhân và tập thể quân nhân, phản ánh về các hoạt động quân sự, quốc phòng và các sự kiện chính trị nổi bật trong một thời gian nhất định, mang dấu ấn của chủ thể; biểu hiện ở mức độ, trạng thái, xu hướng vận động, biến đổi về nhận thức, ý thức, quan điểm, lập trường tư tưởng, động cơ, thái độ, trách nhiệm, niềm tin, ý chí thông qua hành vi trong cuộc sống, học tập, công tác của quân nhân, gắn với điều kiện kinh tế - xã hội của đất nước, Quân đội và cơ quan, đơn vị.
2. Công tác quản lý tư tưởng quân nhân là tổng thể các chủ trương, nội dung, biện pháp của các chủ thể, lực lượng quản lý để tổ chức các hoạt động nắm, dự báo, phân tích, đánh giá, giải quyết, định hướng, đấu tranh, ổn định tư tưởng của quân nhân và tập thể quân nhân; phát huy những tư tưởng tiến bộ, tích cực; ngăn chặn, đẩy lùi những tư tưởng tiêu cực, lạc hậu; đảm bảo sự thống nhất, đồng thuận về tư tưởng của quân nhân, tập thể quân nhân, góp phần giữ vững trận địa tư tưởng, xây dựng cơ quan, đơn vị và mọi quân nhân đáp ứng yêu cầu nhiệm vụ được giao.
3. Nắm và định hướng dư luận trong Quân đội là tổng thể các biện pháp quan sát, phát hiện những vấn đề tập thể quân nhân quan tâm để phân tích, đánh giá và kịp thời định hướng, dẫn dắt, hình thành dư luận tích cực, ngăn chặn, khắc phục dư luận tiêu cực bằng những thông tin chính thống thông qua cơ quan, đơn vị và quân nhân có thẩm quyền; đảm bảo sự thống nhất về nhận thức, thái độ, hành vi và phát ngôn của quân nhân theo đúng chủ trương, đường lối, quan điểm của Đảng, chính sách, pháp luật của Nhà nước, quy định của Quân đội, góp phần bảo vệ nền tảng tư tưởng của Đảng, đấu tranh phản bác các quan điểm sai trái, thù địch.

Điều 3. Vị trí, vai trò, mục tiêu của công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội
1. Công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội là một bộ phận quan trọng của công tác tư tưởng, văn hóa; một nội dung quan trọng của hoạt động công tác đảng, công tác chính trị, đặt dưới sự lãnh đạo trực tiếp của cấp uỷ, tổ chức đảng, sự chỉ đạo của chính ủy, chính trị viên (bí thư), người chỉ huy, hướng dẫn của cơ quan chính trị các cấp; được tiến hành thường xuyên, liên tục, đồng thời với các mặt công tác, với sự tham gia của các cơ quan, đơn vị và mọi quân nhân.
2. Công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội trực tiếp góp phần xây dựng phẩm chất chính trị, đạo đức, lối sống, các mối quan hệ tốt đẹp cho từng quân nhân và tập thể quân nhân; bảo đảm cho mọi quân nhân tuyệt đối trung thành với Tổ quốc, với Đảng, Nhà nước và Nhân dân; chấp hành nghiêm chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước, điều lệnh, điều lệ, kỷ luật của Quân đội; góp phần xây dựng tổ chức đảng trong sạch, vững mạnh tiêu biểu, đơn vị vững mạnh toàn diện “Mẫu mực, tiêu biểu”, hoàn thành thắng lợi mọi nhiệm vụ được giao.

Điều 4. Chủ thể lãnh đạo, chỉ đạo; lực lượng thực hiện và phối hợp; đối tượng của công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội
1. Chủ thể lãnh đạo, chỉ đạo, tiến hành công tác quản lý tư tưởng; nắm và định hướng dư luận trong Quân đội là cấp ủy, tổ chức đảng, chính ủy, chính trị viên (bí thư), người chỉ huy, cơ quan chính trị, cán bộ chính trị các cấp.
2. Lực lượng thực hiện là các cơ quan, đơn vị và mọi quân nhân; lực lượng phối hợp là cấp ủy, chính quyền, đoàn thể địa phương, gia đình, người thân của quân nhân.
3. Đối tượng của công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận là quân nhân và tập thể quân nhân.

Điều 5. Nguyên tắc tiến hành công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội
1. Quán triệt sâu sắc và cụ thể hóa chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước, điều lệnh, điều lệ của Quân đội, quy định của cơ quan, đơn vị.
2. Nội dung toàn diện, xác định rõ trọng tâm, trọng điểm, có phương pháp tiếp cận đánh giá, xem xét, giải quyết khách quan, toàn diện, lịch sử, cụ thể và phát triển. Phát huy trí tuệ tập thể kết hợp với tinh thần độc lập, sáng tạo của cá nhân; coi trọng phát huy dân chủ, chống áp đặt, rập khuôn máy móc.
3. Bám sát thực tiễn mọi mặt đời sống xã hội; đặc điểm, tình hình, chức năng, nhiệm vụ; thực trạng tình hình tư tưởng quân nhân và dư luận trong cơ quan, đơn vị và địa bàn đóng quân.
4. Kết hợp giữa “xây” và “chống”, lấy xây dựng, phát huy mặt tích cực, tiến bộ của quân nhân và cơ quan, đơn vị là chính để khắc phục mặt tiêu cực, lạc hậu; chủ động phòng ngừa, đấu tranh với những biểu hiện suy thoái về tư tưởng chính trị, đạo đức, lối sống, “tự diễn biến”, “tự chuyển hóa”.
5. Kết hợp công tác tư tưởng với công tác tổ chức, cán bộ và chính sách. Chủ động dự báo, phân tích, nhận định, đánh giá sát, đúng tình hình và đối tượng; tiến hành thường xuyên, toàn diện, đồng bộ, khoa học, phù hợp với từng đối tượng, bảo đảm thống nhất nhận thức, hành động đúng đắn, đáp ứng yêu cầu nhiệm vụ.
6. Vận dụng, kết hợp các hình thức, phương pháp tiến hành, huy động các lực lượng tham gia. Giải quyết kịp thời, nhanh nhạy, dứt điểm những vấn đề cấp thiết, bức xúc, những tác động của dư luận, tư tưởng tiêu cực nảy sinh trong cơ quan, đơn vị và mỗi quân nhân.

Chương II
NỘI DUNG, QUY TRÌNH TIẾN HÀNH CÔNG TÁC QUẢN LÝ TƯ TƯỞỞNG QUÂN NHÂN

Điều 6. Nội dung quản lý tư tưởng quân nhân
1. Biểu hiện về tư tưởng chính trị: Quan điểm, thái độ, cử chỉ hành vi của quân nhân (nói, viết, tương tác, chia sẻ thông tin...) đối với Chủ nghĩa Mác-Lênin, tư tưởng Hồ Chí Minh, mục tiêu, lý tưởng, chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước, điều lệnh, điều lệ, kỷ luật của Quân đội, chỉ thị, mệnh lệnh của cấp trên; nhiệm vụ của cơ quan, đơn vị và chức trách, nhiệm vụ được giao. Ý thức cảnh giác, phòng ngừa, đấu tranh với âm mưu, thủ đoạn “diễn biến hòa bình”, “phi chính trị hóa” Quân đội của các thế lực thù địch, phản động, cơ hội chính trị.
2. Biểu hiện về phẩm chất đạo đức, lối sống: Ý thức tu dưỡng, rèn luyện đạo đức cách mạng, giữ gìn và phát huy phẩm chất “Bộ đội Cụ Hồ”; lối sống cần, kiệm, liêm, chính, chí công vô tư; trách nhiệm nêu gương. Quan điểm, thái độ, cử chỉ, hành vi của quân nhân trong giao tiếp, ứng xử, giải quyết các mối quan hệ trong đơn vị, gia đình, xã hội; thái độ, trách nhiệm trong đấu tranh với những quân nhân sa vào chủ nghĩa cá nhân, các đảng viên vi phạm 19 điều đảng viên không được làm.
3. Biểu hiện trong thực hiện chức trách, nhiệm vụ: Tinh thần, thái độ, ý thức trách nhiệm trong nghiên cứu, học tập, rèn luyện nâng cao kiến thức trình độ chuyên môn nghiệp vụ, phương pháp, tác phong công tác đáp ứng yêu cầu chức trách, nhiệm vụ được giao.
4. Biểu hiện về ý thức tổ chức, kỷ luật: Ý thức tự giác, trách nhiệm nêu gương của quân nhân trong chấp hành chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước, điều lệnh, điều lệ, kỷ luật của Quân đội, chỉ thị, mệnh lệnh của cấp trên và quy tắc ứng xử, giao tiếp; phát huy dân chủ, tôn trọng và lắng nghe ý kiến đóng góp của tập thể.
5. Biểu hiện về tinh thần đoàn kết nội bộ, đoàn kết quân dân, đoàn kết quốc tế: Ý thức trách nhiệm chăm lo xây dựng, giữ gìn sự đoàn kết, thống nhất trong nội bộ, tình thương yêu đồng chí, đồng đội. Các mối quan hệ của quân nhân với các tổ chức trong đơn vị; với cấp trên, cấp dưới, đồng chí, đồng đội; với nhân dân, gia đình, người thân; với các tổ chức, cá nhân trong xã hội; với cá nhân, tổ chức nước ngoài có liên quan.

Điều 7. Quy trình tiến hành công tác quản lý tư tưởng quân nhân
1. Nắm tư tưởng quân nhân
a) Yêu cầu: Phải tiến hành thường xuyên, toàn diện, có trọng tâm, trọng điểm, thiết thực.
b) Phương pháp: Sử dụng linh hoạt các hình thức, biện pháp nắm tình hình tư tưởng quân nhân, gồm:
- Phương pháp trực tiếp: Quan sát các hành vi, cử chỉ, lời nói, thái độ, lễ tiết, tác phong, trạng thái tâm lý; tiếp xúc trò chuyện, trao đổi; kết quả học tập, công tác, rèn luyện và các hoạt động thực tiễn của quân nhân.
- Phương pháp gián tiếp: Nắm hoàn cảnh gia đình, phong tục, tập quán địa phương và các yếu tố tâm lý của quân nhân thông qua nghiên cứu hồ sơ (lai lịch chính trị của gia đình: ông, bà, cha, mẹ, anh, chị, em bên nội, bên ngoại, bên vợ, bên chồng; các mối quan hệ xã hội của quân nhân; điều kiện kinh tế, chính trị - xã hội của gia đình...); báo cáo, phản ánh của tổ chức đảng, chỉ huy, các tổ chức quần chúng, hội đồng quân nhân, các tổ: “3 người”, “chiến sĩ bảo vệ”, “công tác dân vận”, “tư vấn tâm lý, pháp lý”..., cán bộ, đảng viên, quần chúng nòng cốt được phân công giúp đỡ quân nhân; gia đình, bạn bè, người thân và cấp ủy, chính quyền, đoàn thể, Nhân dân nơi đơn vị đóng quân và quân nhân cư trú; hội đồng hương, những người có mối quan hệ gần gũi với quân nhân; sự tương tác trên mạng xã hội của quân nhân (nếu có).

2. Dự báo tình hình tư tưởng quân nhân
a) Yêu cầu
- Phải tiến hành thường xuyên, chủ động, tập trung vào những thời điểm diễn ra các sự kiện chính trị quan trọng, sự thay đổi về cơ chế, chính sách, những vấn đề xã hội phức tạp, nhạy cảm...; đơn vị có sự thay đổi chức năng, nhiệm vụ, tổ chức, biên chế, vị trí đóng quân, thực hiện nhiệm vụ đột xuất, khó khăn, gian khổ hoặc có vụ việc phức tạp nảy sinh.
- Dự báo được xu hướng tư tưởng của quân nhân trong cơ quan, đơn vị, nhất là những quân nhân thực hiện nhiệm vụ trên hướng chiến lược, quan trọng, vùng sâu, vùng xa, biên giới, biển, đảo; phòng, chống thiên tai, dịch bệnh, tìm kiếm, cứu hộ, cứu nạn; hoạt động độc lập theo nhiệm vụ đặc thù, bộ phận nhỏ lẻ, đóng quân độc lập, phân tán...; nhiệm vụ trọng yếu, cơ mật; những quân nhân có mối quan hệ phức tạp, điều kiện, hoàn cảnh gia đình khó khăn, có vấn đề về tâm lý, sức khỏe (trầm cảm, hoang tưởng, tâm lý yếu, bệnh nan y, bệnh điều trị dài ngày) có chiều hướng tư tưởng chưa thực sự tích cực, trách nhiệm hạn chế, cá biệt, vi phạm pháp luật, kỷ luật.
- Nhận định, đánh giá đúng những yếu tố khách quan, chủ quan, tích cực, tiêu cực tác động đến tư tưởng quân nhân; dự báo được những tư tưởng tích cực và tiêu cực có thể nảy sinh, chiều hướng phát triển, tính chất, mức độ, phạm vi ảnh hưởng đối với từng quân nhân, từng cơ quan, đơn vị và xã hội.
b) Biện pháp
- Căn cứ vào thông tin đã nắm được, tiến hành phân tích, đánh giá sơ bộ, đưa ra nhận định, dự báo về xu hướng tư tưởng của quân nhân.
- Liên kết, tập hợp những biểu hiện, hiện tượng đã được xử lý để so sánh, phân tích, khái quát các biểu hiện tư tưởng để rút ra những điểm giống và khác nhau, những điểm còn mâu thuẫn trong nhận thức tư tưởng và hành động của quân nhân.
- Đưa ra những luận cứ, phân tích, chứng minh để đánh giá thực trạng; đồng thời kiểm chứng thông qua hoạt động thực tiễn để kết luận, dự báo được xu hướng phát triển tư tưởng quân nhân.

3. Phân cấp quản lý, đánh giá, phân loại tư tưởng quân nhân
a) Tiêu chí đánh giá, phân loại tư tưởng quân nhân
Căn cứ những kết luận đã rút ra và đặc điểm, tình hình để phân loại tư tưởng từng đối tượng cụ thể trong cơ quan, đơn vị (sĩ quan, quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng, người lao động, hạ sĩ quan, binh sĩ) cho phù hợp theo các mức: “Tốt”, “Khá”, “Trung bình”, “Yếu”; cụ thể:
- Loại “Tốt”: Có bản lĩnh chính trị vững vàng, tuyệt đối trung thành với Tổ quốc, với Đảng, Nhà nước và Nhân dân, kiên định với mục tiêu, lý tưởng cách mạng của Đảng; phẩm chất chính trị, đạo đức, lối sống tốt, các mối quan hệ trong tập thể quân nhân và quan hệ xã hội lành mạnh; chấp hành nghiêm pháp luật Nhà nước, kỷ luật Quân đội. Viết, nói và làm theo đúng chủ trương, đường lối, quan điểm, nghị quyết của Đảng, chính sách, pháp luật của Nhà nước, điều lệnh, điều lệ của Quân đội và quy định của đơn vị. Tích cực học tập nâng cao trình độ lý luận, chuyên môn nghiệp vụ, năng lực công tác và rèn luyện phấn đấu tốt; hăng hái tham gia có hiệu quả các phong trào thi đua, các cuộc vận động và các hoạt động của đơn vị; đề cao trách nhiệm nêu gương, sẵn sàng nhận và hoàn thành tốt nhiệm vụ được giao. Có ý thức xây dựng mối quan hệ đoàn kết nội bộ, đoàn kết quân dân tốt. Đề cao tự phê bình và phê bình; kiên quyết đấu tranh phản bác các quan điểm sai trái, phản động, bảo vệ nền tảng tư tưởng của Đảng. Không có biểu hiện suy thoái về tư tưởng chính trị, đạo đức, lối sống, “tự diễn biến”, “tự chuyển hóa”; không sa vào chủ nghĩa cá nhân.
- Loại “Khá”: Cơ bản thực hiện được các tiêu chí như loại tốt; nhưng có một số tiêu chí chỉ đạt ở mức độ khá, như: Thái độ chính trị, nhận thức nhiệm vụ, rèn luyện khá; hoàn thành chức trách, nhiệm vụ được giao, nhưng chưa nỗ lực phấn đấu thường xuyên.
- Loại “Trung bình”: Cơ bản đạt được các tiêu chí ở mức khá, nhưng còn một số hạn chế như: Chưa tận tâm, tận lực trong thực hiện nhiệm vụ; chưa đề cao tự phê bình, phê bình; tinh thần tập thể chưa cao, chưa tích cực tham gia vào các phong trào thi đua, các cuộc vận động và hoạt động của đơn vị và chia sẻ, giúp đỡ đồng chí, đồng đội; giải quyết và xử lý các mối quan hệ xã hội chưa tốt; thiếu tự giác tu dưỡng, rèn luyện, vi phạm kỷ luật phải xử lý nhưng không mang tính hệ thống.
- Loại “Yếu” (cá biệt): Có một trong những hạn chế, khuyết điểm như: Nhận thức chính trị hạn chế; nói, viết và làm trái với quan điểm, đường lối của Đảng, chính sách, pháp luật Nhà nước; chấp hành mệnh lệnh của cấp trên không nghiêm, không nhận hoặc không thực hiện nhiệm vụ; có biểu hiện trung bình chủ nghĩa; kết quả hoàn thành nhiệm vụ thấp; tự phê bình, phê bình hạn chế, thấy đúng không bảo vệ, thấy sai không đấu tranh; có mối quan hệ xã hội phức tạp, gây mất đoàn kết nội bộ, mất đoàn kết quân - dân; vi phạm phẩm chất, đạo đức, lối sống, tư cách quân nhân và các quy định về công tác đối ngoại; có biểu hiện suy thoái về tư tưởng chính trị, đạo đức, lối sống, “tự diễn biến”, “tự chuyển hóa”, sa vào chủ nghĩa cá nhân; vi phạm kỷ luật đến mức phải xử lý, chậm sửa chữa, khắc phục khuyết điểm.
* Kết quả đánh giá, phân loại tư tưởng quân nhân quản lý theo quy chế tài liệu mật.
b) Phân cấp quản lý, đánh giá, phân loại tư tưởng quân nhân
- Cấp tiểu đội, trung đội, đại đội (tương đương)
+ Quản lý tư tưởng mọi quân nhân thuộc quyền
+ Đánh giá, phân loại tư tưởng
Cấp tiểu đội (tương đương): Hằng tuần đánh giá từng quân nhân (gắn với sinh hoạt tuần).
Cấp trung đội (tương đương): Hằng tuần, căn cứ vào kết quả nắm tình hình và báo cáo của các đầu mối trực thuộc, tiến hành phân loại tư tưởng đến từng quân nhân (Mẫu 1).
Cấp đại đội (tương đương): Hằng tháng, căn cứ vào kết quả nắm tình hình và báo cáo của các đầu mối trực thuộc, tiến hành phân loại tư tưởng đến từng quân nhân (Mẫu 1); tổng hợp, phân loại tư tưởng theo từng đối tượng: Sĩ quan, quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng, người lao động, hạ sĩ quan, binh sĩ (Mẫu 2).
- Cấp tiểu đoàn (tương đương)
+ Quản lý tư tưởng mọi quân nhân thuộc quyền; nắm chắc cán bộ từ tiểu đội (tương đương) trở lên, quân nhân chuyên nghiệp, đảng viên, những chiến sĩ có thành tích xuất sắc, năng lực tốt, có khó khăn đột xuất hoặc quân nhân cá biệt.
+ Đánh giá, phân loại tư tưởng: Hằng tháng, căn cứ vào kết quả nắm tình hình và báo cáo của các đầu mối trực thuộc, tổng hợp phân loại tư tưởng theo từng đối tượng: Sĩ quan, quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng, người lao động, hạ sĩ quan, binh sĩ (Mẫu 2).
- Cấp trung đoàn, sư đoàn (tương đương)
+ Quản lý tư tưởng
Cấp trung đoàn (tương đương): Quản lý tư tưởng mọi quân nhân thuộc quyền; nắm chắc cán bộ từ trung đội (tương đương) trở lên, những cán bộ tiểu đội và chiến sĩ có thành tích xuất sắc, năng lực tốt, có khó khăn đột xuất hoặc quân nhân cá biệt.
Cấp sư đoàn (tương đương): Quản lý tư tưởng mọi quân nhân thuộc quyền; nắm chắc cán bộ từ đại đội (tương đương) trở lên, những cán bộ trung đội có thành tích xuất sắc, năng lực tốt, có khó khăn đột xuất hoặc quân nhân cá biệt.
+ Đánh giá, phân loại tư tưởng: Hằng tháng, căn cứ kết quả nắm tình hình và báo cáo của các đầu mối trực thuộc, tổng hợp phân loại tư tưởng theo từng đối tượng: Sĩ quan, quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng, người lao động, hạ sĩ quan, binh sĩ (cấp trung đoàn: Mẫu 2, cấp sư đoàn: Mẫu 3).
- Cấp binh chủng, quân đoàn (tương đương)
+ Quản lý tư tưởng tư tưởng mọi quân nhân thuộc quyền; nắm chắc đến từng cán bộ từ tiểu đoàn (tương đương) trở lên, cán bộ đại đội (tương đương) có thành tích xuất sắc, năng lực tốt, có khó khăn đột xuất hoặc quân nhân cá biệt.
+ Đánh giá, phân loại tư tưởng: Hằng tháng, căn cứ kết quả nắm tình hình và báo cáo của các đầu mối trực thuộc, tổng hợp phân loại tư tưởng theo từng đối tượng: Sĩ quan, quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng, người lao động, hạ sĩ quan, binh sĩ (Mẫu 3).
- Cấp quân khu, quân chủng, Bộ đội Biên phòng (tương đương)
+ Quản lý tư tưởng mọi quân nhân thuộc quyền; nắm chắc cán bộ từ trung đoàn (tương đương) trở lên; cán bộ tiểu đoàn (tương đương) có thành tích xuất sắc, năng lực tốt, có khó khăn đột xuất hoặc quân nhân cá biệt.
+ Đánh giá, phân loại tư tưởng: Hằng tháng, căn cứ kết quả nắm tình hình và báo cáo của các đầu mối trực thuộc, tổng hợp phân loại tư tưởng theo từng đối tượng: Sĩ quan, quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng, người lao động, hạ sĩ quan, binh sĩ (Mẫu 3).

4. Định hướng tư tưởng
a) Yêu cầu: Tiến hành thường xuyên, liên tục, kịp thời, mọi lúc, mọi nơi; nhất là sau khi giải quyết những vấn đề nảy sinh về tư tưởng của quân nhân, tập thể quân nhân. Dựa trên cơ sở khoa học, có căn cứ lý luận và thực tiễn tin cậy. Lấy phương pháp giáo dục, thuyết phục, nêu gương là chủ đạo; không áp đặt về nhận thức, tư tưởng đối với quân nhân.
b) Nội dung
- Quan điểm, đường lối của Đảng, chính sách, pháp luật của Nhà nước; truyền thống lịch sử dân tộc, Quân đội, đơn vị; tình yêu quê hương, đất nước, con người; những giá trị nhân văn tốt đẹp của dân tộc; các đặc trưng cơ bản, các chuẩn mực của phẩm chất “Bộ đội Cụ Hồ”, những tấm gương tiêu biểu... Sự phát triển của nhiệm vụ xây dựng và bảo vệ Tổ quốc trong tình hình mới.
- Âm mưu, thủ đoạn chống phá của các thế lực thù địch và yêu cầu cuộc đấu tranh tư tưởng, lý luận hiện nay. Những diễn biến phức tạp của tình hình thế giới, khu vực, xu thế toàn cầu hóa, hội nhập quốc tế trong điều kiện cuộc Cách mạng công nghiệp lần thứ tư đặt ra những yêu cầu mới, thách thức mới đang tác động đến quân nhân.
- Tình hình chính trị, kinh tế - xã hội trong nước, nhất là sự tác động mặt trái nền kinh tế thị trường, những hạn chế, khó khăn, khuyết điểm, yếu kém tồn tại gây bức xúc trong xã hội, làm suy giảm niềm tin của một bộ phận cán bộ, đảng viên và Nhân dân đối với Đảng... tác động tiêu cực tới tư tưởng quân nhân.
- Những diễn biến tư tưởng tích cực, tiêu cực ở đơn vị.
c) Biện pháp
- Cấp ủy, chỉ huy, cơ quan chức năng các cấp chủ động đưa ra quan điểm chính thống để định hướng nhận thức, thái độ, hành vi, phát ngôn đúng chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước, nhằm ổn định tình hình tư tưởng, củng cố niềm tin, tạo sự đồng thuận trong tập thể quân nhân.
- Vận dụng linh hoạt các hình thức tuyên truyền, giáo dục chính trị; thông qua thực tiễn thực hiện nhiệm vụ, phong trào thi đua Quyết thắng, các cuộc vận động, kỷ niệm các ngày lễ lớn của dân tộc, ngày truyền thống của đơn vị; hoạt động các thiết chế văn hóa tại đơn vị, các mô hình bổ trợ giáo dục chính trị... để bồi dưỡng nâng cao nhận thức và kỹ năng sống cho quân nhân.
- Phát huy vai trò tổ chức đảng, chỉ huy, các tổ chức quần chúng, hội đồng quân nhân, đội ngũ báo cáo viên, tuyên truyền viên, cán bộ, đảng viên, phối hợp với gia đình, người thân, bạn bè của quân nhân.
- Chấp hành nghiêm quy định của Bộ Quốc phòng trong phát ngôn và cung cấp thông tin cho báo chí, bảo đảm nhất quán, kịp thời định hướng tư tưởng, dư luận.

5. Giải quyết tư tưởng
a) Yêu cầu: Linh hoạt, nhạy bén, chính xác, kịp thời, dứt điểm, không để kéo dài làm ảnh hưởng tiêu cực đến tư tưởng quân nhân, dư luận trong cơ quan, đơn vị. Nội dung, phương pháp phải phù hợp trình độ học vấn, hiểu biết xã hội, đặc điểm tâm lý, dân tộc, tôn giáo của từng đối tượng; quan tâm hướng dẫn, động viên và tạo điều kiện thuận lợi để quân nhân phấn đấu, tiến bộ. Giải quyết theo đúng pháp luật Nhà nước, điều lệnh, điều lệ của Quân đội, đúng tính chất, mức độ của các biểu hiện tư tưởng; bảo đảm thấu tình, đạt lý; lấy phương pháp giáo dục thuyết phục quân nhân là chủ đạo.
b) Biện pháp
- Giải quyết tư tưởng trong hoạt động thường xuyên của đơn vị
+ Đối với tư tưởng tích cực: Kịp thời biểu dương, khen thưởng những tập thể, cá nhân tiêu biểu, xuất sắc, hoàn thành tốt nhiệm vụ, nhất là nhiệm vụ trên hướng chiến lược, quan trọng, vùng sâu, vùng xa, biên giới, biển, đảo; phòng, chống thiên tai, dịch bệnh, tìm kiếm, cứu hộ, cứu nạn; hoạt động độc lập theo nhiệm vụ đặc thù, bộ phận nhỏ lẻ, đóng quân độc lập, phân tán...
+ Đối với tư tưởng tiêu cực: Nắm chắc bản chất, chủ động giáo dục (giáo dục chung, giáo dục riêng), có biện pháp ngăn chặn, không để các biểu hiện tư tưởng tiêu cực xảy ra và lan rộng trong đơn vị.
- Quy trình chung giải quyết các tình huống tư tưởng tiêu cực nảy sinh: (1) Hội ý cấp uỷ, chỉ huy nhận định, đánh giá tình hình, xác định nguyên nhân, bản chất sự việc; (2) Phân công cơ quan và cán bộ chuyên ngành thâm nhập, điều tra, xác minh làm rõ bản chất sự việc; (3) Sinh hoạt đơn vị, định hướng dư luận, ổn định tình hình; (4) Họp cấp uỷ, chỉ huy bàn bạc, thống nhất biện pháp tháo gỡ, giải quyết; (5) Chỉ đạo sinh hoạt kiểm điểm trách nhiệm, xử lý kỷ luật đúng điều lệnh, điều lệ Quân đội; (6) Phân công trách nhiệm trong cấp uỷ, chỉ huy và từng cán bộ, đảng viên trong từng công việc, từng bước xử lý để ổn định tình hình; (7) Sinh hoạt đơn vị kết luận, thông báo kết quả xử lý, giải quyết; (8) Rút kinh nghiệm trong cấp uỷ, chỉ huy nhận định xu hướng diễn biến tư tưởng và những biện pháp tiếp theo bảo đảm giải quyết dứt điểm, ổn định tình hình; (9) Tổng hợp báo cáo.
Trong quá trình giải quyết, nếu có tình huống phức tạp phải kịp thời báo cáo xin ý kiến chỉ đạo của cấp trên; nếu sự việc liên quan tới địa phương, quá trình điều tra, xác minh phải thực hiện theo đúng chức năng, thẩm quyền...; phân công cán bộ liên hệ, phối hợp chặt chẽ với cấp ủy, chính quyền, cơ quan chức năng địa phương liên quan, giải quyết đúng theo quy định của pháp luật Nhà nước, điều lệnh, điều lệ của Quân đội và cơ chế, quy định về phối hợp giữa các lực lượng.

6. Đấu tranh tư tưởng
- Phát huy vai trò các kênh thông tin, dư luận tích cực; chủ động tuyên truyền định hướng, đấu tranh phản bác các biểu hiện tiêu cực, lệch lạc ảnh hưởng đến tư tưởng quân nhân.
- Phân loại những quân nhân, nhóm quân nhân có tư tưởng tiêu cực để giáo dục, định hướng.
- Kết hợp giáo dục chung và giáo dục riêng, chú trọng quân nhân cá biệt.
- Thường xuyên gần gũi, tạo điều kiện thuận lợi giúp đỡ và tích cực sử dụng các biện pháp tổng hợp cùng cấp ủy, chính quyền, đoàn thể địa phương, gia đình, bạn bè, người có uy tín... để giáo dục, cảm hóa quân nhân.
- Kịp thời phát hiện, nhận diện đấu tranh với những biểu hiện sau:
+ Quan điểm sai trái, thù địch; biểu hiện mơ hồ, mất cảnh giác; thông tin không chính thống, tiêu cực và mọi biểu hiện nhận thức tiêu cực, lạc hậu ảnh hưởng xấu đến tâm lý, tư tưởng của quân nhân.
+ Biểu hiện suy thoái về tư tưởng chính trị, đạo đức, lối sống, “tự diễn biến”, “tự chuyển hóa”; vi phạm 19 điều đảng viên không được làm và những quân nhân sa vào chủ nghĩa cá nhân.
+ Biểu hiện vô ý thức tổ chức kỷ luật, không chấp hành mệnh lệnh của người chỉ huy, nhiệm vụ được giao; khi xảy ra vụ việc có biểu hiện che dấu khuyết điểm, báo cáo không kịp thời, thiếu trung thực; xử lý kỷ luật chưa nghiêm...; quân phiệt, hành hung đồng đội, mất đoàn kết với Nhân dân; đào bỏ ngũ, vắng mặt trái phép; tham gia tệ nạn xã hội, ma túy, lô đề, vay nặng lãi...; chấp hành không nghiêm quy định dẫn đến mất an toàn trong sẵn sàng chiến đấu, huấn luyện, công tác, lao động sản xuất và tham gia giao thông...
+ Biểu hiện bè phái, cục bộ, độc đoán, gia trưởng, mất đoàn kết, đoàn kết xuôi chiều, quan liêu, mệnh lệnh, xa rời cấp dưới, chưa thực sự gương mẫu để cấp dưới noi theo; e dè, nể nang, thấy đúng không bảo vệ, thấy sai không đấu tranh; thờ ơ, vô cảm với đơn vị, đồng chí, đồng đội.
+ Những biểu hiện mâu thuẫn, bất mãn với cơ quan, đơn vị, đồng đội, gia đình, bạn bè, người thân; muốn tự hủy hoại bản thân, tự tử, tự sát, tự thương...

Chương III
NỘI DUNG, PHƯƠNG PHÁP NẮM VÀ ĐỊNH HƯỚNG DƯ LUẬN TRONG QUÂN ĐỘI

Điều 8. Nội dung, phương pháp nắm dư luận
1. Nội dung
- Những vấn đề, sự kiện có tính thời sự trong nước và quốc tế, đặc biệt là đối với đường lối, chủ trương của Đảng, chính sách, pháp luật của Nhà nước và hoạt động của Quân đội được quân nhân và các tầng lớp Nhân dân quan tâm.
- Dư luận của quân nhân về thực hiện chức năng, nhiệm vụ của Quân đội; về mối quan hệ quân nhân với Nhân dân; về thực hiện chế độ, chính sách...
- Thông tin báo chí và dư luận trên không gian mạng.
- Các luồng thông tin, các quan điểm sai trái, tiêu cực và hoạt động chống phá Đảng, Nhà nước, Quân đội của các thế lực thù địch, phản động, cơ hội chính trị.
2. Phương pháp
a) Phương pháp trực tiếp
- Thông qua quan sát, trao đổi, tọa đàm, phỏng vấn, tiếp xúc trực tiếp với quân nhân.
- Thông qua sinh hoạt các tổ chức (tổ chức đảng, tổ chức chỉ huy, các tổ chức quần chúng, hội đồng quân nhân); các hoạt động sẵn sàng chiến đấu, huấn luyện, học tập, công tác.
- Trực tiếp nghe ý kiến phản ánh của các tổ: “3 người”, “chiến sĩ bảo vệ”, “công tác dân vận”, “tư vấn tâm lý, pháp lý”...
- Thông qua phản ánh, tiếp xúc trực tiếp với cấp ủy, chính quyền, các tổ chức chính trị - xã hội, các đoàn thể, các tầng lớp Nhân dân, các chức sắc, chức việc tôn giáo, các già làng, trưởng bản, người có uy tín trong cộng đồng; gia đình, người thân; những người có bất đồng chính kiến.
b) Phương pháp gián tiếp
- Thông qua tổ chức các hội nghị trong và ngoài Quân đội: Hội nghị sơ kết, tổng kết, báo cáo viên; giao ban, sinh hoạt của các tổ chức...
- Thông qua nghiên cứu, phân tích, tổng hợp các báo cáo định kỳ của tổ chức đảng, chính quyền, các tổ chức quần chúng và hội đồng quân nhân.
- Thông qua công tác dân vận, phối hợp nắm tình hình địa bàn, lĩnh vực công tác; đội ngũ cán bộ chính trị, cán bộ tuyên huấn làm công tác dư luận xã hội các cấp trong Quân đội.
- Thông qua các cuộc điều tra, thăm dò dư luận đối với quân nhân ở các cơ quan, đơn vị trong Quân đội.
- Thông qua các phương tiện thông tin đại chúng, điện thoại, Internet, mạng xã hội.

Điều 9. Phương pháp định hướng dư luận
1. Phương pháp trực tiếp
- Thông qua tuyên truyền giáo dục, vận động, thuyết phục để tác động làm thay đổi nhận thức, thái độ, hành vi của quân nhân theo hướng tích cực.
- Thông qua sinh hoạt đơn vị, hội họp, họp báo; uy tín của cán bộ, đảng viên, vai trò của đội ngũ báo cáo viên, tuyên truyền viên; các tổ chức quần chúng và hội đồng quân nhân... nhằm kịp thời truyền đạt thông tin chính thống đã được chọn lọc.
- Những sự kiện phức tạp, nhạy cảm, vụ việc có tính chất nghiêm trọng thu hút sự quan tâm, chú ý của số đông quân nhân và dư luận xã hội... cần chủ động phân công cán bộ chủ trì, phối hợp thông tin định hướng dư luận.
2. Phương pháp gián tiếp
- Thông qua các phương tiện thông tin đại chúng, Internet, mạng xã hội (Facebook, Zalo, Twitter...) nhằm tăng cường phổ biến các thông tin chính thống, đấu tranh phản bác các quan điểm tiêu cực, sai trái, thù địch...
- Cung cấp thông tin chính thống, tạo dư luận tích cực để định hướng tư tưởng, dư luận trong cơ quan, đơn vị.
- Kết hợp chặt chẽ giữa định hướng tư tưởng với phối hợp giải quyết dứt điểm những vấn đề làm nảy sinh tư tưởng tiêu cực.

Chương IV
CHẾ ĐỘ, TRÁCH NHIỆM TIẾN HÀNH CÔNG TÁC QUẢN LÝ TƯ TƯỞNG QUÂN NHÂN; NẮM VÀ ĐỊNH HƯỚNG DƯ LUẬN TRONG QUÂN ĐỘI

Điều 10. Chế độ công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội
1. Chế độ hội nghị, giao ban, báo cáo, thông báo
Chế độ công tác quản lý tư tưởng, nắm và định hướng dư luận quân nhân của cấp ủy (chi bộ), chính ủy (chính trị viên), người chỉ huy các cấp được thực hiện cùng với thực hiện chế độ hội nghị (sinh hoạt), giao ban, báo cáo, thông báo của cấp ủy (chi bộ), chỉ huy các cấp trong Quân đội; trong đó chú ý:
a) Cấp tiểu đội: Tiểu đội trưởng phản ánh, báo cáo tình hình tư tưởng, dư luận hằng ngày với trung đội trưởng trong giao ban (hội ý); thông báo trong các buổi sinh hoạt của tiểu đội.
b) Cấp trung đội: Trung đội trưởng phản ánh, báo cáo tình hình tư tưởng, dư luận hằng ngày với chính trị viên, chỉ huy đại đội trong giao ban (hội ý); thông báo trong các buổi sinh hoạt của trung đội.
c) Cấp đại đội (tương đương): Chính trị viên đại đội (bí thư) tổng hợp, báo cáo tình hình tư tưởng, dư luận hằng tuần với chính trị viên, chỉ huy tiểu đoàn (tương đương) trong giao ban (hội ý); hằng tháng báo cáo với cấp ủy theo quy định. Thông báo trong sinh hoạt đại đội.
d) Cấp tiểu đoàn (tương đương): Chính trị viên tiểu đoàn (bí thư) tổng hợp, báo cáo tình hình tư tưởng, dư luận hằng tuần với cơ quan chính trị trung đoàn; hằng tháng báo cáo đảng ủy tiểu đoàn theo quy định. Thông báo trong sinh hoạt tiểu đoàn.
e) Cấp trung đoàn (tương đương) đến cấp trực thuộc Bộ Quốc phòng: Chính ủy, chính trị viên, bí thư (hoặc cơ quan chính trị) tổng hợp, báo cáo tình hình tư tưởng, dư luận với cấp ủy cấp mình, cơ quan chính trị cấp trên và thông báo đến cấp dưới theo quy định.
Riêng cấp trực thuộc Bộ Quốc phòng: Cơ quan tuyên huấn (cơ quan chính trị nơi không biên chế cơ quan tuyên huấn) tổng hợp, báo cáo tình hình tư tưởng, dư luận với Cục Tuyên huấn: Hằng tuần qua hệ thống thông tin chỉ huy; hằng tháng theo quy định báo cáo công tác đảng, công tác chính trị (trong báo cáo công tác tuyên huấn). Thông báo đến các cơ quan, đơn vị thuộc quyền theo quy định.
Báo cáo trong các đợt trực sẵn sàng chiến đấu cao điểm dịp lễ tết, sự kiện trọng đại: Thực hiện theo quy định của cơ quan chủ trì triển khai nhiệm vụ.
i) Báo cáo đột xuất
Trong trường hợp xảy ra vụ việc có tính chất nghiêm trọng, phức tạp, nhạy cảm về quốc phòng, an ninh, trật tự an toàn xã hội hoặc tình huống nảy sinh về mối quan hệ quân dân, quân nhân vi phạm kỷ luật dân vận hoặc hiện tượng, sự kiện, vụ việc xảy ra có liên quan đến pháp luật (được phản ánh trên báo chí, không gian mạng...) thu hút sự quan tâm, chú ý của quân nhân và dư luận xã hội... người chỉ huy cơ quan, đơn vị phải kịp thời báo cáo bằng hình thức nhanh nhất với cấp trên trực tiếp, đến Thủ trưởng Bộ Quốc phòng, Bộ Tổng Tham mưu, Tổng cục Chính trị và các cơ quan chức năng Bộ Quốc phòng; đề xuất chủ trương, biện pháp giải quyết kịp thời, hiệu quả theo 3 bước: (1) Báo cáo nhanh bằng phương tiện thông tin liên lạc; (2) Báo cáo bằng văn bản khi đã có đủ thông tin; (3) Báo cáo bằng văn bản khi có kết luận và kết quả xử lý của đơn vị; dự báo tình hình; kiến nghị, đề xuất.
Phối hợp chặt chẽ với cấp ủy, chính quyền, các ban, ngành, đoàn thể của địa phương nơi đơn vị đóng quân và nơi cư trú của quân nhân nhanh chóng giải quyết sự việc theo đúng quy định; kịp thời định hướng tư tưởng, dư luận, ổn định tình hình; không để kẻ xấu lợi dụng kích động, chống phá.
k) Chế độ hội nghị giao ban công tác tư tưởng do Cục Tuyên huấn chủ trì với các đơn vị trực thuộc Bộ Quốc phòng: Căn cứ tình hình cụ thể để tổ chức hội nghị theo hình thức trực tiếp (hoặc trực tuyến).
- Hằng tháng, Cục Tuyên huấn chủ trì tổ chức giao ban đối với cơ quan Tuyên huấn các đơn vị trực thuộc Bộ Quốc phòng đóng quân trên địa bàn thành phố Hà Nội; căn cứ tình hình cụ thể, có thể triệu tập đến cơ quan Tuyên huấn đơn vị trực thuộc Bộ Quốc phòng khu vực phía Bắc (từ Quân khu 4 trở ra).
- 6 tháng và cuối năm, Cục Tuyên huấn chủ trì tổ chức giao ban đối với các cơ quan, đơn vị trực thuộc Bộ Quốc phòng đóng quân trên địa bàn các tỉnh miền Trung và Tây Nguyên, miền Nam (từ Quân khu 4 trở vào). Căn cứ tình hình cụ thể có thể triệu tập mở rộng đến đại biểu Thủ trưởng cơ quan Chính trị, cơ quan Tuyên huấn một số sư đoàn, Bộ Chỉ huy quân sự (Bộ đội Biên phòng) tỉnh, Vùng Hải quân, Vùng Cảnh sát biển, trung (lữ đoàn) và học viện, nhà trường trên địa bàn.
2. Chế độ sơ kết, tổng kết rút kinh nghiệm
a) Cấp tiểu đội, trung đội, đại đội (tương đương): Một tháng một lần, tổ chức kết hợp lồng ghép vào các buổi sinh hoạt của đơn vị (hoặc tiến hành riêng).
b) Cấp tiểu đoàn (tương đương): Ba tháng một lần.
c) Cấp trung đoàn (tương đương): Ba tháng một lần.
d) Cấp sư đoàn (tương đương): Một năm một lần (có thể lồng ghép vào hội nghị sơ kết, tổng kết CTĐ, CTCT hoặc tiến hành riêng).
e) Cấp trực thuộc Bộ Quốc phòng: 5 năm hai lần.
g) Cấp toàn quân: 5 năm một lần.
3. Chế độ kiểm tra
a) Định kỳ 6 tháng, một năm, Cục Tuyên huấn xây dựng kế hoạch và tiến hành kiểm tra công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận ở một số cơ quan, đơn vị trong toàn quân. Kiểm tra đột xuất khi có vấn đề nảy sinh.
b) Căn cứ đặc điểm, tình hình cụ thể và theo thẩm quyền, cấp ủy, chỉ huy, cơ quan chính trị các đơn vị xây dựng kế hoạch và tiến hành kiểm tra đối với các cơ quan, đơn vị thuộc quyền.

Điều 11. Trách nhiệm tiến hành công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội
1. Trách nhiệm của cấp ủy, chính ủy, chính trị viên (bí thư), chỉ huy các cấp
a) Cấp ủy, tổ chức đảng các cấp thường xuyên lãnh đạo, chỉ đạo tổ chức thực hiện trong cơ quan, đơn vị thuộc quyền, chịu trách nhiệm trước cấp ủy, tổ chức đảng, chính ủy, chính trị viên (bí thư), người chỉ huy cấp trên về kết quả công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội.
b) Chính ủy, chính trị viên (bí thư) và người chỉ huy chịu trách nhiệm trước cấp ủy cấp mình và cấp ủy, chỉ huy cấp trên về kết quả công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội.
- Định kỳ tổ chức tập huấn, bồi dưỡng nghiệp vụ, nâng cao năng lực, kinh nghiệm tiến hành công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội cho đội ngũ cán bộ thuộc quyền. Chỉ đạo, hướng dẫn thực hiện phù hợp với đặc điểm, tình hình, nhiệm vụ của cơ quan, đơn vị và đối tượng quản lý.
- Thực hiện chế độ nắm tình hình đơn vị cơ sở theo quy định; sâu sát, gần gũi, hiểu biết quân nhân; tôn trọng và lắng nghe ý kiến của quân nhân; đề cao trách nhiệm nêu gương, ý thức tự phê bình và phê bình; quan tâm bảo đảm tốt đời sống vật chất, tinh thần, chăm lo sức khoẻ của quân nhân.
- Thường xuyên quản lý tư tưởng quân nhân; nhận xét, đánh giá tình hình tư tưởng, đạo đức, lối sống của các quân nhân thuộc quyền; nắm và định hướng dư luận, giữ vững sự đoàn kết, thống nhất trong nội bộ.
- Chủ động dự báo, kịp thời phát hiện, giải quyết dứt điểm những vấn đề tư tưởng nảy sinh ngay từ cơ sở; báo cáo theo quy định; hạn chế thấp nhất sự tác động tiêu cực đến tư tưởng quân nhân và dư luận trong cơ quan, đơn vị; không để phần tử xấu lợi dụng xuyên tạc, chống phá.

2. Trách nhiệm của các cơ quan, đơn vị, tổ chức, lực lượng
a) Cơ quan Chính trị các cấp
- Chủ trì tham mưu với cấp ủy, chỉ huy đơn vị về công tác lãnh đạo, chỉ đạo, tổ chức thực hiện công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội.
- Chủ động nắm, dự báo tình hình, kịp thời thông tin định hướng tư tưởng quân nhân và dư luận xã hội có liên quan đến nhiệm vụ quân sự, quốc phòng; quá trình triển khai, thực hiện nhiệm vụ chính trị và những nội dung có liên quan đến cơ quan, đơn vị theo quy định. Tham mưu, đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy những chủ trương, biện pháp giải quyết.
b) Cơ quan (cán bộ) Tuyên huấn các cấp
- Thường xuyên nắm thông tin có liên quan đến Quân đội; thực hiện chức năng nghiên cứu, tham mưu với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy biện pháp lãnh đạo, chỉ đạo, hướng dẫn, kiểm tra và trực tiếp tham gia công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội; chấp hành nghiêm quy định phát ngôn và cung cấp thông tin cho báo chí.
- Phối hợp với các cơ quan chức năng cùng cấp (Ủy ban kiểm tra đảng, Tổ chức, Dân vận, Bảo vệ an ninh, Tác chiến, Quân huấn, Điều tra hình sự, Thanh tra quốc phòng...) để nắm, phản ánh và tham mưu, đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy những chủ trương, biện pháp giải quyết, định hướng tư tưởng quân nhân và dư luận có liên quan đến quá trình triển khai thực hiện nhiệm vụ.
- Tổng hợp tình hình và kết quả phân loại tư tưởng ở các đơn vị, báo cáo theo quy định.
- Định kỳ tham mưu tổ chức tập huấn, bồi dưỡng nghiệp vụ công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội.
- Cục Tuyên huấn xây dựng báo cáo tình hình tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội báo cáo Thủ trưởng Tổng cục Chính trị, Lãnh đạo Bộ Quốc phòng và Ban Tuyên giáo Trung ương theo quy định.
c) Cơ quan (cán bộ) Bảo vệ an ninh các cấp: Phối hợp với các cơ quan chức năng trong và ngoài Quân đội chủ động nắm chắc tình hình địa bàn; tham mưu, đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy, thủ trưởng cơ quan chính trị chỉ đạo, hướng dẫn cơ quan, đơn vị làm tốt công tác giáo dục nâng cao ý thức cảnh giác, bảo vệ chính trị nội bộ, quản lý tình hình chấp hành kỷ luật, phòng chống “tự diễn biến”, “tự chuyển hóa”, đấu tranh làm thất bại âm mưu, thủ đoạn, hoạt động chống phá của các thế lực thù địch, phản động.
d) Cơ quan (cán bộ) Dân vận các cấp: Phối hợp chặt chẽ với cấp ủy, chính quyền, các ban, ngành, đoàn thể địa phương nơi đơn vị đóng quân và nơi cư trú của quân nhân nắm chắc tình hình an ninh chính trị, trật tự, an toàn xã hội, các mối quan hệ và trách nhiệm công dân của mỗi quân nhân; đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy, cơ quan chính trị chỉ đạo, hướng dẫn cơ quan, đơn vị làm tốt công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội và trên địa bàn đóng quân.
e) Các cơ quan chức năng (Thanh tra Quốc phòng, Ủy ban kiểm tra đảng, các cơ quan tư pháp): Phối hợp với cơ quan Chính trị, cơ quan Tham mưu cùng cấp để nắm, phản ánh và đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy những chủ trương, biện pháp quản lý tư tưởng; nắm và định hướng dư luận trong Quân đội có liên quan đến quá trình triển khai thực hiện công tác thanh tra, kiểm tra, giám sát, giải quyết khiếu nại, tố cáo, thi hành kỷ luật đảng và các vụ việc sai phạm, tiêu cực xảy ra trong nội bộ cơ quan, đơn vị và địa bàn đóng quân.
g) Cơ quan, đơn vị làm công tác an ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao trong Quân đội: Phối hợp với các cơ quan chức năng và đơn vị cùng cấp để nắm, phản ánh và đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy những chủ trương, biện pháp quản lý tư tưởng quân nhân; nắm và định hướng dư luận xã hội có liên quan đến quá trình bảo vệ nền tảng tư tưởng của Đảng, đấu tranh, phản bác các quan điểm sai trái, thù địch, thông tin xấu độc trên không gian mạng.
h) Cơ quan, đơn vị làm công tác hậu cần, kỹ thuật, tài chính, quân y, chính sách: Phối hợp nắm, phản ánh và tham mưu, đề xuất với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy những chủ trương, biện pháp quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội có liên quan đến quá trình triển khai thực hiện nhiệm vụ công tác hậu cần, kỹ thuật, tài chính, y tế, nhất là những vấn đề tư tưởng nảy sinh trong công tác bảo đảm chế độ chính sách, quản lý, chăm sóc, bảo vệ sức khỏe quân nhân và chính sách hậu phương Quân đội.
i) Các cơ quan báo chí trong Quân đội có trách nhiệm thường xuyên, kịp thời cung cấp thông tin, định hướng dư luận xã hội tích cực; tuyên truyền chủ trương, đường lối của Đảng, chính sách, pháp luật của Nhà nước, chỉ thị, nghị quyết của Quân ủy Trung ương, Bộ Quốc phòng; đẩy mạnh tuyên truyền, nhân rộng điển hình tiên tiến, gương người tốt, việc tốt; tích cực tham gia bảo vệ nền tảng tư tưởng của Đảng, đấu tranh phản bác các quan điểm sai trái.
k) Các học viện, trường trong Quân đội: Nghiên cứu, bổ sung khung chương trình đào tạo về nội dung bồi dưỡng kỹ năng, phương pháp quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội cho các đối tượng học viên phù hợp với mô hình, mục tiêu đào tạo, sát với tình hình thực tế ở đơn vị cơ sở.
l) Hội đồng quân nhân và các tổ chức quần chúng: Chủ động phối hợp nắm, định hướng, giải quyết tình hình tư tưởng của quân nhân, đoàn viên, hội viên trong đơn vị. Định kỳ báo cáo với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy và cơ quan cấp trên trực tiếp về kết quả công tác quản lý tư tưởng của đoàn viên, hội viên; nắm và định hướng dư luận trong cơ quan, đơn vị theo chức năng, nhiệm vụ.

Điều 12. Trách nhiệm của quân nhân
1. Tham gia thực hiện công tác quản lý tư tưởng quân nhân; nắm và định hướng dư luận trong Quân đội; làm công tác tư tưởng cho bản thân, đồng đội, người thân, gia đình, Nhân dân nơi cư trú và nơi đơn vị đóng quân.
2. Thường xuyên học tập, rèn luyện nâng cao bản lĩnh chính trị, phẩm chất đạo đức, lối sống, trình độ chuyên môn, nghiệp vụ; tự giác ghép mình vào tổ chức; xác định rõ tư tưởng, khắc phục mọi khó khăn, đề cao cảnh giác cách mạng, không ngừng tu dưỡng, rèn luyện, phấn đấu, có đủ năng lực, trình độ để tự nhận biết, xem xét, đánh giá, giải quyết hiệu quả các tình huống nảy sinh bảo đảm khoa học, đúng bản chất sự việc, hiện tượng. Tích cực, chủ động chia sẻ, động viên, giúp đỡ đồng chí, đồng đội khắc phục khó khăn, yên tâm công tác.
3. Báo cáo kịp thời, trung thực, đầy đủ về nhận thức tư tưởng chính trị, phẩm chất đạo đức, lối sống, tình hình sức khỏe, các mối quan hệ xã hội phức tạp của bản thân và đồng đội; những vấn đề mới phát sinh trong quan hệ, hoàn cảnh gia đình... Khi phát hiện những vụ việc, tình huống tư tưởng phức tạp và dư luận tiêu cực trong đơn vị phải chủ động báo cáo, phản ánh với cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy để có chủ trương, biện pháp giải quyết kịp thời, hiệu quả.
4. Đề cao tự phê bình và phê bình, kịp thời đấu tranh, khắc phục những biểu hiện tư tưởng lệch lạc, ngăn ngừa tư tưởng tiêu cực, lạc hậu để tiến bộ, trưởng thành. Nghiêm túc tiếp thu, sửa chữa, khắc phục những khuyết điểm, hạn chế đã được cá nhân, tổ chức góp ý phê bình.

Chương V
ĐIỀU KHOẢN THI HÀNH

Điều 13. Khen thưởng, xử lý vi phạm
1. Cơ quan, đơn vị và quân nhân có thành tích trong công tác quản lý tư tưởng; nắm và định hướng dư luận trong Quân đội được khen thưởng theo quy định của Bộ Quốc phòng.
2. Cơ quan, đơn vị và quân nhân vi phạm các quy định của Quy chế này, tùy theo tính chất, mức độ vi phạm sẽ bị xử lý kỷ luật theo điều lệnh, điều lệ của Quân đội.

Điều 14. Tổ chức thực hiện
1. Cấp ủy, chính ủy, chính trị viên (bí thư), người chỉ huy, cơ quan chính trị các cấp và các cơ quan, đơn vị có trách nhiệm lãnh đạo, chỉ đạo và tổ chức thực hiện Quy chế này.
2. Cục trưởng Cục Tuyên huấn chịu trách nhiệm hướng dẫn, kiểm tra, đôn đốc các đơn vị trong toàn quân thực hiện Quy chế này.

Phụ lục
MẪU TỔNG HỢP PHÂN LOẠI TƯ TƯỞNG QUÂN NHÂN
...
`;

const OLD_VIETNAM_MILITARY_DOCTRINE_REFERENCE = `
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

const VIETNAM_MILITARY_DOCTRINE_REFERENCE = `
**TÀI LIỆU 1: QUY CHẾ CHÍNH THỨC VỀ CÔNG TÁC QUẢN LÝ TƯ TƯỞNG (QUYẾT ĐỊNH SỐ 775/QĐ-CT)**
${NEW_VIETNAM_MILITARY_DOCTRINE}

**TÀI LIỆU 2: DẤU HIỆU NHẬN BIẾT VÀ GỢI Ý BIỆN PHÁP XỬ LÝ (TÀI LIỆU THAM KHẢO)**
${OLD_VIETNAM_MILITARY_DOCTRINE_REFERENCE}
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
Bạn PHẢI dựa vào hai tài liệu sau làm cơ sở chính cho mọi phân tích và khuyến nghị.
- TÀI LIỆU 1 cung cấp quy chế và quy trình chính thức.
- TÀI LIỆU 2 cung cấp các ví dụ cụ thể về dấu hiệu và biện pháp xử lý.
Hãy kết hợp cả hai để đưa ra đánh giá toàn diện, liên hệ các biểu hiện trong ghi chép với các "Dấu hiệu nhận biết" và đề xuất các "Biện pháp phòng ngừa" hoặc "Gợi ý biện pháp xử lý" tương ứng.

--- TÀI LIỆU NGUỒN ---
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
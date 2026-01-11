
import { CentralDatabase, HistoryEntry, Sentiment } from '../types';

const STORAGE_KEY = 'MILITARY_CENTRAL_DATABASE';

// Ánh xạ nén sang mảng để tiết kiệm dung lượng
const compressEntry = (e: HistoryEntry) => [
  e.info.fullName, e.info.dob, e.info.rank, e.info.position, e.info.unit,
  e.analysis.sentimentScore, e.analysis.sentimentCategory, e.analysis.keyThemes,
  e.analysis.summary, e.analysis.insights, e.analysis.officerRecommendations, e.analysis.date,
  e.operatorUsername, e.operatorName, e.operatorRank, e.operatorPosition, e.operatorUnit,
  e.timestamp
];

const decompressEntry = (arr: any[]): HistoryEntry => ({
  info: { fullName: arr[0], dob: arr[1], rank: arr[2], position: arr[3], unit: arr[4] },
  analysis: { 
    sentimentScore: arr[5], sentimentCategory: arr[6] as Sentiment, keyThemes: arr[7], 
    summary: arr[8], insights: arr[9], officerRecommendations: arr[10], date: arr[11] 
  },
  operatorUsername: arr[12], operatorName: arr[13], operatorRank: arr[14], 
  operatorPosition: arr[15], operatorUnit: arr[16],
  timestamp: arr[17]
});

export const storageService = {
  getDatabase: (): CentralDatabase => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { history: {}, activities: [] };
  },

  saveDatabase: (db: CentralDatabase) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  },

  // Giải nén và gộp dữ liệu (Hỗ trợ nén Gzip)
  mergeData: async (currentDb: CentralDatabase, token: string): Promise<{ db: CentralDatabase, addedCount: number }> => {
    try {
      // Chuyển Base64 thành Uint8Array
      const binaryString = atob(token);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Giải nén Gzip bằng DecompressionStream
      const ds = new DecompressionStream('gzip');
      const writer = ds.writable.getWriter();
      writer.write(bytes);
      writer.close();

      const response = new Response(ds.readable);
      const arrayBuffer = await response.arrayBuffer();
      const decodedStr = new TextDecoder().decode(arrayBuffer);
      
      const compressedData = JSON.parse(decodedStr);
      let addedCount = 0;
      const newHistory = { ...currentDb.history };

      if (Array.isArray(compressedData)) {
        compressedData.forEach(arr => {
          const entry = decompressEntry(arr);
          const name = entry.info.fullName;
          if (!newHistory[name]) {
            newHistory[name] = [entry];
            addedCount++;
          } else {
            const currentTimestamps = new Set(newHistory[name].map(e => e.timestamp));
            if (!currentTimestamps.has(entry.timestamp)) {
              newHistory[name].push(entry);
              addedCount++;
            }
          }
        });
      }

      const updatedDb = { history: newHistory, activities: currentDb.activities };
      Object.keys(updatedDb.history).forEach(name => {
        updatedDb.history[name].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });

      storageService.saveDatabase(updatedDb);
      return { db: updatedDb, addedCount };
    } catch (e) {
      console.error("Merge error:", e);
      throw new Error("Gói dữ liệu không hợp lệ hoặc sai định dạng nén.");
    }
  },

  // Tạo gói dữ liệu nén cực gọn
  generateSyncPackage: async (db: CentralDatabase, selectedEntries?: HistoryEntry[]): Promise<string> => {
    const entriesToSync = selectedEntries || Object.values(db.history).flat();
    const compressedArr = entriesToSync.map(compressEntry);
    const jsonStr = JSON.stringify(compressedArr);

    // Nén chuỗi bằng CompressionStream (Gzip)
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(new TextEncoder().encode(jsonStr));
    writer.close();

    const response = new Response(cs.readable);
    const arrayBuffer = await response.arrayBuffer();
    
    // Chuyển sang Base64
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
};

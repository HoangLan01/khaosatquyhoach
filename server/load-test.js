const http = require('http');
const { performance } = require('perf_hooks');

const PORT = 3026;
const TOTAL_REQUESTS = 20000; // 20.000 requests
const CONCURRENCY = 500;      // 500 client đồng thời bắn liên tục

const samplePayload = JSON.stringify({
  selectedProject: 'merged',
  person: {
    fullName: 'Người dân Tùng Thiện (Tải cao)',
    phone: '0912345678',
    address: 'Khu dân cư Xuân Khanh, Phường Tùng Thiện',
    email: 'stress-test@tungthien.gov.vn'
  },
  answers: {
    q1: 'agree',
    q2: 'agree',
    q3: 'agree'
  },
  comments: {
    q2: 'Đồng thuận cao với phương án quy hoạch phân khu.'
  },
  otherOpinion: 'Đề nghị sớm triển khai giải phóng mặt bằng đúng tiến độ.'
});

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 500
});

function sendSubmitRequest() {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/survey/submit',
      method: 'POST',
      agent: httpAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(samplePayload),
        'Connection': 'keep-alive'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = performance.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (err) => {
      const duration = performance.now() - startTime;
      resolve({
        statusCode: 500,
        duration,
        success: false,
        error: err.message
      });
    });

    req.write(samplePayload);
    req.end();
  });
}

function sendStatsRequest() {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/stats',
      method: 'GET',
      agent: httpAgent,
      headers: {
        'Connection': 'keep-alive'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = performance.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (err) => {
      const duration = performance.now() - startTime;
      resolve({
        statusCode: 500,
        duration,
        success: false,
        error: err.message
      });
    });

    req.end();
  });
}

async function runBenchmark() {
  console.log('======================================================================');
  console.log(`🔥 BẮT ĐẦU KIỂM THỬ TẢI CỰC HẠN (EXTREME STRESS TEST)`);
  console.log(`📌 Mục tiêu: Kiểm tra độ bền bỉ khi hàng vạn người truy cập dồn dập`);
  console.log(`📌 Tổng số lượng Request kiểm thử: ${TOTAL_REQUESTS.toLocaleString('vi-VN')} requests`);
  console.log(`📌 Số Client đồng thời (Concurrency): ${CONCURRENCY} connections`);
  console.log(`📌 Kịch bản: 85% Gửi khảo sát (Write) + 15% Đọc thống kê (Read)`);
  console.log('======================================================================');

  const results = [];
  let completed = 0;
  const initialMem = process.memoryUsage().rss / 1024 / 1024;
  const overallStart = performance.now();

  const workers = Array(CONCURRENCY).fill(0).map(async () => {
    while (completed < TOTAL_REQUESTS) {
      completed++;
      // 85% Submit, 15% Read Stats
      const isSubmit = Math.random() < 0.85;
      const res = isSubmit ? await sendSubmitRequest() : await sendStatsRequest();
      results.push(res);
    }
  });

  await Promise.all(workers);
  const overallEnd = performance.now();
  const totalTimeSec = (overallEnd - overallStart) / 1000;
  const finalMem = process.memoryUsage().rss / 1024 / 1024;

  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;
  const durations = results.map(r => r.duration).sort((a, b) => a - b);

  const minLatency = durations[0];
  const maxLatency = durations[durations.length - 1];
  const avgLatency = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.50)];
  const p90 = durations[Math.floor(durations.length * 0.90)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const rps = (results.length / totalTimeSec).toFixed(2);

  console.log('\n📊 KẾT QUẢ ĐO ĐẠC KIỂM THỬ TẢI 10.000 REQUESTS:');
  console.log('----------------------------------------------------------------------');
  console.log(`✓ Tổng thời gian thực thi:        ${totalTimeSec.toFixed(2)} giây`);
  console.log(`✓ Số Request thành công:           ${successCount.toLocaleString('vi-VN')} / ${results.length.toLocaleString('vi-VN')} (${((successCount/results.length)*100).toFixed(2)}%)`);
  console.log(`✗ Số Request thất bại:            ${failCount}`);
  console.log(`⚡ Tốc độ xử lý (Throughput):      ${rps} Request / Giây (RPS)`);
  console.log(`⏱ Độ trễ nhanh nhất (Min):         ${minLatency.toFixed(2)} ms`);
  console.log(`⏱ Độ trễ trung bình (Avg):         ${avgLatency.toFixed(2)} ms`);
  console.log(`⏱ Độ trễ P50 (50% người dùng):     ${p50.toFixed(2)} ms`);
  console.log(`⏱ Độ trễ P90 (90% người dùng):     ${p90.toFixed(2)} ms`);
  console.log(`⏱ Độ trễ P95 (95% người dùng):     ${p95.toFixed(2)} ms`);
  console.log(`⏱ Độ trễ P99 (99% người dùng):     ${p99.toFixed(2)} ms`);
  console.log(`⏱ Độ trễ lâu nhất (Max):           ${maxLatency.toFixed(2)} ms`);
  console.log(`💾 Mức chiếm dụng RAM:             ~${finalMem.toFixed(1)} MB (Tăng: +${(finalMem - initialMem).toFixed(1)} MB)`);
  console.log('======================================================================\n');
}

runBenchmark();


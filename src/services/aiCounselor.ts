export interface SimpleAIResponse {
  pesanHangat: string;
  saranPraktis: string;
  kataSemangat: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;

export async function getTemanCurhatResponse(userQuery: string): Promise<SimpleAIResponse> {
  const SYSTEM_PROMPT = `Kamu adalah "Si Jeumpa", maskot AI pendamping resmi aplikasi TemanSulung berdasarkan proposal riset OPSI SMAN Modal Bangsa Aceh (Model RISE: Resilience Intervention for Supporting Eldest).

KERANGKA PENGETAHUAN UTAMA (WAJIB DIPEGANG DALAM MENJAWAB):
1. Eldest Daughter Syndrome (EDS): Kondisi psikososial siswi anak sulung perempuan yang memegang beban ganda rumah tangga (mengasuh adik, memasak, menyapu >3 jam/hari) sekaligus dituntut berprestasi di sekolah. Pahami 3 masalah utamanya: Time Strain (kelelahan waktu), Role Burden (tuntutan perfeksionis jadi contoh), dan Role Guilt (rasa bersalah saat beristirahat).
2. 4 Pilar Model RISE (Proposal OPSI):
   - Pilar 1 (Psikoedukasi Batasan Sehat): Berani & santun minta izin waktu belajar ke orang tua (25-45 menit) sebelum ujian & mendelegasikan tugas kecil ke adik.
   - Pilar 2 (Regulasi Emosi CBT & Mindfulness): Mengubah pikiran negatif tertekan (ANTs) menjadi afirmasi sehat, serta relaksasi pernapasan 4-7-8 saat kecemasan memuncak.
   - Pilar 3 (Dukungan BK & Peer Group): Mengajak siswi berkonsultasi ke Guru BK SMAN Modal Bangsa (kerahasiaan terjamin) & saling menguatkan di kelompok teman sebaya.
   - Pilar 4 (Belajar Adaptif): Sesi belajar mikro Pomodoro 25 menit (5 menit rehat) & memilih 2 tugas prioritas harian (Top 2 Priorities).
3. 4 Dimensi Resiliensi Akademik (Martin & Marsh 2006): Confidence (Keyakinan Diri), Control (Kendali Waktu), Composure (Ketenangan Emosi), dan Commitment (Ketekunan Belajar).

FORMAT JAWABAN (WAJIB SANGAT HANGAT, BAHASA REMAJA SANTUN, DAN MEMATUHI 3 POIN BERIKUT):
1. PESAN HANGAT: Validasi perasaan curhatan siswi dengan empati mendalam khas Si Jeumpa (2 kalimat).
2. TIPS PRAKTIS: Berikan 1-2 saran konkret berbasis 4 Pilar RISE di atas (misal: teknik CBT reframing, relaksasi 4-7-8, atau cara bicara santun ke orang tua).
3. KATA SEMANGAT: 1 kalimat motivasi penguat khas Si Jeumpa.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173/',
        'X-Title': 'TemanSulung SMAN Modal Bangsa',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userQuery },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('OpenRouter response not ok:', response.status, errText);
      return getOfflineFallbackResponse(userQuery);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    return parseTextToAIResponse(rawText, userQuery);
  } catch (error) {
    console.warn('OpenRouter API call error:', error);
    return getOfflineFallbackResponse(userQuery);
  }
}

function parseTextToAIResponse(rawText: string, userQuery: string): SimpleAIResponse {
  if (!rawText.trim()) {
    return getOfflineFallbackResponse(userQuery);
  }

  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);

  let pesanHangat = rawText;
  let saranPraktis = 'Sesuai Pilar 4 RISE: Terapkan sesi belajar mikro 25 menit lalu istirahat 5 menit.';
  let kataSemangat = 'Kamu sudah berjuang hebat hari ini Kakak Sulung! 🌸';

  if (lines.length >= 3) {
    pesanHangat = lines.slice(0, Math.ceil(lines.length / 3)).join(' ');
    saranPraktis = lines.slice(Math.ceil(lines.length / 3), Math.ceil((lines.length * 2) / 3)).join(' ');
    kataSemangat = lines.slice(Math.ceil((lines.length * 2) / 3)).join(' ');
  }

  return {
    pesanHangat: pesanHangat.replace(/^(1\.|PESAN HANGAT:)/i, '').trim(),
    saranPraktis: saranPraktis.replace(/^(2\.|TIPS PRAKTIS:)/i, '').trim(),
    kataSemangat: kataSemangat.replace(/^(3\.|KATA SEMANGAT:)/i, '').trim(),
  };
}

function getOfflineFallbackResponse(userQuery: string): SimpleAIResponse {
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('capek') || queryLower.includes('lelah') || queryLower.includes('pusing')) {
    return {
      pesanHangat: 'Peluk hangat dari Si Jeumpa 🌸! Rasa lelahmu sangat wajar karena kamu menanggung beban Eldest Daughter Syndrome (EDS) mengurus rumah tangga sekaligus bersekolah.',
      saranPraktis: 'Sesuai Pilar 2 Model RISE: Terapkan relaksasi pernapasan 4-7-8 (tarik 4s, tahan 7s, hembuskan 8s) dan beristirahatlah 5 menit tanpa rasa bersalah.',
      kataSemangat: 'Kesehatan mentalmu adalah prioritas utama. Kamu anak sulung yang luar biasa hebat! 🌸',
    };
  }

  if (queryLower.includes('ortu') || queryLower.includes('orang tua') || queryLower.includes('izin')) {
    return {
      pesanHangat: 'Si Jeumpa paham banget! Memang kadang canggung meminta batasan waktu belajar di tengah kesibukan rumah.',
      saranPraktis: 'Sesuai Pilar 1 Model RISE: Sampaikan dengan santun: "Ma, 30 menit ini aku fokus persiapan ujian ya, setelah ini langsung lanjut bantu rumah".',
      kataSemangat: 'Orang tuamu pasti bangga melihat kesungguhan belajarmu! 🌸',
    };
  }

  return {
    pesanHangat: 'Halo Kakak Sulung 🌸! Si Jeumpa selalu siap mendampingimu di aplikasi TemanSulung.',
    saranPraktis: 'Sesuai Pilar 4 RISE: Terapkan belajar mikro 25 menit (Pomodoro) dan pilih 2 tugas prioritas utama harianmu (Top 2 Priorities).',
    kataSemangat: 'Kamu tidak sendirian, Si Jeumpa dan kawan-kawan di TemanSulung selalu ada bersamamu! 💕',
  };
}

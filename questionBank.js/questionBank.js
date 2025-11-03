// questionBank.js
// 管理題庫並提供每次隨機抽題的功能，不會改變原始題庫順序或內容。
// 適用於與 p5.js 的 sketch.js 一起使用。

class QuestionBank {
    constructor(initialBank = []) {
        // 深拷貝以避免外部直接修改內部陣列
        this._bank = initialBank.map(q => JSON.parse(JSON.stringify(q)));
    }

    // 回傳題庫（深拷貝）
    getAll() {
        return this._bank.map(q => JSON.parse(JSON.stringify(q)));
    }

    // 新增題目（物件需包含 id, q, a, b, c, d, ans）
    addQuestion(q) {
        this._bank.push(JSON.parse(JSON.stringify(q)));
    }

    // 依 id 刪除題目
    removeById(id) {
        this._bank = this._bank.filter(q => q.id !== id);
    }

    // 產生不改變題庫的隨機測驗（從題庫抽取 count 題，若 count 超過題庫則回傳全部）
    getRandomQuiz(count) {
        const n = Math.min(count, this._bank.length);
        const indices = Array.from({length: this._bank.length}, (v,i) => i);
        // Fisher-Yates shuffle 部分抽樣
        for (let i = this._bank.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        const selected = indices.slice(0, n).map(i => JSON.parse(JSON.stringify(this._bank[i])));
        return selected;
    }

    // 匯出整個題庫為 CSV（會呼叫 p5.js 的 saveStrings，如果在非 p5 環境則回傳字串陣列）
    exportCSV(filename = 'question_bank.csv') {
        const lines = [];
        lines.push("id,question,optionA,optionB,optionC,optionD,answerIndex");
        for (let q of this._bank) {
            const line = [
                q.id,
                '"' + String(q.q).replace(/"/g,'""') + '"',
                '"' + String(q.a).replace(/"/g,'""') + '"',
                '"' + String(q.b).replace(/"/g,'""') + '"',
                '"' + String(q.c).replace(/"/g,'""') + '"',
                '"' + String(q.d).replace(/"/g,'""') + '"',
                q.ans
            ].join(",");
            lines.push(line);
        }
        if (typeof saveStrings === 'function') {
            saveStrings(lines, filename);
            return null;
        } else {
            return lines;
        }
    }
}

// 若需要，可將這個實例化後提供給 sketch.js 使用，例如：
// const qBank = new QuestionBank(initialBankArray);
// 然後在 startQuiz 中使用 qBank.getRandomQuiz(4);

// 若在全域環境下使用，將類別掛到 window（或 globalThis）
if (typeof globalThis !== 'undefined') {
    globalThis.QuestionBank = QuestionBank;
}
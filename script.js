function processCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('ファイルを選択してください。');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const output = [];

        // CSVのヘッダー（最初の行）を処理
        if (rows.length > 0) {
            const header = rows[0].concat('入所時の年齢');
            output.push(header.join(','));
        }

        // 各行を処理
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const birthDate = new Date(row[0]); // 誕生日の列
            const entryDate = new Date(row[1]); // 入所日の列

            // 年齢の計算
            let age = entryDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = entryDate.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && entryDate.getDate() < birthDate.getDate())) {
                age--;
            }

            // 新しい行を出力配列に追加
            output.push(row.concat(age).join(','));
        }

        // 新しいCSVファイルを生成
        const blob = new Blob([output.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // ダウンロードリンクを作成して実行
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'processed.csv';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    reader.readAsText(file);
}

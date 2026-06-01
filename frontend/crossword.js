async function generateCrossword() {
    const topic = document.getElementById("topic").value;
    const count = document.getElementById("count").value;
    const result = document.getElementById("result");

    result.innerHTML = "⏳ Krossvord yaratilmoqda...";

    const res = await fetch("http://127.0.0.1:8000/generate-crossword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic, count })
    });

    const data = await res.json();

    if (data.error) {
        result.innerHTML = "❌ " + data.error;
        return;
    }

    // 🔥 JSON PARSE
    let words = JSON.parse(data.data);

    drawCrossword(words);
}

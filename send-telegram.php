<?php
// Разрешаем CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Получаем данные
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Проверяем данные
if (!$data || !isset($data['name']) || !isset($data['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

// Ваши данные
$token = '8623069480:AAEoXHobxR-hOIZO-yFLe_lEkSeiytj_x_w';
$chat_id = '5304410896'; // ← ВСТАВЬТЕ СЮДА chat_id!

// Формируем сообщение
$message = "🎉 *НОВАЯ ЗАЯВКА*\n\n";
$message .= "👤 *Имя:* " . htmlspecialchars($data['name']) . "\n";
$message .= "📱 *Телефон:* " . htmlspecialchars($data['phone']) . "\n";

if (!empty($data['program'])) {
    $message .= "🎈 *Программа:* " . htmlspecialchars($data['program']) . "\n";
}

if (!empty($data['date'])) {
    $message .= "📅 *Дата:* " . htmlspecialchars($data['date']) . "\n";
}

if (!empty($data['comment'])) {
    $message .= "💬 *Комментарий:* " . htmlspecialchars($data['comment']) . "\n";
}

$message .= "\n🕐 *Время:* " . date('H:i d.m.Y');

// Отправляем в Telegram
$url = "https://api.telegram.org/bot{$token}/sendMessage";

$params = [
    'chat_id' => $chat_id,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

// Инициализируем curl
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Таймаут 10 секунд
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5); // Таймаут подключения 5 секунд

// Выполняем запрос
$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

// Проверяем результат
if ($result && $httpCode === 200) {
    echo json_encode(['success' => true]);
} else {
    // Логируем ошибку (для отладки)
    error_log("Telegram API Error: HTTP $httpCode - $curlError");
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Telegram API error',
        'httpCode' => $httpCode,
        'curlError' => $curlError
    ]);
}
?>
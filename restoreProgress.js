const botToken = '7416750392:AAFAky0N3IxuO_QaRbmWXdGvz-PyYalP-ys';
const apiUrl = `https://api.telegram.org/bot${botToken}`;
let chatId = '-1002234078666';
let messageId = '';

async function restoreProgress() {
    // Получение команды из меню
    const response = await fetch(`${apiUrl}/getMyCommands`);
    const data = await response.json();

    if (data.result && data.result.length > 0) {
        const command = data.result.find(cmd => cmd.command === 'backup');
        if (command) {
            [chatId, messageId] = command.description.split(',');

            // Пересылка сообщения, чтобы получить file_id
            const forwardResponse = await fetch(`${apiUrl}/forwardMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    from_chat_id: chatId,
                    message_id: messageId
                })
            });
            const forwardData = await forwardResponse.json();
            const fileId = forwardData.result.document.file_id;

            // Получение файла
            const getFileResponse = await fetch(`${apiUrl}/getFile?file_id=${fileId}`);
            const getFileData = await getFileResponse.json();
            const filePath = getFileData.result.file_path;

            // Скачивание файла
            const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
            const fileResponse = await fetch(fileUrl);
            const fileContent = await fileResponse.json();

            // Восстановление данных из файла
            console.log('Восстановленные данные:', fileContent);
        }
    }
}

// Вызов функции восстановления при запуске
restoreProgress();

/*
  @Chuyển đổi múi giờ từ UTC sang GMT+7 (Giờ Việt Nam)
*/
export const convertTimeToGM7T = (date) => {
    const utcDate = date.createdAt; // 2025-11-25T03:30:00.000Z

    // Chuyển đổi sang giờ Việt Nam (UTC+7) khi gửi đi:
    const vietnamTimeISO = utcDate.toLocaleString('sv-SE', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(',', ''); // -> "2025-11-25 10:30:00"

    // Hoặc sử dụng thư viện như Moment/date-fns để quản lý múi giờ dễ hơn.
    return vietnamTimeISO;
}
export interface BookingEmailProps {
  customerName: string;
  customerPhone: string;
  branch: string;
  guestCount: number;
  bookingDate: string;
  bookingTime: string;
  specialRequests: string;
  bookingId: string;
  createdAt: string;
}

export const buildBookingEmail = (props: BookingEmailProps): string => {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt Bàn Mới</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-w: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #1E3A2F; padding: 30px; text-align: center;">
            <h1 style="color: #D4A843; margin: 0; font-size: 24px;">🐦 Nhà Hàng Minh Đương – Chim To Dần</h1>
        </div>

        <!-- Alert Badge -->
        <div style="text-align: center; margin-top: -15px;">
            <span style="background-color: #FFB800; color: #000000; padding: 8px 24px; border-radius: 20px; font-weight: bold; font-size: 14px; display: inline-block; border: 2px solid #ffffff;">
                ĐẶT BÀN MỚI
            </span>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333333; margin-top: 0;">Khách hàng <strong>${props.customerName}</strong> vừa đặt bàn qua website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #FAF6EE; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; color: #666; width: 140px;">Tên khách:</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; font-weight: bold; color: #2C2C2C;">${props.customerName}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; color: #666;">Số điện thoại:</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; font-weight: bold; color: #1E3A2F; font-size: 18px;">${props.customerPhone}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; color: #666;">Chi nhánh:</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; font-weight: bold; color: #2C2C2C;">${props.branch}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; color: #666;">Số khách:</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; font-weight: bold; color: #2C2C2C;">${props.guestCount} người</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; color: #666;">Thời gian:</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0dcd2; font-weight: bold; color: #d32f2f;">${props.bookingTime} - Ngày ${props.bookingDate}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #666;">Ghi chú:</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #2C2C2C; font-style: italic;">${props.specialRequests}</td>
                </tr>
            </table>

            <!-- Actions -->
            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 12px; margin-bottom: 15px;">Hành động quản lý (ID: ${props.bookingId})</p>
                <a href="https://console.firebase.google.com/project/_/firestore/data/bookings/${props.bookingId}" style="display: inline-block; background-color: #1E3A2F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 0 5px;">
                    📋 Xem trên Firebase
                </a>
                <a href="tel:${props.customerPhone}" style="display: inline-block; background-color: #D4A843; color: #1E3A2F; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 0 5px;">
                    📞 Gọi Khách Hàng
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; color: #999999; font-size: 12px;">Hệ thống tự động – Minh Đương | 0979.292.888 | cuonglhv@gmail.com</p>
            <p style="margin: 5px 0 0 0; color: #999999; font-size: 11px;">Gửi lúc: ${props.createdAt}</p>
        </div>
    </div>
</body>
</html>
  `;
};

import { Resend } from 'resend';

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'Tnn.3197@gmail.com';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export async function sendOrderNotification({ orderId, customer_name, phone, address, note, items, total }) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.product_name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(item.price)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Đơn hàng mới</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#16a34a;padding:28px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;">🌿 Xương Rồng Nông Lâm</h1>
      <p style="margin:6px 0 0;color:#dcfce7;font-size:14px;">Thông báo đơn hàng mới</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:4px;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0;font-size:16px;color:#15803d;font-weight:600;">Đơn hàng #${orderId} vừa được đặt!</p>
      </div>

      <!-- Customer Info -->
      <h2 style="font-size:15px;color:#374151;margin:0 0 12px;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Thông tin khách hàng</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;width:140px;font-size:14px;">Họ tên:</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${customer_name}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Số điện thoại:</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${phone}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Địa chỉ:</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${address}</td>
        </tr>
        ${note ? `<tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Ghi chú:</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${note}</td>
        </tr>` : ''}
      </table>

      <!-- Order Items -->
      <h2 style="font-size:15px;color:#374151;margin:0 0 12px;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Sản phẩm đặt mua</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Sản phẩm</th>
            <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;">SL</th>
            <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;">Đơn giá</th>
            <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:10px 12px;text-align:right;color:#6b7280;font-size:13px;">Phí vận chuyển:</td>
            <td style="padding:10px 12px;text-align:right;color:#374151;">30.000 ₫</td>
          </tr>
          <tr style="background:#f0fdf4;">
            <td colspan="3" style="padding:10px 12px;text-align:right;font-weight:700;color:#15803d;font-size:15px;">Tổng cộng:</td>
            <td style="padding:10px 12px;text-align:right;font-weight:700;color:#15803d;font-size:15px;">${formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>

      <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">
        Đơn hàng đặt lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
      </p>
    </div>
  </div>
</body>
</html>`;

  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping email notification');
    return;
  }
  await resend.emails.send({
    from: 'Xương Rồng Nông Lâm <onboarding@resend.dev>',
    to: NOTIFY_EMAIL,
    subject: `[Đơn hàng mới #${orderId}] ${customer_name} - ${phone}`,
    html,
  });
}

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Welcome email
export const sendWelcomeEmail = async (name, email) => {
  try {
    await transporter.sendMail({
      from: `"ShopMERN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🛒 Welcome to ShopMERN!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛒 ShopMERN</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Welcome, ${name}! 🎉</h2>
            <p>Thank you for joining ShopMERN. We're excited to have you!</p>
            <p>Start shopping now and discover amazing deals.</p>
            <a href="${process.env.FRONTEND_URL || 'https://mern-ecommercee-backend.onrender.com'}" 
               style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
              Start Shopping →
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            © 2024 ShopMERN. All rights reserved.
          </div>
        </div>
      `
    })
    console.log(`✅ Welcome email sent to ${email}`)
  } catch (error) {
    console.log('Email error:', error.message)
  }
}

// Order confirmation email
export const sendOrderConfirmationEmail = async (name, email, order) => {
  try {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price * item.quantity}</td>
      </tr>
    `).join('')

    await transporter.sendMail({
      from: `"ShopMERN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛒 ShopMERN</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Order Confirmed! ✅</h2>
            <p>Hi ${name}, your order has been placed successfully!</p>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #2563EB; color: white;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; font-weight: bold;">Total</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #2563EB;">$${order.totalPrice}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <h3>Shipping Address</h3>
              <p>${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}</p>
            </div>

            <a href="${process.env.FRONTEND_URL || 'https://mern-ecommercee-backend.onrender.com'}/orders" 
               style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
              Track Your Order →
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            © 2024 ShopMERN. All rights reserved.
          </div>
        </div>
      `
    })
    console.log(`✅ Order confirmation email sent to ${email}`)
  } catch (error) {
    console.log('Email error:', error.message)
  }
}

// Order status update email
export const sendOrderStatusEmail = async (name, email, orderId, status) => {
  const statusEmoji = {
    processing: '⚙️',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌'
  }

  const statusMessage = {
    processing: 'Your order is being processed!',
    shipped: 'Your order is on its way!',
    delivered: 'Your order has been delivered!',
    cancelled: 'Your order has been cancelled.'
  }

  try {
    await transporter.sendMail({
      from: `"ShopMERN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${statusEmoji[status]} Order Update - #${orderId.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛒 ShopMERN</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>${statusEmoji[status]} Order Update</h2>
            <p>Hi ${name},</p>
            <p>${statusMessage[status]}</p>
            <p><strong>Order ID:</strong> #${orderId.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Status:</strong> <span style="color: #2563EB; font-weight: bold;">${status.toUpperCase()}</span></p>
            <a href="${process.env.FRONTEND_URL || 'https://mern-ecommercee-backend.onrender.com'}/orders" 
               style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
              View Order →
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            © 2024 ShopMERN. All rights reserved.
          </div>
        </div>
      `
    })
    console.log(`✅ Status email sent to ${email}`)
  } catch (error) {
    console.log('Email error:', error.message)
  }
}

// Stock alert email
export const sendStockAlertEmail = async (name, email, productName, productId) => {
  try {
    await transporter.sendMail({
      from: `"ShopMERN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔔 ${productName} is back in stock!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛒 ShopMERN</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>🔔 Good News, ${name}!</h2>
            <p><strong>${productName}</strong> is back in stock!</p>
            <p>Hurry up before it sells out again!</p>
            <a href="${process.env.FRONTEND_URL || 'https://mern-ecommercee-backend.onrender.com'}/products/${productId}" 
               style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
              Buy Now →
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            © 2024 ShopMERN. All rights reserved.
          </div>
        </div>
      `
    })
    console.log(`✅ Stock alert email sent to ${email}`)
  } catch (error) {
    console.log('Email error:', error.message)
  }
}
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const SERVICE_EMAIL = 'skillconnect2025@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Configure your SMTP transport (use environment variables in production)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || SERVICE_EMAIL,
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    })

    await transporter.sendMail({
      from: SERVICE_EMAIL,
      to: process.env.CONTACT_RECEIVER || SERVICE_EMAIL,
      subject: `SkillConnect Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
} 
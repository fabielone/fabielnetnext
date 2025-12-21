import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createPasswordResetToken, getUserByEmail } from '@/lib/auth'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists
    const user = await getUserByEmail(normalizedEmail)

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists and has a password
    if (user && user.passwordHash) {
      const token = await createPasswordResetToken(normalizedEmail)
      
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000'
      
      const resetUrl = `${baseUrl}/en/reset-password?token=${token}`

      // Send password reset email
      if (resend) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || 'Fabiel.Net <noreply@fabiel.net>',
            to: normalizedEmail,
            subject: 'Reset Your Password - Fabiel.Net',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Reset Your Password</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Fabiel.Net</h1>
                  </div>
                  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
                    <p style="color: #4b5563;">Hi ${user.firstName || 'there'},</p>
                    <p style="color: #4b5563;">We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetUrl}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
                    <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
                    </p>
                  </div>
                  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Fabiel.Net. All rights reserved.</p>
                  </div>
                </body>
              </html>
            `,
          })
          console.log('Password reset email sent to:', normalizedEmail)
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError)
          // Don't fail the request if email fails - still return success
        }
      } else {
        // Dev mode - log the reset URL
        console.log('[DEV] Password reset URL:', resetUrl)
      }
    } else if (user && !user.passwordHash) {
      // User exists but uses OAuth - send different email
      if (resend) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || 'Fabiel.Net <noreply@fabiel.net>',
            to: normalizedEmail,
            subject: 'Password Reset Request - Fabiel.Net',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Fabiel.Net</h1>
                  </div>
                  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Sign In With Google</h2>
                    <p style="color: #4b5563;">Hi ${user.firstName || 'there'},</p>
                    <p style="color: #4b5563;">We received a password reset request for your account. However, your account is set up to sign in with Google.</p>
                    <p style="color: #4b5563;">Please use the "Sign in with Google" button on our login page to access your account.</p>
                    <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                  </div>
                  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Fabiel.Net. All rights reserved.</p>
                  </div>
                </body>
              </html>
            `,
          })
        } catch (emailError) {
          console.error('Failed to send OAuth notice email:', emailError)
        }
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

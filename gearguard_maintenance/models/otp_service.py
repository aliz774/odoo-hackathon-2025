import smtplib
import os
import random
import string
from email.message import EmailMessage

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_via_gmail(to_email, otp_code):
    """
    Sends an OTP to the specified email using Gmail SMTP.
    Credentials are read from os.environ: 
    - GMAIL_USER
    - GMAIL_PASSWORD (App Password)
    """
    gmail_user = os.getenv('GMAIL_USER')
    gmail_pass = os.getenv('GMAIL_PASSWORD')

    if not gmail_user or not gmail_pass:
        print("⚠️ OTP Error: GMAIL_USER or GMAIL_PASSWORD not set in environment.")
        return False

    msg = EmailMessage()
    msg['Subject'] = 'Your GearGuard OTP Code'
    msg['From'] = gmail_user
    msg['To'] = to_email
    msg.set_content(f"Your verification code is: {otp_code}\n\nThis code expires in 10 minutes.")

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(gmail_user, gmail_pass)
            smtp.send_message(msg)
        print(f"✅ OTP sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send OTP: {e}")
        return False

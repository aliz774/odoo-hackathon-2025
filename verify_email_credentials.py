import smtplib
import os
from email.message import EmailMessage

def test_gmail_smtp():
    print("--- Gmail SMTP Credential Tester ---\n")
    
    # 1. Get Credentials
    user = input("Enter Gmail Address: ").strip()
    password = input("Enter App Password: ").strip()
    recipient = input("Enter Recipient Email (to send test to): ").strip()
    
    print(f"\nAttempting to connect as {user}...")

    # 2. Prepare Message
    msg = EmailMessage()
    msg['Subject'] = 'GearGuard SMTP Test'
    msg['From'] = user
    msg['To'] = recipient
    msg.set_content("If you are reading this, your Gmail App Password is working correctly! ✅")

    # 3. Send
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(user, password)
            smtp.send_message(msg)
        print("\n✅ SUCCESS! Email sent successfully.")
        print("You can now safely use these credentials in your Environment Variables.")
    except smtplib.SMTPAuthenticationError:
        print("\n❌ FAILURE: Authentication failed.")
        print("Tip: Make sure you are using an 'App Password', not your regular login password.")
        print("Go to: https://myaccount.google.com/apppasswords")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_gmail_smtp()

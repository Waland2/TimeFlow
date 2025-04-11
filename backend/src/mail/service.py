from email.message import EmailMessage
from email.utils import formataddr

from aiosmtplib import SMTP, SMTPException
from src.config import SMTP_USER, SMTP_PORT, SMTP_PASS, SMTP_HOST, FRONT_DOMAIN


def build_email_body(title: str, description: str, button_text: str, link: str) -> tuple[str, str]:
    plain_text = f"{title}\n\n{description}\n\n{link}"

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #333;">{title}</h2>
          <p style="color: #555;">{description}</p>
          <a href="{link}" style="display: inline-block; margin-top: 20px; background-color: #4CAF50; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">{button_text}</a>
        </div>
      </body>
    </html>
    """
    return plain_text, html


async def send_confirm_mail(to: str, token: str) -> bool:
    link = f"https://{FRONT_DOMAIN}/auth/confirm?token={token}"
    text, html = build_email_body(
        title="Please confirm your email",
        description="Click the button below to verify your email address and complete your registration.",
        button_text="Confirm Email",
        link=link
    )

    message = EmailMessage()
    message["From"] = formataddr(("TimeFlow", SMTP_USER))
    message["To"] = to
    message["Subject"] = "Confirm your email"
    message.set_content(text)
    message.add_alternative(html, subtype="html")

    try:
        async with SMTP(hostname=SMTP_HOST, port=SMTP_PORT, use_tls=True) as smtp:
            await smtp.login(SMTP_USER, SMTP_PASS)
            await smtp.send_message(message)
            return True
    except SMTPException as e:
        print(f"SMTP error when sending email to {to}: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error when sending email to {to}: {e}")
        return False



async def send_password_reset_mail(to: str, token: str):
    link = f"https://{FRONT_DOMAIN}/auth/reset?token={token}"
    text, html = build_email_body(
        title="Reset your password",
        description="Forgot your password? Click the button below to set a new one.",
        button_text="Reset Password",
        link=link
    )

    message = EmailMessage()
    message["From"] = formataddr(("TimeFlow", SMTP_USER))
    message["To"] = to
    message["Subject"] = "Reset your password"
    message.set_content(text)
    message.add_alternative(html, subtype="html")

    async with SMTP(hostname=SMTP_HOST, port=SMTP_PORT, use_tls=True) as smtp:
        await smtp.login(SMTP_USER, SMTP_PASS)
        await smtp.send_message(message)

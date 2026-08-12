from config.celery import app
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def _send(subject, to, text_body, html_body):
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=f"EnterpriseHub <{settings.EMAIL_HOST_USER}>",
        to=[to],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)


def _base_html(title, accent, content_html):
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:2px solid #1e1e1e;border-top:4px solid {accent};">
        <!-- Header -->
        <tr>
          <td style="padding:28px 32px;border-bottom:2px solid #1e1e1e;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:{accent};width:36px;height:36px;text-align:center;vertical-align:middle;">
                  <span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#000;line-height:36px;">E</span>
                </td>
                <td style="padding-left:12px;">
                  <span style="font-family:Georgia,serif;font-size:18px;color:#fff;letter-spacing:2px;text-transform:uppercase;">Enterprise<span style="color:{accent};">Hub</span></span>
                  <br>
                  <span style="font-size:9px;color:#555;letter-spacing:3px;text-transform:uppercase;">AI Platform v2</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Title -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0 0 4px;font-size:9px;color:{accent};letter-spacing:4px;text-transform:uppercase;">{title}</p>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:12px 32px 32px;">{content_html}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:2px solid #1e1e1e;">
            <p style="margin:0;font-size:9px;color:#444;letter-spacing:2px;text-transform:uppercase;">
              © 2025 EnterpriseHub · This is an automated message
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


@app.task
def send_welcome_email(email, first_name, role="employee"):
    is_admin   = role in ("company_admin", "super_admin")
    accent     = "#ff3b00" if is_admin else "#00c853"
    shadow     = "#7a1c00" if is_admin else "#005c25"
    role_label = "Admin"   if is_admin else "Employee"
    login_url  = "http://localhost:3000/login"

    if is_admin:
        intro       = "Your Admin account has been activated. You have full control over the EnterpriseHub.ai platform &#8212; manage your team, projects, finances, and more."
        features    = [
            ("&#9632; User Management",   "Create, manage and control all user accounts &amp; roles"),
            ("&#9632; Full Analytics",    "Real-time business intelligence, KPIs &amp; custom reports"),
            ("&#9632; HR &amp; Payroll",  "Manage employees, attendance, leave requests &amp; payroll"),
            ("&#9632; CRM &amp; Finance", "Track leads, deals, revenue &amp; financial performance"),
            ("&#9632; Projects",          "Oversee all projects, sprints, tasks &amp; milestones"),
            ("&#9632; Platform Settings", "Configure integrations, security policies &amp; company info"),
        ]
        steps = [
            ("01", "Set up your company profile",        "Go to Settings and complete your company information."),
            ("02", "Invite your team members",            "Add employees and assign roles from the HR module."),
            ("03", "Create your first project",           "Head to Projects and kick off your first sprint."),
            ("04", "Configure HR &amp; payroll",          "Set up departments, leave policies and payroll rules."),
        ]
    else:
        intro    = "Your Employee account is ready. Welcome to the team &#8212; everything you need to collaborate, track your work, and stay connected is right here."
        features = [
            ("&#9632; Personal Dashboard",  "Your workspace with tasks, projects &amp; activity feed"),
            ("&#9632; Project Collaboration","Work with your team on projects, tasks &amp; kanban boards"),
            ("&#9632; Leave &amp; Attendance","Apply for leave, track attendance &amp; view payslips"),
            ("&#9632; Documents",            "Upload, access &amp; manage your files securely"),
            ("&#9632; Team Channels",        "Chat with your team in real-time collaboration channels"),
            ("&#9632; Analytics",            "View your personal performance metrics &amp; reports"),
        ]
        steps = [
            ("01", "Complete your profile",              "Add your photo, bio and contact details in Settings."),
            ("02", "Check your assigned projects",       "Visit Projects to see your tasks and deadlines."),
            ("03", "Join your team channels",            "Connect with colleagues in Collaboration."),
            ("04", "Review leave &amp; attendance",      "Check your leave balance and attendance record in HR."),
        ]

    # Build feature rows (2-column grid using table)
    feature_rows_html = ""
    for i in range(0, len(features), 2):
        left  = features[i]
        right = features[i + 1] if i + 1 < len(features) else None
        right_td = f"""
          <td width="50%" style="padding:12px 14px;vertical-align:top;border-left:1px solid #1e1e1e;">
            <p style="margin:0 0 4px;font-size:9px;color:{accent};letter-spacing:2px;text-transform:uppercase;">{right[0]}</p>
            <p style="margin:0;font-size:10px;color:#666;line-height:1.6;">{right[1]}</p>
          </td>""" if right else "<td width='50%'></td>"
        feature_rows_html += f"""
        <tr style="border-bottom:1px solid #1e1e1e;">
          <td width="50%" style="padding:12px 14px;vertical-align:top;">
            <p style="margin:0 0 4px;font-size:9px;color:{accent};letter-spacing:2px;text-transform:uppercase;">{left[0]}</p>
            <p style="margin:0;font-size:10px;color:#666;line-height:1.6;">{left[1]}</p>
          </td>
          {right_td}
        </tr>"""

    # Build steps rows
    steps_html = ""
    for num, title, desc in steps:
        steps_html += f"""
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="32" style="vertical-align:top;padding-top:2px;">
                  <span style="display:inline-block;width:24px;height:24px;background:transparent;border:2px solid {accent};text-align:center;line-height:20px;font-family:'Courier New',monospace;font-size:9px;color:{accent};font-weight:bold;">{num}</span>
                </td>
                <td style="vertical-align:top;padding-left:10px;">
                  <p style="margin:0 0 2px;font-size:11px;color:#fff;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:1px;">{title}</p>
                  <p style="margin:0;font-size:10px;color:#555;line-height:1.6;">{desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>"""

    subject = f"Welcome to EnterpriseHub.ai \u2014 Your {role_label} Account is Ready 🚀"
    text    = f"Hi {first_name}, welcome to EnterpriseHub.ai! Your {role_label} account is ready. Sign in at {login_url}"

    content_html = f"""
<!-- ===== HERO ===== -->
<table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;background:#0d0d0d;border:1px solid #1e1e1e;border-left:4px solid {accent};">
  <tr>
    <td style="padding:24px 24px 20px;">
      <!-- Role badge -->
      <p style="margin:0 0 16px;display:inline-block;padding:4px 12px;border:1px solid {accent};font-size:9px;color:{accent};letter-spacing:3px;text-transform:uppercase;">
        &#9670;&nbsp; {role_label} Account
      </p>
      <!-- Name -->
      <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-size:36px;color:#fff;text-transform:uppercase;letter-spacing:2px;line-height:1.1;">
        Welcome,<br><span style="color:{accent};">{first_name}</span>
      </h2>
      <p style="margin:6px 0 16px;font-size:9px;color:#444;letter-spacing:4px;text-transform:uppercase;">EnterpriseHub.ai &nbsp;&#183;&nbsp; AI Platform v2</p>
      <!-- Intro -->
      <p style="margin:0;font-size:11px;color:#777;line-height:1.9;border-top:1px solid #1e1e1e;padding-top:16px;">{intro}</p>
    </td>
  </tr>
</table>

<!-- ===== FEATURES ===== -->
<p style="margin:0 0 10px;font-size:9px;color:{accent};letter-spacing:4px;text-transform:uppercase;">&#9632; What You Can Do</p>
<table cellpadding="0" cellspacing="0" width="100%" style="background:#0d0d0d;border:1px solid #1e1e1e;margin-bottom:24px;">
  {feature_rows_html}
</table>

<!-- ===== GETTING STARTED ===== -->
<p style="margin:0 0 10px;font-size:9px;color:#555;letter-spacing:4px;text-transform:uppercase;">&#9632; Getting Started</p>
<table cellpadding="0" cellspacing="0" width="100%" style="background:#0d0d0d;border:1px solid #1e1e1e;margin-bottom:28px;">
  {steps_html}
</table>

<!-- ===== CTA ===== -->
<table cellpadding="0" cellspacing="0">
  <tr>
    <td style="background:{accent};padding:14px 36px;border:2px solid {accent};box-shadow:4px 4px 0 {shadow};">
      <a href="{login_url}" style="font-size:12px;color:#000;text-decoration:none;letter-spacing:2px;text-transform:uppercase;font-weight:bold;font-family:'Courier New',monospace;">
        Get Started &rarr;
      </a>
    </td>
    <td style="padding-left:12px;">
      <a href="{login_url}" style="font-size:10px;color:#444;text-decoration:none;letter-spacing:1px;text-transform:uppercase;font-family:'Courier New',monospace;">
        or sign in &rarr;
      </a>
    </td>
  </tr>
</table>

<!-- ===== DIVIDER ===== -->
<table cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0 0;">
  <tr>
    <td style="border-top:1px solid #1e1e1e;padding-top:16px;">
      <p style="margin:0;font-size:9px;color:#333;letter-spacing:1px;line-height:2;">
        If you did not create this account, please ignore this email.<br>
        Need help? Reply to this email or contact our support team.
      </p>
    </td>
  </tr>
</table>
"""

    html = _base_html(title="Welcome to EnterpriseHub.ai", accent=accent, content_html=content_html)
    _send(subject, email, text, html)


@app.task
def send_login_notification(email, first_name):
    subject = "New Sign-In Detected — EnterpriseHub"
    text = f"Hi {first_name}, a new sign-in was detected on your EnterpriseHub account."
    html = _base_html(
        title="Sign-In Alert",
        accent="#0057ff",
        content_html=f"""
<h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;color:#fff;text-transform:uppercase;letter-spacing:2px;">
  New Sign-In
</h2>
<p style="margin:0 0 16px;font-size:11px;color:#777;line-height:1.8;">
  Hi <strong style="color:#fff;">{first_name}</strong>, a successful sign-in was recorded on your account.
</p>
<table cellpadding="0" cellspacing="0" style="background:#0d0d0d;border:1px solid #1e1e1e;width:100%;margin-bottom:20px;">
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #1e1e1e;">
      <span style="font-size:9px;color:#555;letter-spacing:2px;text-transform:uppercase;">Platform</span><br>
      <span style="font-size:11px;color:#fff;">EnterpriseHub AI v2</span>
    </td>
  </tr>
  <tr>
    <td style="padding:14px 18px;">
      <span style="font-size:9px;color:#555;letter-spacing:2px;text-transform:uppercase;">Action Required</span><br>
      <span style="font-size:11px;color:#fff;">If this wasn't you, reset your password immediately.</span>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0">
  <tr>
    <td style="background:transparent;padding:10px 24px;border:2px solid #ff3b00;">
      <a href="http://localhost:3000/forgot-password" style="font-size:10px;color:#ff3b00;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">
        Reset Password →
      </a>
    </td>
  </tr>
</table>
""",
    )
    _send(subject, email, text, html)


@app.task
def send_password_reset_email(email, reset_link):
    subject = "Password Reset — EnterpriseHub"
    text = f"Reset your password: {reset_link}"
    html = _base_html(
        title="Password Reset",
        accent="#ff3b00",
        content_html=f"""
<h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;color:#fff;text-transform:uppercase;letter-spacing:2px;">
  Reset Password
</h2>
<p style="margin:0 0 16px;font-size:11px;color:#777;line-height:1.8;">
  We received a request to reset your EnterpriseHub password.<br>
  Click the button below — this link expires in <strong style="color:#fff;">30 minutes</strong>.
</p>
<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background:#ff3b00;padding:12px 28px;border:2px solid #ff3b00;box-shadow:4px 4px 0 #7a1c00;">
      <a href="{reset_link}" style="font-size:11px;color:#000;text-decoration:none;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">
        Reset My Password →
      </a>
    </td>
  </tr>
</table>
<p style="margin:0;font-size:9px;color:#444;line-height:1.8;letter-spacing:1px;">
  If you did not request a password reset, ignore this email.<br>
  Your password will remain unchanged.
</p>
""",
    )
    _send(subject, email, text, html)


@app.task
def send_notification_email(recipient_email, subject, message):
    html = _base_html(
        title="Notification",
        accent="#ffd600",
        content_html=f"""
<h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:2px;">
  {subject}
</h2>
<p style="margin:0;font-size:11px;color:#777;line-height:1.8;">{message}</p>
""",
    )
    _send(subject, recipient_email, message, html)

using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace VeloraCare.API.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string bodyHtml);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string bodyHtml)
    {
        try
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var senderEmail = emailSettings["SenderEmail"];
            var senderPassword = emailSettings["SenderPassword"];
            var senderName = emailSettings["SenderName"];
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            
            // Support multiple comma-separated emails
            var emails = toEmail.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var addr in emails)
            {
                var cleanAddr = addr.Trim();
                if (!string.IsNullOrEmpty(cleanAddr))
                {
                    email.To.Add(new MailboxAddress(cleanAddr, cleanAddr));
                }
            }

            email.Subject = subject;
            email.ReplyTo.Add(new MailboxAddress(senderName, senderEmail)); // Add ReplyTo

            // Create a plain text version from HTML to lower spam score
            string textBody = System.Text.RegularExpressions.Regex.Replace(bodyHtml, "<.*?>", String.Empty);
            textBody = System.Web.HttpUtility.HtmlDecode(textBody).Trim();

            var builder = new BodyBuilder { 
                HtmlBody = bodyHtml,
                TextBody = textBody // Plain text alternative is crucial for spam filters
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, senderPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
            
            _logger.LogInformation("Email sent successfully to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {ToEmail}", toEmail);
        }
    }
}

import { render } from '@react-email/render';
import { ReferralEmail } from '@/components/emails/ReferralEmail';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: SendEmailOptions) {
  try {
    console.log('Sending email:', {
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    
    return { success: true, message: 'Email sent successfully (simulated)' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendNewReferralEmail(
  email: string,
  username: string,
  amount: number,
  referralName: string
) {
  const emailHtml = render(
    ReferralEmail({ 
      username,
      type: "new_referral",
      amount,
      referralName
    })
  );

  return sendEmail({
    to: email,
    subject: `🎉 You've earned ₹${amount} from a new referral!`,
    html: emailHtml,
  });
}

export async function sendWithdrawalRequestEmail(
  email: string,
  username: string,
  amount: number
) {
  const emailHtml = render(
    ReferralEmail({ 
      username,
      type: "withdrawal_request",
      amount,
      withdrawalId: "",
      status: "pending"
    })
  );

  return sendEmail({
    to: email,
    subject: 'Withdrawal Request Received',
    html: emailHtml,
  });
}

export async function sendWithdrawalStatusEmail(
  email: string,
  username: string,
  amount: number,
  withdrawalId: string,
  status: 'completed' | 'rejected'
) {
  const emailHtml = render(
    ReferralEmail({ 
      username,
      type: "withdrawal_processed",
      amount,
      withdrawalId,
      status
    })
  );

  return sendEmail({
    to: email,
    subject: `Withdrawal Request ${status === 'completed' ? 'Completed' : 'Rejected'}`,
    html: emailHtml,
  });
}
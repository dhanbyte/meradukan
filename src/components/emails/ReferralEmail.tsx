import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  type: 'new_referral' | 'withdrawal_request' | 'withdrawal_processed';
  amount?: number;
  referralName?: string;
  withdrawalId?: string;
  status?: 'pending' | 'completed' | 'rejected';
}

export const ReferralEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  type,
  amount = 0,
  referralName,
  withdrawalId,
  status
}) => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #eaeaea',
      borderRadius: '5px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2563eb' }}>ShopWave</h1>
      </div>
      
      {type === 'new_referral' && (
        <div>
          <h2>🎉 Congratulations, {username}!</h2>
          <p>You've earned <strong>₹{amount.toFixed(2)}</strong> from {referralName || 'a new referral'}'s purchase!</p>
          <p>Your current referral balance is now <strong>₹{amount.toFixed(2)}</strong>.</p>
          <div style={{ margin: '30px 0', textAlign: 'center' }}>
            <a 
              href="https://yourwebsite.com/referral" 
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              View Your Earnings
            </a>
          </div>
        </div>
      )}
      
      {type === 'withdrawal_request' && (
        <div>
          <h2>Withdrawal Request Received</h2>
          <p>Hello {username},</p>
          <p>We've received your withdrawal request for <strong>₹{amount.toFixed(2)}</strong>.</p>
          <p>Request ID: <strong>{withdrawalId}</strong></p>
          <p>Status: <strong>Pending</strong></p>
          <p>We'll process your request within 3-5 business days.</p>
        </div>
      )}
      
      {type === 'withdrawal_processed' && (
        <div>
          <h2>Withdrawal {status === 'completed' ? 'Completed' : 'Updated'}</h2>
          <p>Hello {username},</p>
          <p>Your withdrawal request <strong>#{withdrawalId}</strong> has been <strong>{status}</strong>.</p>
          {status === 'completed' && (
            <p>Amount: <strong>₹{amount.toFixed(2)}</strong> has been processed.</p>
          )}
          {status === 'rejected' && (
            <p>Reason: <strong>Account verification required</strong></p>
          )}
          <p>If you have any questions, please contact our support team.</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eaeaea', fontSize: '12px', color: '#666' }}>
        <p>© {new Date().getFullYear()} ShopWave. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  );
};

export default ReferralEmail;

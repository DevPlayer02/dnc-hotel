export const templateHTML = (userName: string, token: string) => {
  return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center; border: 2px solid #041d40; border-radius: 10px; margin: auto; width: 60%;">
          <h1 style="color: #041d40;">Password Reset Verification Code</h1>
          <h3 style="color: #041d40;">Dear ${userName},</h3>
          <p style="font-size: 16px; color: #333;">Please manually select and copy your reset token:</p>
          <textarea id="tokenText" readonly style="width: 500px; height: 80px; font-size: 14px; border: 1px solid #041d40; border-radius: 5px; padding: 10px; color: #041d40; background-color: #f9f9f9; resize: none; display: block; margin: 10px auto;">${token}</textarea>
          <p style="margin-top: 20px;">Best regards,<br><span style="font-weight: bold; color: #041d40;">DNC Hotel</span></p>
        </div>
      `;
};

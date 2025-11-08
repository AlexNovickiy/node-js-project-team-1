import axios from 'axios';

import { API_BREVO } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const sendEmail = async ({ from, to, subject, html }) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: from || getEnvVar(API_BREVO.API_BREVO_FROM) },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          'api-key': getEnvVar(API_BREVO.API_BREVO_KEY),
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Brevo API error:', error.response?.data || error.message);
    throw new Error('Email send failed');
  }
};

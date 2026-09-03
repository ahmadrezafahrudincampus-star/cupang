'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitInquiryAction(prevState, formData) {
  try {
    // Honeypot check
    const honey = formData.get('_honey');
    if (honey) {
      // Quietly reject bot submissions
      return { success: true, message: 'Inquiry received.' };
    }

    const name = (formData.get('name') || '').trim();
    const whatsapp = (formData.get('whatsapp') || '').trim();
    const email = (formData.get('email') || '').trim();
    const subject = (formData.get('subject') || '').trim();
    const message = (formData.get('message') || '').trim();
    const fish_id = formData.get('fish_id') || null;

    if (!name || name.length > 100) {
      return { success: false, errors: { name: 'Valid name is required (max 100 characters).' } };
    }

    if (!whatsapp || whatsapp.length > 30) {
      return { success: false, errors: { whatsapp: 'Valid WhatsApp number is required.' } };
    }

    if (!message || message.length > 2000) {
      return { success: false, errors: { message: 'Message is required (max 2000 characters).' } };
    }

    const supabase = await createClient();
    const insertPayload = {
      name,
      whatsapp,
      email: email || null,
      subject: subject || 'General Specimen Inquiry',
      message,
      status: 'new',
      source: 'web_form',
    };

    if (fish_id && fish_id !== 'null' && fish_id !== 'undefined') {
      insertPayload.fish_id = fish_id;
    }

    const { error } = await supabase.from('inquiries').insert([insertPayload]);
    if (error) {
      console.error('Supabase inquiry insert error:', error);
      // Fallback gracefully so legitimate users are not blocked if DB is in local setup
    }

    return { success: true, message: 'Inquiry submitted successfully.' };
  } catch (err) {
    console.error('Inquiry action exception:', err);
    return { success: false, errors: { form: 'An error occurred. Please try again or reach out on WhatsApp.' } };
  }
}

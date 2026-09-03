'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import { submitInquiryAction } from '@/app/actions/inquiry';

export default function InquiryForm({ initialFishId = '', initialSubject = '', dict = {}, locale = 'id' }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const d = {
    name: dict.name || (locale === 'en' ? 'Full Name' : 'Nama Lengkap'),
    whatsapp: dict.whatsapp || (locale === 'en' ? 'WhatsApp Number' : 'Nomor WhatsApp'),
    email: dict.email || (locale === 'en' ? 'Email Address' : 'Alamat Email'),
    subject: dict.subject || (locale === 'en' ? 'Subject' : 'Subjek'),
    message: dict.message || (locale === 'en' ? 'Your Message' : 'Pesan Anda'),
    submit: dict.submit || (locale === 'en' ? 'SEND DIRECT INQUIRY' : 'KIRIM PERTANYAAN'),
    submitting: dict.submitting || (locale === 'en' ? 'SENDING...' : 'MENGIRIM...'),
    success: dict.success || (locale === 'en' ? 'Your inquiry has been received.' : 'Pertanyaan Anda telah kami terima.'),
    error: dict.error || (locale === 'en' ? 'Something went wrong. Please try again.' : 'Terjadi kendala. Silakan coba lagi.'),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await submitInquiryAction(null, formData);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.errors?.form || result.errors?.name || d.error);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-surface border border-primary/40 p-10 text-center flex flex-col items-center">
        <span className="text-primary text-4xl mb-4 font-display">✓</span>
        <h3 className="font-display text-2xl md:text-3xl text-primary mb-3">
          {locale === 'en' ? 'Inquiry Dispatched' : 'Pertanyaan Terkirim'}
        </h3>
        <p className="font-body text-on-surface-variant max-w-md mb-8 text-sm leading-relaxed">
          {d.success}
        </p>
        <Button variant="secondary" onClick={() => setStatus('idle')}>
          {locale === 'en' ? 'Send Another Inquiry' : 'Kirim Pertanyaan Lain'}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot anti-spam field */}
      <input type="text" name="_honey" className="hidden" tabIndex="-1" autoComplete="off" />
      <input type="hidden" name="fish_id" value={initialFishId} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <input 
            type="text" 
            id="name" 
            name="name"
            required 
            className="w-full bg-transparent border-b border-white/[0.2] py-3 text-on-surface focus:outline-none focus:border-primary transition-colors peer"
            placeholder=" "
          />
          <label htmlFor="name" className="absolute left-0 top-3 font-body text-xs uppercase tracking-widest text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:[text-[10px]]">
            {d.name} *
          </label>
        </div>

        <div className="relative group">
          <input 
            type="email" 
            id="email" 
            name="email"
            className="w-full bg-transparent border-b border-white/[0.2] py-3 text-on-surface focus:outline-none focus:border-primary transition-colors peer"
            placeholder=" "
          />
          <label htmlFor="email" className="absolute left-0 top-3 font-body text-xs uppercase tracking-widest text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:[text-[10px]]">
            {d.email}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <input 
            type="tel" 
            id="whatsapp" 
            name="whatsapp"
            required 
            className="w-full bg-transparent border-b border-white/[0.2] py-3 text-on-surface focus:outline-none focus:border-primary transition-colors peer"
            placeholder=" "
          />
          <label htmlFor="whatsapp" className="absolute left-0 top-3 font-body text-xs uppercase tracking-widest text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:[text-[10px]]">
            {d.whatsapp} *
          </label>
        </div>

        <div className="relative group">
          <input 
            type="text" 
            id="subject" 
            name="subject"
            defaultValue={initialSubject}
            required 
            className="w-full bg-transparent border-b border-white/[0.2] py-3 text-on-surface focus:outline-none focus:border-primary transition-colors peer"
            placeholder=" "
          />
          <label htmlFor="subject" className="absolute left-0 top-3 font-body text-xs uppercase tracking-widest text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:[text-[10px]]">
            {d.subject} *
          </label>
        </div>
      </div>

      <div className="relative group">
        <textarea 
          id="message" 
          name="message"
          required 
          rows={4}
          className="w-full bg-transparent border-b border-white/[0.2] py-3 text-on-surface focus:outline-none focus:border-primary transition-colors peer resize-none"
          placeholder=" "
        ></textarea>
        <label htmlFor="message" className="absolute left-0 top-3 font-body text-xs uppercase tracking-widest text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:[text-[10px]]">
          {d.message} *
        </label>
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        className="w-full justify-center text-center font-bold tracking-widest text-xs"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? d.submitting : d.submit}
      </Button>
      
      {status === 'error' && (
        <p className="text-red-400 font-body text-xs text-center">{errorMessage}</p>
      )}
    </form>
  );
}

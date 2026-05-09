'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SplitText } from '@/components/motion/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Footer } from '@/components/layout/footer';

const contactSchema = z.object({
  intent: z.enum(['rfq', 'project', 'vendor', 'general']),
  name: z.string().min(2, 'Name is required'),
  company: z.string().min(2, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  sector: z.string().optional(),
  service: z.string().optional(),
  brief: z.string().min(10, 'Please provide more details'),
  timeline: z.string().optional(),
  budget: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      intent: 'rfq',
    },
  });

  const intent = watch('intent');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Mocking the API call for V1
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <>
      <main className="bg-[var(--color-bone)] text-[var(--color-ink)] min-h-screen pt-32 pb-24 px-[5vw]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--color-gold)] mb-6 block">
              Contact
            </span>
            <SplitText
              as="h1"
              className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] max-w-4xl"
            >
              Let's build <em>something</em>.
            </SplitText>
            <p className="mt-8 font-sans text-[16px] md:text-[18px] leading-[1.6] opacity-80 max-w-2xl">
              Tell us what you're working on. We respond within one business day. If your project is urgent, mark it as such — we have a same-day response track for time-critical work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20">
            {/* Form Column */}
            <div>
              {isSuccess ? (
                <div className="bg-[var(--color-ink)]/5 p-12 text-center rounded-sm border border-[var(--color-ink)]/10">
                  <h3 className="font-display text-[32px] tracking-[-0.01em] mb-4 text-[var(--color-gold)]">Got it.</h3>
                  <p className="font-sans text-[18px] opacity-80">
                    We've received your details and will be in touch within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
                  {/* INTENT */}
                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-6 border-b border-[var(--color-ink)]/20 pb-2">
                      Intent
                    </h2>
                    <div className="flex flex-wrap gap-6 font-sans text-[15px]">
                      {[
                        { value: 'rfq', label: 'RFQ' },
                        { value: 'project', label: 'Project enquiry' },
                        { value: 'vendor', label: 'Vendor' },
                        { value: 'general', label: 'General' },
                      ].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            value={opt.value}
                            {...register('intent')}
                            className="appearance-none w-4 h-4 rounded-full border border-[var(--color-ink)]/40 checked:border-[var(--color-gold)] checked:border-4 transition-all"
                          />
                          <span className={intent === opt.value ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 transition-opacity'}>
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* YOUR DETAILS */}
                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-6 border-b border-[var(--color-ink)]/20 pb-2">
                      Your Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[13px] opacity-80">Name</label>
                        <input
                          {...register('name')}
                          className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors"
                          disabled={isSubmitting}
                        />
                        {errors.name && <span className="text-red-500 text-[12px]">{errors.name.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[13px] opacity-80">Company</label>
                        <input
                          {...register('company')}
                          className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors"
                          disabled={isSubmitting}
                        />
                        {errors.company && <span className="text-red-500 text-[12px]">{errors.company.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[13px] opacity-80">Email</label>
                        <input
                          type="email"
                          {...register('email')}
                          className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors"
                          disabled={isSubmitting}
                        />
                        {errors.email && <span className="text-red-500 text-[12px]">{errors.email.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[13px] opacity-80">Phone (optional)</label>
                        <input
                          {...register('phone')}
                          className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* YOUR PROJECT */}
                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 mb-6 border-b border-[var(--color-ink)]/20 pb-2">
                      Your Project
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="font-sans text-[13px] opacity-80">Brief</label>
                        <textarea
                          {...register('brief')}
                          rows={4}
                          className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors resize-none"
                          disabled={isSubmitting}
                        />
                        {errors.brief && <span className="text-red-500 text-[12px]">{errors.brief.message}</span>}
                      </div>
                      
                      {intent !== 'vendor' && intent !== 'general' && (
                        <>
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-[13px] opacity-80">Sector</label>
                            <select
                              {...register('sector')}
                              className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors appearance-none rounded-none"
                              disabled={isSubmitting}
                            >
                              <option value="">Select sector</option>
                              <option value="commercial">Commercial</option>
                              <option value="residential">Residential</option>
                              <option value="industrial">Industrial</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-sans text-[13px] opacity-80">Service required</label>
                            <select
                              {...register('service')}
                              className="bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-gold)] py-2 outline-none font-sans text-[16px] transition-colors appearance-none rounded-none"
                              disabled={isSubmitting}
                            >
                              <option value="">Select service</option>
                              <option value="trading">Trading</option>
                              <option value="contracting">Contracting</option>
                              <option value="facility">Facility Services</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <MagneticButton
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[var(--color-ink)] text-[var(--color-bone)] border-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
                    </MagneticButton>
                    <span className="font-sans text-[14px] opacity-60">
                      Or email ops@procareqatar.com directly
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="flex flex-col gap-12 lg:border-l border-[var(--color-ink)]/10 lg:pl-16">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 border-b border-[var(--color-ink)]/20 pb-2 block">
                  Office
                </span>
                <address className="not-italic font-sans text-[15px] opacity-90 leading-[1.6]">
                  <span className="text-[var(--color-gold)]">// TODO: street address</span><br />
                  Doha, Qatar
                </address>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 border-b border-[var(--color-ink)]/20 pb-2 block">
                  Direct Lines
                </span>
                <div className="flex flex-col gap-2 font-sans text-[15px] opacity-90">
                  <a href="mailto:ops@procareqatar.com" className="hover:text-[var(--color-gold)] transition-colors">ops@procareqatar.com</a>
                  <a href="#" className="hover:text-[var(--color-gold)] transition-colors text-[var(--color-gold)]">+974 // TODO</a>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 border-b border-[var(--color-ink)]/20 pb-2 block">
                  Registry
                </span>
                <div className="flex flex-col gap-2 font-sans text-[15px] opacity-90">
                  <span>CR 217949</span>
                  <span>Capital QAR 100,000</span>
                  <span>Operating since 2024</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60 border-b border-[var(--color-ink)]/20 pb-2 block">
                  Hours
                </span>
                <div className="flex flex-col gap-2 font-mono text-[13px] opacity-90">
                  <div className="flex justify-between"><span>Sun–Thu</span><span>08:00–17:00</span></div>
                  <div className="flex justify-between"><span>Fri</span><span>Closed</span></div>
                  <div className="flex justify-between"><span>Sat</span><span>09:00–13:00 (urgent)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;

  return (
    <div className="bg-surface-container p-6 rounded-sm border border-white/[0.08] flex flex-col justify-between">
      <div className="mb-4">
        {testimonial.rating && (
          <div className="flex gap-1 text-primary text-sm mb-3">
            {'★'.repeat(testimonial.rating)}
            {'☆'.repeat(5 - testimonial.rating)}
          </div>
        )}
        <p className="text-on-surface-variant italic font-body text-sm leading-relaxed">
          &ldquo;{testimonial.quote || testimonial.content}&rdquo;
        </p>
      </div>
      <div className="border-t border-white/[0.08] pt-4 mt-2">
        <h4 className="font-display text-on-surface text-base">{testimonial.customer_name || testimonial.author_name}</h4>
        {testimonial.location && (
          <p className="text-outline text-xs tracking-wider uppercase">{testimonial.location}</p>
        )}
      </div>
    </div>
  );
}

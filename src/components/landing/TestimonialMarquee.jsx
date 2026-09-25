import React from 'react';
import { Quotes, Star, CheckCircle } from '@phosphor-icons/react';

export default function TestimonialMarquee() {
  const testimonials = [
    {
      quote: "Before ReRoot, our end-of-day sourdough batards were composted. Now, 30 loaves reach Kettle Society dinner plates within 90 minutes of closing.",
      author: "Soren Lindqvist",
      title: "Head Baker & Founder",
      org: "Levain & Leaf Bakery",
      impact: "180 kg rescued / mo"
    },
    {
      quote: "We serve 400 nutritious lunches daily. The direct dispatch notifications let us accept organic produce right at the peak of ripeness with zero red tape.",
      author: "Elena Rostova",
      title: "Executive Kitchen Director",
      org: "Kettle Friendship Society",
      impact: "4,200 meals weekly"
    },
    {
      quote: "The expiring ingredients generator turned my crisper drawer from a guilty compost bin into a culinary discovery station. We saved $160 this month alone.",
      author: "Dr. Alistair Vance",
      title: "Home Cook & Urban Forager",
      org: "Kitsilano Resident",
      impact: "24-day zero-waste streak"
    },
    {
      quote: "When our heritage apple trees produced 60kg of surplus fruit, the community marketplace matched all five boxes to neighborhood families in 3 hours.",
      author: "Nora Chen",
      title: "Community Garden Steward",
      org: "Point Grey Food Gleaners",
      impact: "60 kg fresh fruit shared"
    }
  ];

  return (
    <section
      style={{
        paddingBlock: 'var(--space-16)',
        backgroundColor: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', marginInline: 'auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-terracotta)',
              marginBottom: 'var(--space-2)'
            }}
          >
            Stories of the Common Table
          </div>
          <h2 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
            Voices from kitchens, bakeries, and neighborhood shelters.
          </h2>
        </div>
      </div>

      {/* Marquee Container */}
      <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        <div className="marquee-track" style={{ gap: 'var(--space-6)', paddingInline: 'var(--space-6)' }}>
          {/* Double array for infinite marquee */}
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                width: '380px',
                flexShrink: 0,
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-6)'
              }}
            >
              <div>
                <Quotes size={28} color="var(--color-terracotta)" weight="duotone" style={{ marginBottom: 'var(--space-3)' }} />
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    marginBottom: 'var(--space-6)'
                  }}
                >
                  "{item.quote}"
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--border-primary)'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {item.author}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      {item.title} • {item.org}
                    </div>
                  </div>

                  <span
                    className="badge badge-forest"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    {item.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

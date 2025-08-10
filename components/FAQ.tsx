interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Ramos?',
    answer: 'Ramos is an analytics platform for data‑driven teams.',
  },
  {
    question: 'Can I try it for free?',
    answer: 'Yes, start with a free plan and upgrade when you need more.',
  },
  {
    question: 'Is my data secure?',
    answer: 'We are GDPR compliant and support SSO with granular roles.',
  },
  {
    question: 'Do you offer support?',
    answer: 'Email support is included in all plans with SLA for enterprise.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'You can cancel your subscription at any time from the dashboard.',
  },
  {
    question: 'Do you integrate with other tools?',
    answer: 'Ramos connects to popular data warehouses and marketing platforms.',
  },
];

export default function FAQ() {
  return (
    <div className="space-y-4">
      {faqs.map((f, i) => (
        <details key={i} className="border-b pb-4">
          <summary className="cursor-pointer text-h3">
            {f.question}
          </summary>
          <p className="mt-2 text-body text-neutral-600">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

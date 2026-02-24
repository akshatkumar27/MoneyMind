export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How do I add a new financial goal?',
    answer:
      'Navigate to the "Pulse" tab and tap the "+" button in the top right corner. Follow the steps to set your goal name, target amount, and timeline.',
  },
  {
    id: '2',
    question: 'Is my data secure?',
    answer:
      'Yes, absolutely. We use bank-grade AES-256 encryption to protect your data. Your financial information is never shared with third parties without your explicit consent.',
  },
  {
    id: '3',
    question: 'Can I change my monthly investment amount?',
    answer:
      'Yes! Go to the "Contributions" screen for any specific goal and you can adjust your monthly contribution plan there.',
  },
  {
    id: '4',
    question: 'How do I delete my account?',
    answer:
      'You can delete your account from the "Personal Information" screen. Note that this action is permanent and cannot be undone.',
  },
];

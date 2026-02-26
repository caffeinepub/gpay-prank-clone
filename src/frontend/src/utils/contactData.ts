export interface Contact {
  id: number;
  name: string;
  phone: string;
  upiId: string;
  avatarPath: string;
  initials: string;
  color: string;
}

export const CONTACTS: Contact[] = [
  {
    id: 1,
    name: 'Erika Mate',
    phone: '9876543210',
    upiId: 'erika.mate@ybl',
    avatarPath: '/assets/generated/avatar-contact-1.dim_128x128.png',
    initials: 'EM',
    color: 'oklch(0.65 0.18 200)',
  },
  {
    id: 2,
    name: 'Nengneilhing Kipgen',
    phone: '9845678901',
    upiId: 'nengneilhing.kipgen@okaxis',
    avatarPath: '/assets/generated/avatar-contact-2.dim_128x128.png',
    initials: 'NK',
    color: 'oklch(0.68 0.2 320)',
  },
  {
    id: 3,
    name: 'Amit Patel',
    phone: '9812345678',
    upiId: 'amit.patel@paytm',
    avatarPath: '/assets/generated/avatar-contact-3.dim_128x128.png',
    initials: 'AP',
    color: 'oklch(0.7 0.18 60)',
  },
];

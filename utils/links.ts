type NavLink = {
  href: string;
  label: string;
};

export const groupedLinks = {
  general: <NavLink[]>[
    { href: '/', label: 'home' },
    { href: '/favorites', label: 'favorites' },
    { href: '/bookings', label: 'bookings' },
    { href: '/reviews', label: 'reviews' },
  ],
  property: <NavLink[]>[
    { href: '/rentals/create', label: 'create property' },
    { href: '/rentals', label: 'my property' },
  ],
  gallery: <NavLink[]>[
    { href: '/gallery/create', label: 'create gallery' },
    { href: '/gallery', label: 'my gallery' },
  ],
  exclusivehighlight: <NavLink[]>[
    { href: '/promotions/create', label: 'create exclusive highlight' },
    { href: '/promotions', label: 'my exclusive highlight' },
  ],
  admin: <NavLink[]>[
    { href: '/reservations', label: 'reservations' },
    { href: '/admin', label: 'admin' }
  ],
  profile: <NavLink[]>[
    { href: '/profile', label: 'profile' },
  ],
  member: <NavLink[]>[
    { href: '/member/create', label: 'exclusive member' },
    { href: '/member/dashboard', label: 'dashboard' },
    { href: '/member/profile', label: 'member profile' },
    { href: '/member/referrals', label: 'referrals' },
    { href: '/member/rewards', label: 'rewards' },
    { href: '/member/downline', label: 'downline' },
    { href: '/member/contact', label: 'contact' },
  ],

};

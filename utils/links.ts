type NavLink = {
  href: string;
  label: string;
};

export const groupedLinks = {
  general: <NavLink[]>[
    { href: '/', label: 'home' },
    { href: '/favorites', label: 'favorites' },
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
  // promotions: <NavLink[]>[
  //   { href: '/promotions/create', label: 'create promotions' },
  //   { href: '/promotions', label: 'promotions' },
  // ],
  admin: <NavLink[]>[
    { href: '/reservations', label: 'reservations' },
    { href: '/bookings', label: 'bookings' },
    { href: '/admin', label: 'admin' },
  ],
  profile: <NavLink[]>[
    { href: '/profile', label: 'profile' },
  ],
};

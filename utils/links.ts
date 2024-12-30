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
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import Link from 'next/link';
import { Button } from '../ui/button';
import UserIcon from './UserIcon';
import { groupedLinks } from '@/utils/links';
import SignOutLink from './SignOutLink';
import { SignedOut, SignedIn, SignInButton, SignUpButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { fetchMember, fetchProfile } from '@/utils/actions';


function LinksDropdown({ member }: { member: any }) {
  const { userId } = auth();
  const isAdminUser = userId === process.env.ADMIN_USER_ID;

  // Check if a section has visible links
  const hasVisibleLinks = (links, adminOnly = false) =>
    links.some((link) => !adminOnly || isAdminUser || !['create', 'my'].some((prefix) => link.label.startsWith(prefix)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 max-w-[100px]">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start" sideOffset={10}>
        {/* Signed Out Links */}
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode="modal">
              <button className="w-full text-left">Login</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignUpButton mode="modal">
              <button className="w-full text-left">Register</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>

        <SignedIn>
          {/* General Links */}
          {groupedLinks.general.map((link) => (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="capitalize w-full">
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}

          {/* Exclusive Highlight */}
          {hasVisibleLinks(groupedLinks.exclusivehighlight, true) && (
            <>
              <DropdownMenuSeparator />
              {groupedLinks.exclusivehighlight.map((link) => {
                const isAdminPage = ['my exclusive highlight', 'create exclusive highlight'].includes(link.label);
                if (isAdminPage && !isAdminUser) return null;

                return (
                  <DropdownMenuItem key={link.href}>
                    <Link href={link.href} className="capitalize w-full">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {/* Property Links */}
          {hasVisibleLinks(groupedLinks.property, true) && (
            <>
              <DropdownMenuSeparator />
              {groupedLinks.property.map((link) => {
                const isAdminPage = ['reservations', 'create property', 'my property'].includes(link.label);
                if (isAdminPage && !isAdminUser) return null;

                return (
                  <DropdownMenuItem key={link.href}>
                    <Link href={link.href} className="capitalize w-full">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {/* Gallery Links */}
          {hasVisibleLinks(groupedLinks.gallery, true) && (
            <>
              <DropdownMenuSeparator />
              {groupedLinks.gallery.map((link) => {
                const isAdminPage = ['my gallery', 'create gallery'].includes(link.label);
                if (isAdminPage && !isAdminUser) return null;

                return (
                  <DropdownMenuItem key={link.href}>
                    <Link href={link.href} className="capitalize w-full">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {/* Admin Links */}
          {isAdminUser && (
            <>
              <DropdownMenuSeparator />
              {groupedLinks.admin.map((link) => (
                <DropdownMenuItem key={link.href}>
                  <Link href={link.href} className="capitalize w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {/* Profile Links */}
          {hasVisibleLinks(groupedLinks.profile) && (
            <>
              <DropdownMenuSeparator />
              {groupedLinks.profile.map((link) => (
                <DropdownMenuItem key={link.href}>
                  <Link href={link.href} className="capitalize w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {/* Member Links */}
          {hasVisibleLinks(groupedLinks.member) && (
            <>
              <DropdownMenuSeparator />
              {groupedLinks.member.map((link) => {
                const isMemberPage = ['member profile'].includes(link.label);
                const isNonMemberPage = ['exclusive member'].includes(link.label);
                if (isMemberPage && !member) return null;
                if (isNonMemberPage && member) return null;
                return(
                <DropdownMenuItem key={link.href}>
                  <Link href={link.href} className="capitalize w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
                );
              })}
            </>
          )}

          {/* Sign Out */}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const getServerSideProps = async () => {
  const profile = await fetchProfile(); // Your async fetchProfile function
  const member = await fetchMember(profile.id);
  return {
    props: {
      member: member || null, // Pass the profile data as props
    },
  };
};

export default LinksDropdown;

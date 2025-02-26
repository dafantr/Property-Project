'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { LuShare2 } from 'react-icons/lu';

import {
  TwitterShareButton,
  EmailShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  TwitterIcon,
  EmailIcon,
  LinkedinIcon,
  WhatsappIcon,
  FacebookIcon,
} from 'react-share';

function ShareButton({
  id,
  name,
  type, // Accepts "properties" or "promotions"
}: {
  id: string;
  name: string;
  type: "properties" | "promotions";
}) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${url}/${type}/${id}`;
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset notification after 2 seconds
  };

  // Close the popover when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false); // Close popover on scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='p-2'>
          <LuShare2 />
        </Button>
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent
          ref={popoverRef}
          side='bottom'
          align='center'
          sideOffset={10}
          className='flex flex-col items-center gap-y-3 w-[250px] md:w-[300px]'
        >
          {/* Social Media Share Icons */}
          <div className="flex flex-wrap items-center gap-3 justify-center w-full">
            <TwitterShareButton url={shareLink} title={name}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareLink} title={name}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <EmailShareButton url={shareLink} subject={name}>
              <EmailIcon size={32} round />
            </EmailShareButton>
            <WhatsappShareButton url={shareLink} title={name}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookShareButton url={shareLink}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
          </div>

          {/* Separator Line */}
          <div className="w-full border-t border-gray-300"></div>

          {/* Copy Link Section */}
          <div className="flex flex-col items-center gap-y-2 w-full text-center">
            <p className="text-sm text-gray-600 truncate max-w-[90%] md:max-w-full">
              {shareLink}
            </p>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              Copy Link
            </Button>
          </div>

          {/* Pop-up Notification */}
          {copied && (
            <div className="absolute bottom-[-50px] bg-green-500 text-white text-sm px-3 py-1 rounded-md shadow-md animate-fade-in">
              ✅ Link copied!
            </div>
          )}
        </PopoverContent>
      )}
    </Popover>
  );
}

export default ShareButton;

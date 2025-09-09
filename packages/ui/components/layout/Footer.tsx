import React from 'react';
import { cn } from '../../utils/cn';

export interface FooterProps {
  className?: string;
  children?: React.ReactNode;
  logo?: React.ReactNode;
  links?: FooterLinkGroup[];
  social?: SocialLink[];
  copyright?: string;
  simple?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  children,
  logo,
  links,
  social,
  copyright,
  simple = false,
}) => {
  if (simple) {
    return (
      <footer className={cn('py-4 px-4 lg:px-6', className)}>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          {/* Logo */}
          {logo && (
            <div className="flex items-center">
              {logo}
            </div>
          )}

          {/* Copyright */}
          {copyright && (
            <p className="text-sm text-base-content/60">
              {copyright}
            </p>
          )}

          {/* Social Links */}
          {social && social.length > 0 && (
            <div className="flex items-center space-x-4">
              {social.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 hover:text-base-content transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Custom Content */}
        {children}
      </footer>
    );
  }

  return (
    <footer className={cn('py-8 px-4 lg:px-6', className)}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            {logo && (
              <div className="mb-4">
                {logo}
              </div>
            )}
            {children && (
              <div className="text-base-content/70 max-w-md">
                {children}
              </div>
            )}
          </div>

          {/* Link Groups */}
          {links && links.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="font-semibold text-base-content mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-base-content/60 hover:text-base-content transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-base-300">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Copyright */}
            {copyright && (
              <p className="text-sm text-base-content/60">
                {copyright}
              </p>
            )}

            {/* Social Links */}
            {social && social.length > 0 && (
              <div className="flex items-center space-x-4">
                {social.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-content/60 hover:text-base-content transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
# Development Notes - M Hasan Portfolio

## Project Overview

This is a modern portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. The project was created to replace the existing portfolio at https://mahedi-hasan-p2.vercel.app/ with a more modern, aesthetic, and informative design.

## Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

### Project Structure

```
/
├── app/
│   ├── components/         # React components
│   │   ├── Hero.tsx       # Landing section with animations
│   │   ├── About.tsx      # About section with stats
│   │   ├── Skills.tsx     # Skills with progress bars
│   │   ├── Projects.tsx   # Project showcase
│   │   └── Contact.tsx    # Contact form and links
│   ├── page.tsx           # Main page composition
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles
│   └── favicon.ico        # Site favicon
├── public/                # Static assets
├── docs/                  # Documentation
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind configuration
└── next.config.ts         # Next.js configuration
```

## Design System

### Color Palette

- **Primary Gradient**: Purple to Pink (`from-purple-500 to-pink-500`)
- **Background**: Dark gradient (`from-slate-900 via-purple-900 to-slate-900`)
- **Text Colors**: 
  - Primary: White
  - Secondary: `text-slate-300`
  - Muted: `text-slate-400`

### UI Patterns

- **Glassmorphism**: `bg-white/5 backdrop-blur-sm border border-white/10`
- **Buttons**: Gradient background with hover effects
- **Cards**: Semi-transparent with border and hover scale
- **Animations**: Fade-in, slide-in, and scale effects using Framer Motion

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Component Details

### Hero Component
- Animated gradient background with floating orbs
- Social media links
- CTA buttons with smooth scroll functionality
- Animated arrow indicator

### About Component
- Two-column layout (content + stats)
- Four statistics cards with icons
- "What I Do" section with three columns
- Uses `useInView` hook for scroll-based animations

### Skills Component
- Four categories of skills
- Animated progress bars
- Technology badge cloud
- Responsive grid layout

### Projects Component
- Six featured projects in grid layout
- Color-coded top borders
- Technology tags
- Links to GitHub and live demos
- Hover effects with scale and shadow

### Contact Component
- Two-column layout (info + form)
- Four contact methods with icons
- Contact form (ready for backend integration)
- Location information
- "Looking for Collaboration" section
- Footer with copyright

## Development

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Key Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Vercel auto-detects Next.js configuration
3. No additional configuration needed
4. Automatic deployments on push to main branch

### Environment Variables

No environment variables are currently required. If adding backend integration for the contact form, you may need:

- `NEXT_PUBLIC_API_URL` - API endpoint for form submission
- Email service credentials (e.g., SendGrid, Mailgun)

## Customization Guide

### Updating Content

1. **Personal Information**: Edit `app/components/Hero.tsx`
2. **About Text**: Edit `app/components/About.tsx`
3. **Skills**: Modify `skillCategories` array in `app/components/Skills.tsx`
4. **Projects**: Update `projects` array in `app/components/Projects.tsx`
5. **Contact Info**: Edit `contactInfo` array in `app/components/Contact.tsx`

### Changing Colors

1. Update gradient colors in Tailwind classes
2. Modify `globals.css` for custom scrollbar colors
3. Maintain consistency across all components

### Adding New Sections

1. Create new component in `app/components/`
2. Import and add to `app/page.tsx`
3. Follow existing animation patterns with Framer Motion
4. Use consistent styling with glassmorphism effects

## Performance Optimizations

- Static generation with Next.js
- Optimized images (use Next.js Image component)
- Code splitting by component
- Lazy loading for animations
- Minimal JavaScript bundle size

## Accessibility

- Semantic HTML elements
- Proper heading hierarchy
- Alt text for icons (using SVG)
- Keyboard navigation support
- Focus states for interactive elements
- Proper color contrast ratios

## Security

✅ Passed CodeQL security scan (0 vulnerabilities)
✅ No sensitive data in repository
✅ Dependencies are up to date
✅ Proper .gitignore configuration

## Future Enhancements

Potential improvements for future iterations:

1. **Backend Integration**:
   - Connect contact form to email service
   - Add form validation and error handling
   - Implement success/error notifications

2. **Content Management**:
   - Add CMS integration (e.g., Sanity, Contentful)
   - Make content editable without code changes

3. **Analytics**:
   - Add Google Analytics or Vercel Analytics
   - Track user interactions and page views

4. **Blog Section**:
   - Add blog functionality
   - Markdown-based content
   - RSS feed

5. **Dark/Light Mode**:
   - Add theme toggle
   - Persist user preference
   - Smooth theme transitions

6. **Internationalization**:
   - Add multi-language support
   - Language switcher

7. **Enhanced Animations**:
   - Add more interactive elements
   - Parallax scrolling effects
   - Mouse-following effects

## Troubleshooting

### Build Issues

- **Font loading errors**: Removed Google Fonts to avoid external dependency issues
- **Build cache**: No build cache is normal on first build

### Common Problems

1. **Port already in use**: Change port in `package.json` or kill existing process
2. **Dependencies not found**: Run `npm install`
3. **TypeScript errors**: Check `tsconfig.json` and component types

## Maintenance

- Update dependencies regularly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Test on multiple devices and browsers
- Keep content up to date

## Contact

For questions or issues with this portfolio:
- GitHub: [@M-Hasan-11](https://github.com/M-Hasan-11)
- Email: contact@mhasan.dev

---

Last Updated: November 2024
Created by: M Hasan

// featurehighlights.tsx
'use client';
import { featureList } from '@/utils/features';
import { ScrollArea, ScrollBar } from '../ui/scroll-area'; // Ensure you have your ScrollArea component

function FeaturesHighlights() {
  return (
    <section style={{ overflow: 'hidden' }}>
      <h2
        style={{
          margin: '2rem auto',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}
      >
        Million Dollar View Villas Promises
      </h2>
      <ScrollArea className="py-6" style={{ overflow: 'hidden' }}>
        <div className="scrolling-content">
          {featureList.map((feature) => (
            <div
              key={feature.id}
              style={{
                backgroundColor: '#fff', // White background
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                textAlign: 'center',
                flex: '0 0 auto', // Prevent flex item from shrinking
                marginRight: '1.5rem', // Space between items
              }}
            >
              <img
                src={feature.icon} // Add the icon image
                alt={feature.title} // Alt text for accessibility
                style={{
                  width: '60px', // Increase the size of the icon
                  height: '60px',
                  marginBottom: '0.5rem', // Space between icon and text
                  display: 'block', // Center the icon
                  marginLeft: 'auto', // Center horizontally
                  marginRight: 'auto', // Center horizontally
                }}
              />
              <h3
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '1.2rem', // Decrease the font size
                  fontWeight: 'normal', // Normal weight
                  color: '#444',
                }}
              >
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
        {/* <ScrollBar orientation="horizontal" /> */}
      </ScrollArea>
      <style jsx>{`
        .scrolling-content {
          display: inline-flex; // Align items in a row
          animation: scroll 20s linear infinite; // Adjust the duration to change speed
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturesHighlights;

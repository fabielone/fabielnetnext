import { useSpring, animated } from '@react-spring/web';
import React from 'react';
import { useInView } from 'react-intersection-observer';

interface HeaderProps {
  pill: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  learnMoreLink: string;
  imageUrl: string;
  items: { icon: string; text: string }[];
  imagePosition?: 'left' | 'right'; // Optional prop to position the image
}

const Header: React.FC<HeaderProps> = ({
  pill,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  learnMoreLink,
  imageUrl,
  items,
  imagePosition = 'right', // Default value
}) => {
  const [contentRef, inView] = useInView({
    triggerOnce: false, // Trigger animation once
    rootMargin: '-100px 0px', // Adjust root margin as needed
  });

  const imageSlideProps = useSpring({
    from: { transform: imagePosition === 'left' ? 'translateX(-100%)' : 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const contentSlideProps = useSpring({
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-50px)' },
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <div ref={contentRef} className="relative px-4 mx-auto lg:py-2 md:px-8 xl:px-12 sm:max-w-xl md:max-w-full">
      <div className={`max-w-xl border-t-2 py-2 mx-auto lg:max-w-screen-xl lg:flex ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
        <animated.div style={imageSlideProps} className="flex justify-center h-full overflow-hidden lg:w-2/3 xl:w-1/2 lg:justify-start lg:items-end">
          <img
            src={imageUrl}
            className="object-cover object-top w-full h-64 max-w-xl rounded shadow-2xl lg:h-auto lg:max-w-screen-md"
            alt=""
          />
        </animated.div>
        <animated.div style={contentSlideProps} className="mb-16 lg:max-w-lg lg:mb-0 lg:ml-8">
          <div className="max-w-xl mb-6">
            <div>
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                {pill}
              </p>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
              {title}
              <br className="hidden md:block" />
              {subtitle}
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              {description}
            </p>
          </div>
          <div className="flex items-center mb-6">
            <a
              href={buttonLink}
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
            >
              {buttonText}
            </a>
            <a
              href={learnMoreLink}
              aria-label=""
              className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
            >
              Learn more
            </a>
          </div>
          <ul className="list-disc pl-5">
            {items.map((item, index) => (
              <li key={index} className="mb-2 flex items-center">
                <span className="mr-2">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </animated.div>
      </div>
    </div>
  );
};

export default Header;
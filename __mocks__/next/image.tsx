import React from 'react';

type MockImageProps = {
  alt: string;
  src: string | { src: string };
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

const NextImage = ({ src, alt, ...rest }: MockImageProps) => {
  const resolvedSrc = typeof src === 'string' ? src : src.src;

  return React.createElement('img', {
    src: resolvedSrc,
    alt,
    ...rest,
  });
};

export default NextImage;

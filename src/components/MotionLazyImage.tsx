import { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  LazyLoadImage,
} from "react-lazy-load-image-component";
import type {
  LazyLoadImageProps,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // nice blur effect

// Wrap LazyLoadImage with forwardRef and pass innerRef
const LazyImage = forwardRef<HTMLImageElement, LazyLoadImageProps>(
  (props) => {
    return <LazyLoadImage {...props} />;
  }
);

// Create motion-enabled version
const MotionLazyImage = motion.create(LazyImage);

export default MotionLazyImage;
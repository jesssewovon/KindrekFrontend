import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";

type Props = {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  placeholderSrc?: string;
  effect?: "blur" | "opacity";
};

export default function MotionLazyImage({
  src,
  alt,
  style,
  width,
  height,
  placeholderSrc,
  effect = "blur",
}: Props) {
  return (
    <motion.div style={{ width, height }}>
      <LazyLoadImage
        src={src}
        alt={alt}
        effect={effect}
        placeholderSrc={placeholderSrc}
        style={style}
        width={width}
        height={height}
      />
    </motion.div>
  );
}
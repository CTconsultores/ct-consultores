import Image from "next/image";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: 80,
  sm: 110,
  md: 150,
  lg: 200,
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const px = sizes[size];
  return (
    <Image
      src="/logo.png"
      alt="CT Consultores"
      width={px}
      height={px}
      className={`object-contain ${className}`}
      priority
    />
  );
}

import { type SVGAttributes, forwardRef } from "react";

export type ProgressProps = {
  progress: number;
  dims: { width: number; radius: number };
  strokeRatio: number;
} & SVGAttributes<SVGSVGElement>;

export const Progress = forwardRef<SVGSVGElement, ProgressProps>(
  function Progress(
    { progress, dims: { width, radius }, strokeRatio = 0.1, ...props },
    ref
  ) {
    const strokeWidth = 0.9 - strokeRatio;
    return (
      <svg
        viewBox={`0 0 ${width} ${radius * 2}`}
        height={radius * 2}
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        <rect
          height={radius * 2 * strokeWidth}
          width={width * strokeWidth}
          fill="transparent"
          strokeWidth={width * strokeRatio}
          rx={radius}
          ry={radius}
          x={width * strokeRatio}
          y={radius * 2 * strokeRatio}
          className="stroke-border"
        />
        <rect
          height={radius * 2 * strokeWidth}
          width={width * strokeWidth}
          rx={radius}
          ry={radius}
          fill="transparent"
          className={`${
            progress < 0.05 ? "stroke-destructive" : "stroke-primary"
          } transition-all duration-150`}
          strokeDasharray={
            radius * strokeWidth * 3.14 * 2 + (width - radius * 2)
          }
          x={width * strokeRatio}
          y={radius * 2 * strokeRatio}
          strokeDashoffset={Math.max(
            (radius * strokeWidth * 3.14 * 2 + (width - radius * 2)) * progress,
            progress
          )}
          strokeWidth={width * strokeRatio}
        />
      </svg>
    );
  }
);

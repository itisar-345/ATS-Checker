import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef(({ value, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} style={{position: 'relative', height:'1rem', width:'100%', overflow: 'hidden', borderRadius: '9999px', backgroundColor:'rgba(59, 130, 246, 0.05)'}} {...props}>
    <ProgressPrimitive.Indicator
      style={{ height:'100%', width:'100%', backgroundColor: '#3B82F6', transition: 'transform 0.3s ease' ,transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = "Progress";

export { Progress };

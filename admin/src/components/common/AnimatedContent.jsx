const AnimatedContent = ({ children, className = "" }) => {
  return <div className={`tab tab-enter ${className}`}>{children}</div>; };
export default AnimatedContent;  

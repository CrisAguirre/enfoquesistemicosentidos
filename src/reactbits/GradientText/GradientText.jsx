import './GradientText.css';

const GradientText = ({
  children,
  className = '',
  colors = ['#3b82f6', '#06b6d4', '#3b82f6'],
  animationSpeed = 5,
  showBorder = false,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span className={`gradient-text-wrapper ${showBorder ? 'with-border' : ''} ${className}`}>
      <span className="gradient-text-inner" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
};

export default GradientText;


// Badge component that takes 'type' and 'text' as props
const Badge = ({ type = 'info', text }) => {
  // Define the badge styles for different types
  const badgeStyles = {
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    primary: 'bg-indigo-100 text-indigo-800',
  };

  // Get the correct style based on the 'type' prop
  const badgeClass = badgeStyles[type] || badgeStyles.info;

  return (
    <span className={`px-3 w-fit py-1 text-sm font-semibold rounded-md h-fit ${badgeClass}`}>
      {text}
    </span>
  );
};

export default Badge;

interface ButtonProps {
    text: string;
    onClick?: () => void;
  }
  
  const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
      <button
        onClick={onClick}
        className="bg-blue-600 text-white px-4 py-2 rounded w-80"
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  
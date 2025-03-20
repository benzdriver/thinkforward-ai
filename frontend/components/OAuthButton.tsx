import { FaGoogle, FaGithub, FaMicrosoft } from 'react-icons/fa';

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'microsoft';
  onClick: () => void;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onClick }) => {
  const getIcon = () => {
    switch (provider) {
      case 'google': return <FaGoogle className="mr-2" />;
      case 'github': return <FaGithub className="mr-2" />;
      case 'microsoft': return <FaMicrosoft className="mr-2" />;
      default: return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center border p-2 w-80 rounded mb-2"
    >
      {getIcon()} Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
};


import Navbar from '../../components/Navbar';
import OAuthButton from '../../components/OAuthButton';

const Login: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-bold">Login</h1>
        <OAuthButton provider="google" onClick={() => console.log("Google OAuth")} />
        <OAuthButton provider="github" onClick={() => console.log("GitHub OAuth")} />
        <OAuthButton provider="microsoft" onClick={() => console.log("Microsoft OAuth")} />
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import OAuthButton from '../../components/OAuthButton';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.message || 'Signup successful!');
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <OAuthButton provider="google" onClick={() => console.log("Google OAuth")} />
        <OAuthButton provider="github" onClick={() => console.log("GitHub OAuth")} />
        <OAuthButton provider="microsoft" onClick={() => console.log("Microsoft OAuth")} />

        <form className="mt-5 space-y-4">
          <Input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <Button text="Sign Up" onClick={handleSignup} />
        </form>
      </div>
    </div>
  );
};

export default Signup;

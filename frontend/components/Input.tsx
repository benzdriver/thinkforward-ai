interface InputProps {
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  const Input: React.FC<InputProps> = ({ type, name, placeholder, value, onChange }) => {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border p-2 w-80 rounded"
        required
      />
    );
  };
  
  export default Input;
  
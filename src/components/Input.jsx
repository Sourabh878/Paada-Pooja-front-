function Input({ type = 'text', placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{
        width: '93%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '15px'
      }}
      {...props}
    />
  );
}

export default Input;

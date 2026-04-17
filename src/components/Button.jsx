function Button({ children }) {
  return (
    <button
      style={{
        width: '100%',
        padding: '12px',
        background: '#e65100',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}

export default Button;

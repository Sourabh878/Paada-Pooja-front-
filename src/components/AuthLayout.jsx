function AuthLayout({ title, children }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    background: '#fff',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#bf360c'
  }
};

export default AuthLayout;

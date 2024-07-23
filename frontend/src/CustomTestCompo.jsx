import React from 'react';

const CustomTestCompo = ({ title, content, imageUrl, onClick }) => {
  return (
    <div className="custom-card" onClick={onClick} style={styles.card}>
      {imageUrl && <img src={imageUrl} alt={title} style={styles.image} />}
      <div style={styles.content}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.text}>{content}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px 8px 0 0',
  },
  content: {
    padding: '16px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '1.5em',
  },
  text: {
    margin: '0',
    fontSize: '1em',
    color: '#333',
  },
};

export default CustomTestCompo;

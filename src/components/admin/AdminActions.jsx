
const AdminActions = ({ onEdit, onDelete }) => {
  return (
    <div>
      <button onClick={onEdit}>✏️ Modifier</button>
      <button onClick={onDelete} style={{ marginLeft: '10px', color: 'red' }}>🗑️ Supprimer</button>
    </div>
  );
};

export default AdminActions;
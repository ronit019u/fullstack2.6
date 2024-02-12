const Person = ({person, onDelete}) => {
    const handleDelete = () => {
        if(window.confirm(`Delete this ${person.name}?`)) {
            onDelete(person.id);
        }
    }
    return (
        <div>
            {person.name} - {person.number}
            <button onClick={handleDelete}>delete</button>
        </div>
    );
};

export default Person;
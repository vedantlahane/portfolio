import React, { useState, useEffect, useRef } from 'react';

const EditableText = ({
  value,
  onSave,
  type = 'input',
  className = '',
  textClassName = '',
  inputClassName = '',
  placeholder = 'Click to edit...',
  isAdmin = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setCurrentVal(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text in input
      if (type === 'input') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  if (!isAdmin) {
    return <span className={textClassName}>{value || ''}</span>;
  }

  const handleSave = () => {
    setIsEditing(false);
    if (currentVal !== value) {
      onSave(currentVal);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setCurrentVal(value || '');
      setIsEditing(false);
    } else if (e.key === 'Enter' && type === 'input') {
      handleSave();
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef,
      value: currentVal,
      onChange: (e) => setCurrentVal(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      className: `w-full bg-white border border-gray-900 text-gray-900 px-2 py-1 focus:outline-none rounded-none text-base ${inputClassName}`
    };

    return (
      <div className={`w-full inline-block ${className}`}>
        {type === 'textarea' ? (
          <textarea {...commonProps} rows={4} />
        ) : (
          <input type="text" {...commonProps} />
        )}
      </div>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`group relative cursor-pointer inline-flex items-center gap-1 border-b border-dashed border-gray-300 hover:border-gray-900 transition-colors ${className}`}
      title="Click to edit"
    >
      <span className={textClassName}>{value || <span className="text-gray-400 italic">{placeholder}</span>}</span>
      <span className="opacity-0 group-hover:opacity-100 ml-1 text-xs text-gray-400 font-mono transition-opacity select-none" aria-hidden="true">
        ✎
      </span>
    </span>
  );
};

export default EditableText;

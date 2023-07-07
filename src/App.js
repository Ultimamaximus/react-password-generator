import React, { useState, useCallback } from 'react';
import './App.css';
import { numbers, upperCaseLetters, lowerCaseLetters, specialCharacters } from './Character';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';


const App = () => {
  // State variables
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(26);
  const [includeUpperCase, setIncludeUpperCase] = useState(false);
  const [includeLowerCase, setIncludeLowerCase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  // Generate password button click handler
  const handleGeneratePassword = () => {
    const checkboxes = [includeUpperCase, includeLowerCase, includeNumbers, includeSymbols];

    if (!checkboxes.some((checkbox) => checkbox)) {
      notify('To generate a password, you must select at least one checkbox', true);
      return;
    }

    const characterList = [
      includeNumbers && numbers,
      includeUpperCase && upperCaseLetters,
      includeLowerCase && lowerCaseLetters,
      includeSymbols && specialCharacters,
    ].filter(Boolean).join('');

    if (characterList.length === 0) {
      notify('To generate a password, you must select at least one checkbox', true);
      return;
    }

    const newPassword = createPassword(characterList);
    setPassword(newPassword);
    notify('Password generated successfully', false);
  };

  // Function to generate a password based on selected options
  const createPassword = (characterList) => {
    const characterListLength = characterList.length;
    const passwordArray = Array.from(crypto.getRandomValues(new Uint32Array(passwordLength)));
    const password = passwordArray.map((index) => characterList[index % characterListLength]).join('');
    return password;
  };

  // Copy password to clipboard
  const copyToClipboard = () => {
    if (password === '') {
      notify('Failed to copy password. No password generated.', true);
    } else {
      navigator.clipboard.writeText(password);
      notify('Password copied to clipboard successfully');
    }
  };

  // Notification toast handler
  const notify = useCallback(
    (message, hasError = false) => {
      toast[hasError ? 'error' : 'success'](message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    []
  );

  // Checkbox options
  const checkboxOptions = [
    {
      id: 'uppercase-letters',
      name: 'includeUpperCase',
      label: 'Add Uppercase Letters',
      checked: includeUpperCase,
      onChange: setIncludeUpperCase,
    },
    {
      id: 'lowercase-letters',
      name: 'includeLowerCase',
      label: 'Add Lowercase Letters',
      checked: includeLowerCase,
      onChange: setIncludeLowerCase,
    },
    {
      id: 'include-numbers',
      name: 'includeNumbers',
      label: 'Include Numbers',
      checked: includeNumbers,
      onChange: setIncludeNumbers,
    },
    {
      id: 'include-symbols',
      name: 'includeSymbols',
      label: 'Include Symbols',
      checked: includeSymbols,
      onChange: setIncludeSymbols,
    },
  ];

  return (
    <div className="App">
      <div className="container">
        <div className="generator">
          <h2 className="generator__header">Password Generator</h2>
          <div className="generator__password">
            <h3>{password}</h3>
            <button className="copy__btn" onClick={copyToClipboard}>
              <FontAwesomeIcon icon={faClipboard} />
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="password-strength">Password length</label>
            <input
              className="pw"
              value={passwordLength}
              onChange={(e) => setPasswordLength(e.target.value)}
              type="number"
              id="password-strength"
              name="password-strength"
              max="26"
              min="8"
            />
          </div>
          {/* Render checkbox options */}
          {checkboxOptions.map((option) => (
            <div className="form-group" key={option.id}>
              <label htmlFor={option.id}>{option.label}</label>
              <input
                type="checkbox"
                id={option.id}
                name={option.name}
                defaultChecked={option.checked}
                onChange={(e) => option.onChange(e.target.checked)}
              />
            </div>
          ))}
          <button className="generator__btn" onClick={handleGeneratePassword}>
            Generate Password
          </button>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default App;
